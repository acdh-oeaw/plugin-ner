import type { NERResults } from "../types";
export declare const nerToXML: import("@trigger.dev/core/v3").Task<"ner-to-xml", {
    nerData: NERResults;
    text: string;
    originalXML?: string;
}, {
    tei: string;
}>;
//# sourceMappingURL=nerToXML.d.ts.map