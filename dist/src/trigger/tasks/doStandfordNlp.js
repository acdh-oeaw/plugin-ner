import { task } from "@trigger.dev/sdk/v3";
const PERSON = ["PERSON"];
const PLACE = ["LOCATION", "CITY", "COUNTRY", "STATE_OR_PROVINCE"];
const entityMapping = {
    PERSON: {
        tag: "persName",
    },
    ORGANIZATION: {
        tag: "orgName",
    },
    LOCATION: {
        tag: "placeName",
    },
    CITY: {
        tag: "settlement",
        attributes: { type: "city" },
    },
    COUNTRY: {
        tag: "country",
    },
    STATE_OR_PROVINCE: {
        tag: "region",
    },
    DATE: {
        tag: "date",
    },
};
export const doStanfordNlp = task({
    id: "do-nlp-ner",
    run: async (payload, { ctx }) => {
        const { data } = payload;
        const url = "http://localhost:9000"; // Default CoreNLP server URL
        const params = new URLSearchParams({
            properties: JSON.stringify({
                annotators: "ner",
                outputFormat: "json",
            }),
        });
        const resp = await fetch(`${url}/?${params}`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain; charset=UTF-8",
            },
            body: data,
        });
        let ret = { entries: [] };
        if (resp.ok) {
            const out = await resp.json();
            for (let i = 0; i < out.sentences.length; i++) {
                const sentence = out.sentences[i];
                for (let j = 0; j < sentence.entitymentions.length; j++) {
                    const mention = sentence.entitymentions[j];
                    const map = entityMapping[mention.ner];
                    if (map) {
                        ret.entries.push({
                            text: mention.text,
                            startIndex: mention.characterOffsetBegin,
                            endIndex: mention.characterOffsetEnd,
                            tag: map.tag,
                            attributes: map.attributes,
                        });
                    }
                }
            }
        }
        return { ner: ret };
    },
});
