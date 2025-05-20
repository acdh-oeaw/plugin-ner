import {
  DocumentCardActionsExtensionProps,
  createBrowserSDK,
  type Document,
} from '@recogito/studio-sdk';
import { MapPinArea } from '@phosphor-icons/react';
import { getTranslations } from '../i18n';
import { useState } from 'react';

import './DocumentMenuExtension.css';
import { ErrorModal } from './ErrorModal';
import { ConfigModal, NERConfig } from './ConfigModal';

export const DocumentMenuExtension = (
  props: DocumentCardActionsExtensionProps
) => {
  const i18n = getTranslations(window.location.href, 'all');
  const { t } = i18n;
  const sdk = createBrowserSDK(import.meta.env);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [configOpen, setConfigOpen] = useState(false);

  const NEROptions: { value: string; label: string }[] = [
    { value: 'stanford-core', label: t['Stanford Core NLP'] },
  ];

  const handleClick = async (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    
    const result = await sdk!.documents.get(props.document.id);

    if (result.error) {
      console.log('Failed to retrieve document!');
      return;
    }

    const document: Document = result.data;

    const { error, data } = await sdk!.profile.getMyProfile();
    if (error) {
      console.error('Failed to retrieve UserProfile');
    }

    const { id } = data;

    if (document.is_private && document.created_by !== id) {
      setErrorMessage(t['_private_document_message_']);
      setErrorOpen(true);
      return;
    }

    setConfigOpen(true);
  };

  const handleSubmit = async (config: NERConfig) => {
    const { data, error } = await sdk!.supabase.auth.getSession();
    setConfigOpen(false);

    if (error) {
      setErrorMessage(error.message);
      setErrorOpen(true);
    } else {
      const token = data.session?.access_token;

      const res = await fetch(
        `/api/${props.projectId}/${props.document.id}/agent/ner`,
        {
          method: 'PUT',
          body: JSON.stringify({
            nameOut: config.nameOut,
            model: config.model,
            language: config.language,
            token,
          }),
        }
      );

      if (!res.ok) {
        setErrorMessage(res.statusText);
        setErrorOpen(true);
      }
    }
  };

  return (
    <div className='dme-menu-item'>
      <button onClick={handleClick}>
        <MapPinArea size={16} color='#6f747c' /> {t['Perform NER on Document']}
      </button>

      <ErrorModal
        i18n={i18n}
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <ConfigModal
        i18n={i18n}
        open={configOpen}
        options={NEROptions}
        onClose={() => setConfigOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
