import { task, configure, logger } from '@trigger.dev/sdk/v3';
import * as uuid from 'uuid';
import { uploadDocumentToRS } from './tasks/uploadDocumentToRS';
import { doStanfordNlp } from './tasks/doStandfordNlp';
import { nerToXML } from './tasks/nerToXML';
import { plainTextToXML } from './tasks/plainTextToXML';
import { createClient } from '@supabase/supabase-js';
import { Document } from '@recogito/studio-sdk';
import { xmlToPlainText } from './tasks/xmlToPlainText';

export const stanfordCore = task({
  id: 'stanford-core',
  run: async (payload: {
    serverURL: string;
    projectId: string;
    documentId: string;
    nameOut: string;
    language: 'en' | 'de';
    key: string;
    token: string;
  }) => {
    logger.info('Creating Supabase client');
    const supabase = createClient(payload.serverURL, payload.key, {
      global: {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      },
    });

    if (supabase) {
      logger.info('Get Document data');
      const docResult = await supabase
        .from('documents')
        .select()
        .eq('id', payload.documentId)
        .single();

      if (docResult.error) {
        logger.error(docResult.error.message);
        throw new Error('Failed to fetch document data');
      }

      const doc: Document = docResult.data as unknown as Document;
      if (!['text/xml', 'text/plain'].includes(doc.content_type || '')) {
        logger.error('Wrong content type');
        throw new Error('Wrong content type');
      }

      logger.info('Downloading File');
      const { data, error } = await supabase.storage
        .from('documents')
        .download(payload.documentId);

      if (error) {
        logger.error(error.message);
        throw new Error('Failed to download document');
      }

      let text: string;
      let xml: string;
      if (doc.content_type === 'text/plain') {
        const initialText = await data.text();

        logger.info('Calling Plain Text to XML');
        const res = await plainTextToXML
          .triggerAndWait({ text: initialText })
          .unwrap();

        text = res.text;
        xml = res.xml;
      } else {
        const initialXML = await data.text();
        logger.info('Calling XML to Plain Text');
        const res = await xmlToPlainText
          .triggerAndWait({ xml: initialXML })
          .unwrap();

        text = res.text;
        xml = res.xml;
      }

      logger.info('Calling NLP NER');
      const { ner } = await doStanfordNlp
        .triggerAndWait({ data: text, language: payload.language })
        .unwrap();

      const { tei } = await nerToXML
        .triggerAndWait({ nerData: ner, text, originalXML: xml })
        .unwrap();

      const id = uuid.v4();

      logger.info('Upload to Recogito Studio');
      // Upload to Recogito Studio;
      const res = await uploadDocumentToRS
        .triggerAndWait({
          id: id,
          documentData: tei,
          name: `${payload.nameOut}.xml`,
          type: 'text/xml',
          projectId: payload.projectId,
          documentId: payload.documentId,
          key: payload.key,
          token: payload.token,
          supabaseURL: payload.serverURL,
        })
        .unwrap();

      if (!res) {
        throw new Error('Failed to upload document');
      }
    }
  },
});
