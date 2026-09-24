import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/Button';
import { ImageCropModal } from '../ImageCropModal';
import { uploadRecipeImages } from '../../api/uploads';
import './ImagesField.css';

const MAX_IMAGES = 5;

type ImagesFieldProps = {
  disabled?: boolean;
  onChange: (urls: string[]) => void;
};

function isUserCancelled(err: unknown): boolean {
  return err instanceof Error && /cancel/i.test(err.message);
}

export function ImagesField({ disabled, onChange }: ImagesFieldProps) {
  const { t } = useTranslation('common');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);

  const handleAddPhoto = async () => {
    setError('');

    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: t('recipeForm.photoSourceTitle'),
        promptLabelPhoto: t('recipeForm.photoSourceGallery'),
        promptLabelPicture: t('recipeForm.photoSourceCamera'),
      });
      if (!photo.webPath) return;

      setPendingPhotoUrl(photo.webPath);
    } catch (err) {
      if (isUserCancelled(err)) return;
      setError(err instanceof Error ? err.message : t('recipeForm.genericError'));
    }
  };

  const handleCropCancel = () => {
    setPendingPhotoUrl(null);
  };

  const handleCropConfirm = async (blob: Blob) => {
    setPendingPhotoUrl(null);
    setError('');

    try {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

      setIsUploading(true);
      const uploadedUrls = await uploadRecipeImages([file]);
      const nextImages = [...images, ...uploadedUrls];
      setImages(nextImages);
      onChange(nextImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('recipeForm.genericError'));
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (url: string) => {
    const nextImages = images.filter((image) => image !== url);
    setImages(nextImages);
    onChange(nextImages);
  };

  return (
    <div className="form-group">
      <label>
        {t('recipeForm.imagesLabel')}
        <span className="hint">{t('recipeForm.imagesHint', { max: MAX_IMAGES })}</span>
      </label>

      {error && <div className="field-error">{error}</div>}

      {images.length > 0 && (
        <div className="image-previews">
          {images.map((url) => (
            <div key={url} className="image-preview">
              <img src={url} alt="" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="remove-image-btn"
                disabled={disabled || isUploading}
                title={t('recipeForm.removeImage')}
                aria-label={t('recipeForm.removeImage')}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <Button type="button" variant="secondary" onClick={handleAddPhoto} disabled={disabled || isUploading}>
          {isUploading ? t('recipeForm.uploadingImages') : t('recipeForm.addImages')}
        </Button>
      )}

      {pendingPhotoUrl && (
        <ImageCropModal imageUrl={pendingPhotoUrl} onCancel={handleCropCancel} onConfirm={handleCropConfirm} />
      )}
    </div>
  );
}
