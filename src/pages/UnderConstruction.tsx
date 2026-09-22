import { Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './UnderConstruction.css';

interface UnderConstructionProps {
  titleKey: string;
}

export function UnderConstruction({ titleKey }: UnderConstructionProps) {
  const { t } = useTranslation('common');

  return (
    <div className="under-construction-page">
      <h1 className="under-construction-title">{t(titleKey)}</h1>
      <div className="under-construction-content">
        <Construction size={48} strokeWidth={1.5} />
        <p>{t('underConstruction.message')}</p>
      </div>
    </div>
  );
}
