import { useState, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import {
  DocumentCardActionsExtensionProps,
  createBrowserSDK,
  type Document,
} from '@recogito/studio-sdk';
import { MapPinArea } from '@phosphor-icons/react';
import { getTranslations } from '../i18n';
import { ErrorModal } from './ErrorModal';
import { ConfigDialogContent, NERConfig } from './ConfigDialogContent';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';

import './DocumentMenuExtension.css';

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

  const onOpenDialog = async (evt: any) => {    
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
  };

  const onSubmit = async (config: NERConfig) => {
    const { data, error } = await sdk!.supabase.auth.getSession();

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
    <Dialog.Root 
      open={configOpen}
      onOpenChange={setConfigOpen}>

      <Dialog.Trigger asChild>
        <Dropdown.Item
          className='dme-menu-item dropdown-item'
          onSelect={evt => evt.preventDefault()}>
          <MapPinArea size={16} color='#6f747c' /> {t['Perform NER on Document']}
        </Dropdown.Item>
      </Dialog.Trigger> 

      <Dialog.Overlay className="dialog-overlay" />
        <ConfigDialogContent
          i18n={i18n}
          options={NEROptions}
          onClose={() => setConfigOpen(false)}
          onSubmit={onSubmit}
        />

        {/* <ErrorModal
            i18n={i18n}
            open={errorOpen}
            message={errorMessage}
            onClose={() => setErrorOpen(false)}
          /> */}
    </Dialog.Root>
  );
};
