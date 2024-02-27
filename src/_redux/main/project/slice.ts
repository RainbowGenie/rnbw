import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFileHandlerCollection, TProjectReducerState } from "./types";

const projectReducerInitialState: TProjectReducerState = {
  projectHandlers: {},
  currentProjectFileHandle: null,
  fileHandlers: {},
  recentProjectNames: [],
};
const projectSlice = createSlice({
  name: "project",
  initialState: projectReducerInitialState,
  reducers: {
    setProjectHandlers(state, action: PayloadAction<TFileHandlerCollection>) {
      const projectHandlers = action.payload;
      state.projectHandlers = projectHandlers;
    },
    setCurrentProjectFileHandle(
      state,
      action: PayloadAction<FileSystemDirectoryHandle | null>,
    ) {
      const currentProjectFileHandle = action.payload;
      state.currentProjectFileHandle = currentProjectFileHandle;
    },
    setFileHandlers(state, action: PayloadAction<TFileHandlerCollection>) {
      const fileHandlers = action.payload;
      state.fileHandlers = fileHandlers;
    },
    setRecentProjectNames(state, action: PayloadAction<string[]>) {
      const recentProjectNames = action.payload;
      state.recentProjectNames = recentProjectNames;
    },
  },
});
export const {
  setProjectHandlers,
  setCurrentProjectFileHandle,
  setFileHandlers,
  setRecentProjectNames,
} = projectSlice.actions;
export const ProjectReducer = projectSlice.reducer;
