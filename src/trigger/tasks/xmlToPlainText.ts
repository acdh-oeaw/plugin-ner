import { task } from '@trigger.dev/sdk/v3';
import { parseXML } from '@recogito/standoff-converter';

export const xmlToPlainText = task({
  id: 'xml-to-plain-text',
  run: async (payload: { xml: string }, { ctx }) => {
    const { xml } = payload;

    const standoff = parseXML(xml);

    const newXML = standoff.xmlString();
    const newText = standoff.text();

    return { xml: newXML, text: newText };
  },
});
