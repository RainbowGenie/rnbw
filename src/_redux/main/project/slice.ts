import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TFileHandlerCollection, TProjectReducerState } from "./types";

const projectReducerInitialState: TProjectReducerState = {
  projectHandlers: {},
};
const projectSlice = createSlice({
  name: "project",
  initialState: projectReducerInitialState,
  reducers: {
    setProjectHandlers(state, action: PayloadAction<TFileHandlerCollection>) {
      const projectHandlers = action.payload;
      state.projectHandlers = projectHandlers;
    },
  },
});
export const { setProjectHandlers } = projectSlice.actions;
export const ProjectReducer = projectSlice.reducer;
