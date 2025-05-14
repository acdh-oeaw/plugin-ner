import { task } from '@trigger.dev/sdk/v3';
import type { NERResults } from '../types';
import { parseXML } from '@recogito/standoff-converter';
import * as uuid from 'uuid';

export const nerToXML = task({
  id: 'ner-to-xml',
  run: async (
    payload: { nerData: NERResults; text: string; originalXML?: string },
    { ctx }
  ) => {
    const { nerData, text, originalXML } = payload;

    let xml: string | undefined = originalXML;
    if (!xml) {
      xml = `
    <TEI xmlns="http://www.tei-c.org/ns/1.0">
      <teiHeader>
        <fileDesc>
          <titleStmt>
            <title>Untitled Text</title>
          </titleStmt>
          <publicationStmt>
            <p>Unpublished</p>
          </publicationStmt>
          <sourceDesc>
            <p>Plain text input</p>
          </sourceDesc>
        </fileDesc>
      </teiHeader>
      <text>
        <body>
          ${text
            .split('\n\n')
            .map(
              (paragraph) =>
                `<p>${paragraph
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')}</p>`
            )
            .join('\n')}
        </body>
      </text>
    </TEI>
  `;
    }

    const standoff = parseXML(xml);

    const standoffId = uuid.v4();
    standoff.addStandOff(standoffId);

    for (let i = 0; i < nerData.entries.length; i++) {
      const entry = nerData.entries[i];

      // standoff.addStandOffTag(standoffId, entry.startIndex, entry.endIndex, {
      //   label: entry.localizedTag,
      //   id: entry.inlineTag,
      // });
      standoff.addStandOffTag(
        standoffId,
        entry.startIndex,
        entry.endIndex,
        entry.localizedTag
      );
    }

    const tei = standoff.xmlString();
    return { tei };
  },
});
