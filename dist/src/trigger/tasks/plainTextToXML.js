import { task } from "@trigger.dev/sdk/v3";
import { parseXML } from "@recogito/standoff-converter";
export const plainTextToXML = task({
    id: "plain-text-to-xml",
    run: async (payload, { ctx }) => {
        const { text } = payload;
        const xml = `
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
            .split("\n\n")
            .map((paragraph) => `<p>${paragraph
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</p>`)
            .join("\n")}
        </body>
      </text>
    </TEI>
  `;
        console.log(xml);
        const standoff = parseXML(xml);
        const newXML = standoff.xmlString();
        const newText = standoff.text();
        return { xml: newXML, text: newText };
    },
});
