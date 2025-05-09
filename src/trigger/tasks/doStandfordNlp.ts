import { task } from "@trigger.dev/sdk/v3";
import type { NERResults, TagTypes } from "../types";

/*
DATE, TIME, DURATION, SET, MONEY, NUMBER, ORDINAL, PERCENT, PERSON, LOCATION, ORGANIZATION, MISC, CAUSE_OF_DEATH, CITY, COUNTRY, CRIMINAL_CHARGE, EMAIL, IDEOLOGY, NATIONALITY, RELIGION, STATE_OR_PROVINCE, TITLE, URL
*/
export interface Root {
  sentences: Sentence[];
}

export interface Sentence {
  index: number;
  entitymentions: Entitymention[];
  tokens: Token[];
}

export interface Entitymention {
  docTokenBegin: number;
  docTokenEnd: number;
  tokenBegin: number;
  tokenEnd: number;
  text: string;
  characterOffsetBegin: number;
  characterOffsetEnd: number;
  ner: string;
  nerConfidences?: NerConfidences;
  normalizedNER?: string;
  timex?: Timex;
}

export interface NerConfidences {
  PERSON?: number;
  ORGANIZATION?: number;
  DATE?: number;
  LOCATION?: number;
  DURATION?: number;
  MISC?: number;
  ORDINAL?: number;
  NUMBER?: number;
  SET?: number;
  TIME?: number;
  MONEY?: number;
}

export interface Timex {
  tid: string;
  type: string;
  value?: string;
  altValue?: string;
}

export interface Token {
  index: number;
  word: string;
  originalText: string;
  lemma: string;
  characterOffsetBegin: number;
  characterOffsetEnd: number;
  pos: string;
  ner: string;
  before: string;
  after: string;
  normalizedNER?: string;
  timex?: Timex2;
}

export interface Timex2 {
  tid: string;
  type: string;
  value?: string;
  altValue?: string;
}

const PERSON = ["PERSON"];
const PLACE = ["LOCATION", "CITY", "COUNTRY", "STATE_OR_PROVINCE"];

const entityMapping: {
  [key: string]: { tag: TagTypes; attributes?: { [key: string]: string } };
} = {
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
  run: async (payload: { data: string }, { ctx }) => {
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

    let ret: NERResults = { entries: [] };
    if (resp.ok) {
      const out: Root = await resp.json();

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
