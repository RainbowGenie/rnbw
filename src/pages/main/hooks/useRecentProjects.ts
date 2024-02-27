import { useState } from "react";

import { TProjectContext } from "@_redux/main/fileTree";

export const useRecentProjects = () => {
  const [recentProjectContexts, setRecentProjectContexts] = useState<
    TProjectContext[]
  >([]);
  const [recentProjectHandlers, setRecentProjectHandlers] = useState<
    (FileSystemDirectoryHandle | null)[]
  >([]);

  return {
    recentProjectContexts,
    recentProjectHandlers,
    setRecentProjectContexts,
    setRecentProjectHandlers,
  };
};
