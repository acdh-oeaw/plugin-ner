import { DocumentCardActionsExtensionProps } from '@recogito/studio-sdk';
import { MapPinArea } from '@phosphor-icons/react';
import { getTranslations } from '../i18n';
import './DocumentMenuExtension.css';

export const DocumentMenuExtension = (
  props: DocumentCardActionsExtensionProps
) => {
  const { t } = getTranslations(window.location.href, 'all');

  const handleClick = () => {
    const res = fetch(`/api/${props.projectId}/${props.document.id}/agent/ner`);
  };

  return (
    <div className='dme-menu-item' onClick={handleClick}>
      <MapPinArea size={16} color='#6f747c' />
      {t['Perform NER on Document']}
    </div>
  );
};
