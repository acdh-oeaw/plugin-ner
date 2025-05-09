import type { NERResults } from "../types";
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
export declare const doStanfordNlp: import("@trigger.dev/core/v3").Task<"do-nlp-ner", {
    data: string;
}, {
    ner: NERResults;
}>;
//# sourceMappingURL=doStandfordNlp.d.ts.map