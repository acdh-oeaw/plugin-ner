import type { NERResults } from '../types';
import { parseXML } from '@recogito/standoff-converter';
import * as uuid from 'uuid';
import { heartbeats, logger } from '@trigger.dev/sdk/v3';

export const nerToXML = async (
  payload: { nerData: NERResults; text: string; originalXML?: string }
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

    const startedAt = Date.now();
    logger.info('Parsing NER XML', { entityCount: nerData.entries.length });
    await heartbeats.yield();
    const standoff = parseXML(xml);

    const standoffId = uuid.v4();
    standoff.addStandOff(standoffId);
    logger.info('Adding NER annotations', { entityCount: nerData.entries.length });

    for (let i = 0; i < nerData.entries.length; i++) {
      // async alone does not release the event loop. The SDK periodically
      // yields to timers so the worker can send its 30-second heartbeats.
      await heartbeats.yield();
      const entry = nerData.entries[i];

      standoff.addStandOffTag(standoffId, entry.startIndex, entry.endIndex, {
        label: entry.localizedTag,
        id: entry.inlineTag,
      });
      if ((i + 1) % 1000 === 0 || i + 1 === nerData.entries.length) {
        logger.info('NER annotation progress', {
          completed: i + 1,
          total: nerData.entries.length,
          elapsedMs: Date.now() - startedAt,
        });
      }
    }

    await heartbeats.yield();
    logger.info('Serializing NER XML', { entityCount: nerData.entries.length });
    const tei = standoff.xmlString();
    logger.info('NER XML conversion completed', { elapsedMs: Date.now() - startedAt });
    return { tei };
};
