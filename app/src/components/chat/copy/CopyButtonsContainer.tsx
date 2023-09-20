import React, { useRef } from "react";
import { CopyImageBtn } from "./CopyImageBtn";

export type CopyButtonsContainerProps = {
  children: React.ReactNode;
}
export const CopyButtonsContainer = ({children}: CopyButtonsContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (<div className="message-copy-wrapper" ref={containerRef}>
    {children}
    <div className="message-copy-buttons">
      <CopyImageBtn containerRef={containerRef} />
    </div>
  </div>)
}