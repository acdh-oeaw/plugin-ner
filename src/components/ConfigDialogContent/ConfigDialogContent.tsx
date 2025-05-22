import { forwardRef, Ref, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import { CaretDown } from '@phosphor-icons/react';
import { Button } from '@recogito/studio-sdk/components';
import { Translations } from 'src/i18n';

import './ConfigDialogContent.css';

export type NERConfig = {
  nameOut: string;
  language: 'en' | 'de';
  model: string;
}

interface ConfigDialogContentProps {
  busy: boolean;
  errorMessage: string;
  i18n: Translations;
  options: { value: string; label: string }[];
  onClose(): void;
  onSubmit(config: NERConfig): void;
}

export const ConfigDialogContent = forwardRef((
  props: ConfigDialogContentProps,
  forwardedRef: Ref<HTMLDivElement>
) => {
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
    <Dialog.Content 
      ref={forwardedRef}
      className='dialog-content config-modal-content' 
      onKeyDown={evt => evt.stopPropagation()}
      onClick={evt => evt.stopPropagation()}>
      <Dialog.Title className='dialog-title'>
        {t['Configure NLP Model']}
      </Dialog.Title>
      <Dialog.Description className='dialog-description'>
        {t['_model_config_message_']}
      </Dialog.Description>
      <div className='config-modal-options'>
        <div className='config-modal-field'>
          <Label.Root>{t['Output File Name']}</Label.Root>
          <input
            type='text'
            id='nameOut'
            name='nameOut'
            className='name-out-input'
            value={nameOut}
            onChange={(ev) => setNameOut(ev.target.value)}
          />
        </div>

        <div className='config-modal-field'>
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
        </div>

        <div className='config-modal-field'>
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
      </div>

      {props.errorMessage && (
        <div className="config-modal-error">
          <h3>Error</h3>
          <p>
          {props.errorMessage}
          </p>
        </div>
      )}
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
            >
            {t['Cancel']}
          </button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button
            busy={props.busy}
            className='primary'
            disabled={!valid}
            onClick={handleSubmit}
          >
            <span>{t['Submit']}</span>
          </Button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
});
