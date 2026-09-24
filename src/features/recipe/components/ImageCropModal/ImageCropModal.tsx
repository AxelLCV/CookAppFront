import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './ImageCropModal.css';

type ImageCropModalProps = {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

const OUTPUT_SIZE = 800;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function ImageCropModal({ imageUrl, onCancel, onConfirm }: ImageCropModalProps) {
  const { t } = useTranslation('common');
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const scale = baseScale * zoom;

  const clampOffset = (x: number, y: number, currentScale: number) => {
    const viewport = viewportRef.current;
    if (!viewport || !natural) return { x, y };

    const viewportSize = viewport.clientWidth;
    const displayWidth = natural.width * currentScale;
    const displayHeight = natural.height * currentScale;

    const minX = Math.min(0, viewportSize - displayWidth);
    const minY = Math.min(0, viewportSize - displayHeight);

    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  };

  const handleImageLoad = () => {
    const img = imgRef.current;
    const viewport = viewportRef.current;
    if (!img || !viewport) return;

    const viewportSize = viewport.clientWidth;
    const nextBaseScale = viewportSize / Math.min(img.naturalWidth, img.naturalHeight);
    const displayWidth = img.naturalWidth * nextBaseScale;
    const displayHeight = img.naturalHeight * nextBaseScale;

    setNatural({ width: img.naturalWidth, height: img.naturalHeight });
    setBaseScale(nextBaseScale);
    setZoom(1);
    setOffset({
      x: (viewportSize - displayWidth) / 2,
      y: (viewportSize - displayHeight) / 2,
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!natural) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = { startX: event.clientX, startY: event.clientY, originX: offset.x, originY: offset.y };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    setOffset(clampOffset(dragState.current.originX + dx, dragState.current.originY + dy, scale));
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const applyZoom = (nextZoom: number) => {
    const viewport = viewportRef.current;
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));

    if (!viewport || !natural) {
      setZoom(clampedZoom);
      return;
    }

    const viewportSize = viewport.clientWidth;
    const nextScale = baseScale * clampedZoom;

    // Keep the point currently at the viewport's center fixed while zooming,
    // instead of always zooming toward the image's top-left corner.
    const centerImageX = (viewportSize / 2 - offset.x) / scale;
    const centerImageY = (viewportSize / 2 - offset.y) / scale;

    setZoom(clampedZoom);
    setOffset(
      clampOffset(viewportSize / 2 - centerImageX * nextScale, viewportSize / 2 - centerImageY * nextScale, nextScale)
    );
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (!natural) return;
    event.preventDefault();
    applyZoom(zoom + (event.deltaY > 0 ? -0.1 : 0.1));
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    const viewport = viewportRef.current;
    if (!img || !viewport || !natural) return;

    setIsExporting(true);
    const viewportSize = viewport.clientWidth;
    const sourceSize = viewportSize / scale;
    const sourceX = -offset.x / scale;
    const sourceY = -offset.y / scale;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }
    ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    canvas.toBlob(
      (blob) => {
        setIsExporting(false);
        if (blob) onConfirm(blob);
      },
      'image/jpeg',
      0.9
    );
  };

  const displayWidth = natural ? natural.width * scale : undefined;
  const displayHeight = natural ? natural.height * scale : undefined;

  return (
    <div className="image-crop-overlay">
      <div className="image-crop-modal">
        <p className="image-crop-instructions">{t('recipeForm.cropInstructions')}</p>

        <div
          ref={viewportRef}
          className="image-crop-viewport"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt=""
            className="image-crop-image"
            draggable={false}
            onLoad={handleImageLoad}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              width: displayWidth,
              height: displayHeight,
            }}
          />
        </div>

        <div className="image-crop-zoom-row">
          <ZoomOut size={16} />
          <input
            type="range"
            className="image-crop-zoom"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(event) => applyZoom(Number(event.target.value))}
            disabled={!natural || isExporting}
            aria-label={t('recipeForm.cropZoom')}
          />
          <ZoomIn size={16} />
        </div>

        <div className="image-crop-actions">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isExporting}>
            {t('recipeForm.cancel')}
          </Button>
          <Button type="button" variant="primary" onClick={handleConfirm} disabled={!natural || isExporting}>
            {isExporting ? t('recipeForm.uploadingImages') : t('recipeForm.cropConfirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
