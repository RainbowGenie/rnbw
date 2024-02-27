export type TFilesReferenceData = {
  [name: string]: TFilesReference;
};
export type TFilesReference = {
  Name: string;
  Extension: string;
  Type: string;
  Icon: string;
  Description: string;
  Featured: string;
};
export type TReferenceReducerState = {
  filesReferenceData: TFilesReferenceData;
};
