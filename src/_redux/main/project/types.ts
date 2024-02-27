import { TNodeUid } from "@_node/types";

export type TFileHandlerCollection = {
  [uid: TNodeUid]: FileSystemHandle;
};
export type TProjectReducerState = {
  projectHandlers: TFileHandlerCollection;
  currentProjectFileHandle: FileSystemDirectoryHandle | null;
  fileHandlers: TFileHandlerCollection;
};
