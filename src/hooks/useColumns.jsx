import React from "react";

const useColumns = (columns) => {
  return React.useMemo(() => columns || [], [columns]);
};

export default useColumns;
