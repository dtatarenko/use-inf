import React, { useRef } from "react";

export type CopyButtonsContainerProps = {
  children: React.ReactNode;
}
export const CopyButtonsContainer = ({children}: CopyButtonsContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (<div className="message-copy-wrapper" ref={containerRef}>
    {children}
    <div className="message-copy-buttons">

    </div>
  </div>)
}

const CopyImageBtn = ({ref}: {ref: React.RefObject<HTMLDivElement>}) => {
  const copyRefCanvas = (e) => {
    ref.current
  }
  return <div className="copy-button" onClick={copyRefCanvas}>🖼</div>;
}