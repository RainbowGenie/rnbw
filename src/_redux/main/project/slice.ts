import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFileHandlerCollection, TProjectReducerState } from "./types";

const projectReducerInitialState: TProjectReducerState = {
  projectHandlers: {},
  currentProjectFileHandle: null,
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
  },
});
export const { setProjectHandlers, setCurrentProjectFileHandle } =
  projectSlice.actions;
export const ProjectReducer = projectSlice.reducer;
