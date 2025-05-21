import * as Dialog from '@radix-ui/react-dialog';
import { Translations } from 'src/i18n';
import { X } from '@phosphor-icons/react';

export interface ErrorModalProps {
  open: boolean;
  message: string;
  i18n: Translations;
  onClose(): void;
}

export const ErrorModal = (props: ErrorModalProps) => {
  const { t } = props.i18n;

  return (
    <Dialog.Root open={props.open}>
      <Dialog.Overlay className='dialog-overlay' />
      
      <Dialog.Portal>
        <Dialog.Overlay className='dialog-overlay' />
        <Dialog.Content className='dialog-content'>
          <Dialog.Title className='dialog-title'>
            {t['There has been an error!']}
          </Dialog.Title>
          <Dialog.Description className='dialog-description'>
            {props.message}
          </Dialog.Description>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button className='primary'>{t['OK']}</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button caria-label='Close'>
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
