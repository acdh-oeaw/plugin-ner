import { forwardRef, Ref, useEffect, useState } from 'react';
import {
  DocumentCardActionsExtensionProps,
  createBrowserSDK,
  type Document,
} from '@recogito/studio-sdk';
import { MapPinArea } from '@phosphor-icons/react';
import { getTranslations } from '../i18n';
import { ConfigDialogContent, NERConfig } from './ConfigDialogContent';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';

import './NERMenuExtension.css';

export const NERMenuExtension = forwardRef(
  (
    props: DocumentCardActionsExtensionProps,
    forwardedRef: Ref<HTMLDivElement>
  ) => {
    const i18n = getTranslations(window.location.href, 'all');
    const { t, lang } = i18n;
    const sdk = createBrowserSDK(import.meta.env);

    const [configOpen, setConfigOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const NEROptions: { value: string; label: string }[] = [
      { value: 'stanford-core', label: t['Stanford Core NLP'] },
    ];

    useEffect(() => {
      if (!sdk) return;

      sdk.documents.get(props.document.id).then(async (result) => {
        if (result.error) {
          setErrorMessage('Failed to retrieve document!');
        }

        const document: Document = result.data;

        const { error, data } = await sdk.profile.getMyProfile();
        if (error) setErrorMessage('Failed to retrieve UserProfile');

        if (document.is_private && document.created_by !== data.id)
          setErrorMessage(t['_private_document_message_']);
      });
    }, []);

    const onSubmit = async (config: NERConfig) => {
      setBusy(true);

      const { data, error } = await sdk!.supabase.auth.getSession();

      if (error) {
        setBusy(false);
        setErrorMessage(error.message);
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
              outputLanguage: lang,
              token,
            }),
          }
        );

        if (!res.ok) {
          setErrorMessage(res.statusText);
          setBusy(false);
          return;
        }

        setBusy(false);
        setConfigOpen(false);
      }
    };

    return (
      <Dialog.Root open={configOpen} onOpenChange={setConfigOpen}>
        <Dialog.Trigger asChild>
          <Dropdown.Item
            ref={forwardedRef}
            className='dme-menu-item dropdown-item'
            onSelect={(evt) => evt.preventDefault()}
          >
            <MapPinArea size={16} color='#6f747c' />{' '}
            {t['Perform NER on Document']}
          </Dropdown.Item>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='dialog-overlay dme-dialog-overlay' />

          <ConfigDialogContent
            busy={busy}
            errorMessage={errorMessage}
            i18n={i18n}
            options={NEROptions}
            onClose={() => setConfigOpen(false)}
            onSubmit={onSubmit}
          />
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);
