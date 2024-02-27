import { useState } from "react";

import { TFileHandlerCollection } from "@_node/index";

export const useFileHandlers = () => {
  const [currentProjectFileHandle, setCurrentProjectFileHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [fileHandlers, setFileHandlers] = useState<TFileHandlerCollection>({});

  return {
    currentProjectFileHandle,
    setCurrentProjectFileHandle,
    fileHandlers,
    setFileHandlers,
  };
};
