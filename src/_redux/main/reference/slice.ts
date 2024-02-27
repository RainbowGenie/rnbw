import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// @ts-ignore
import filesRef from "@_ref/rfrncs/Files.csv";

import {
  TReferenceReducerState,
  TFilesReferenceData,
  TFilesReference
} from "./types";

const _filesReferenceData: TFilesReferenceData = {};
filesRef.map((fileRef: TFilesReference) => {
  _filesReferenceData[fileRef.Extension] = fileRef;
});
const referenceReducerInitialState: TReferenceReducerState = {
  filesReferenceData: _filesReferenceData,
};
const referenceSlice = createSlice({
  name: "reference",
  initialState: referenceReducerInitialState,
  reducers: {
    setFilesReferenceData(state, action: PayloadAction<TFilesReferenceData>) {
      const filesReferenceData = action.payload;
      state.filesReferenceData = filesReferenceData;
    },
  },
});
export const {
  setFilesReferenceData,
} = referenceSlice.actions;
export const ReferenceReducer = referenceSlice.reducer;
