export type TagTypes =
  | 'persName'
  | 'orgName'
  | 'placeName'
  | 'settlement'
  | 'country'
  | 'region'
  | 'date';
export type NEREntry = {
  text: string;
  startIndex: number;
  endIndex: number;
  localizedTag: string;
  inlineTag: TagTypes;
  attributes?: { [key: string]: string };
};
export type NERResults = {
  entries: NEREntry[];
};
