
import React from "react";

export const CopyImageBtn = ({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) => {
  const copyRefCanvas = () => {
    containerRef.current
  }
  return <div className="copy-button" onClick={copyRefCanvas}>🖼</div>;
}