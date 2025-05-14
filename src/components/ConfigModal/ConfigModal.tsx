import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { CaretDown } from '@phosphor-icons/react';
import { Translations } from 'src/i18n';
import { useState } from 'react';

import './ConfigModal.css';

export type NERConfig = {
  nameOut: string;
  language: 'en' | 'de';
  model: string;
};
interface ConfigModalProps {
  open: boolean;
  i18n: Translations;
  options: { value: string; label: string }[];
  onClose(): void;
  onSubmit(config: NERConfig): void;
}
export const ConfigModal = (props: ConfigModalProps) => {
  const { t } = props.i18n;

  const [language, setLanguage] = useState<'en' | 'de'>('en');
  const [model, setModel] = useState<string>('');
  const [nameOut, setNameOut] = useState<string>('');

  const modelString =
    model.length > 0 ? props.options.find((o) => o.value === model)?.label : '';

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();

    props.onSubmit({ nameOut, model, language });
  };

  const valid = language.length > 0 && model.length > 0 && nameOut.length > 0;

  return (
    <Dialog.Root open={props.open}>
      <Dialog.Portal>
        <Dialog.Overlay className='dialog-overlay' />
        <Dialog.Content className='dialog-content'>
          <Dialog.Title className='dialog-title'>
            {t['Configure NLP Model']}
          </Dialog.Title>
          <Dialog.Description className='dialog-description'>
            {t['_model_config_message_']}
          </Dialog.Description>
          <div className='config-modal-options'>
            <Label.Root>{t['Output File Name']}</Label.Root>
            <input
              type='text'
              id='nameOut'
              name='nameOut'
              required
              className='name-out-input'
              value={nameOut}
              onChange={(ev) => setNameOut(ev.target.value)}
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
              }}
            />
            <Label.Root>{t['Select Model to Use']}</Label.Root>
            <Select.Root
              onValueChange={(value) => setModel(value)}
              value={model}
            >
              <Select.Trigger className='select-trigger config-modal-trigger'>
                <Select.Value>{modelString}</Select.Value>
                <Select.Icon className='select-icon'>
                  <CaretDown />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className='select-content' position='popper'>
                  <Select.Viewport className='select-viewport'>
                    {props.options.map((option) => {
                      return (
                        <Select.Item
                          key={option.value}
                          value={option.value}
                          className='select-item config-modal-item'
                        >
                          {option.label}
                        </Select.Item>
                      );
                    })}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <Label.Root>{t['Select Language']}</Label.Root>
            <Select.Root
              onValueChange={(value) => setLanguage(value as 'en' | 'de')}
              value={language}
            >
              <Select.Trigger className='select-trigger config-modal-trigger'>
                <Select.Value>
                  {language === 'en' ? t['English'] : t['German']}
                </Select.Value>
                <Select.Icon className='select-icon'>
                  <CaretDown />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className='select-content' position='popper'>
                  <Select.Viewport className='select-viewport'>
                    <Select.Item
                      key={'en'}
                      value={'en'}
                      className='select-item config-modal-item'
                    >
                      {t['English']}
                    </Select.Item>
                    <Select.Item
                      key={'de'}
                      value={'de'}
                      className='select-item config-modal-item'
                    >
                      {t['German']}
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end',
            }}
          >
            <Dialog.Close asChild>
              <button
                className='outline'
                onClick={(evt: any) => {
                  evt.preventDefault();
                  evt.stopPropagation();
                  props.onClose();
                }}
              >
                {t['Cancel']}
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className='primary'
                disabled={!valid}
                onClick={handleSubmit}
              >
                {t['Submit']}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
