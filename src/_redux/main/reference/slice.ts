import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// @ts-ignore
import filesRef from "@_ref/rfrncs/Files.csv";
// @ts-ignore
import htmlRefElements from "@_ref/rfrncs/HTML Elements.csv";

import {
  TReferenceReducerState,
  TFilesReferenceData,
  TFilesReference,
  THtmlReferenceData,
  THtmlElementsReferenceData,
  THtmlElementsReference,
} from "./types";
// file reference
const _filesReferenceData: TFilesReferenceData = {};
filesRef.map((fileRef: TFilesReference) => {
  _filesReferenceData[fileRef.Extension] = fileRef;
});

//html reference
const _htmlElementsReferenceData: THtmlElementsReferenceData = {};
htmlRefElements.map((htmlRefElement: THtmlElementsReference) => {
  const pureTag =
    htmlRefElement["Name"] === "Comment"
      ? "comment"
      : htmlRefElement["Tag"]?.slice(1, htmlRefElement["Tag"].length - 1);
  _htmlElementsReferenceData[pureTag] = htmlRefElement;
});

const referenceReducerInitialState: TReferenceReducerState = {
  filesReferenceData: _filesReferenceData,
  htmlReferenceData: { elements: _htmlElementsReferenceData },
};
const referenceSlice = createSlice({
  name: "reference",
  initialState: referenceReducerInitialState,
  reducers: {
    setFilesReferenceData(state, action: PayloadAction<TFilesReferenceData>) {
      const filesReferenceData = action.payload;
      state.filesReferenceData = filesReferenceData;
    },
    setHtmlReferenceData(state, action: PayloadAction<THtmlReferenceData>) {
      const htmlReferenceData = action.payload;
      state.htmlReferenceData = htmlReferenceData;
    },
  },
});
export const { setFilesReferenceData, setHtmlReferenceData } =
  referenceSlice.actions;
export const ReferenceReducer = referenceSlice.reducer;
