import { useState } from "react";

const useZIndex = () => {
  const [zIndex, setZIndex] = useState(0);

  const onFocus = () => setZIndex(2);
  const onBlur = () => setZIndex(0);

  return { zIndex, onFocus, onBlur };
};

export default useZIndex;
