import React, { useRef } from "react";
import { CopyImageBtn } from "./CopyImageBtn";

import styles from "./copy.module.scss";

export type CopyButtonsContainerProps = {
  children: React.ReactNode;
}
export const CopyButtonsContainer = ({children}: CopyButtonsContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (<div className={styles.messageCopyWrapper} ref={containerRef}>
    {children}
    <div className={styles.messageCopyButtons}>
      <CopyImageBtn containerRef={containerRef} />
    </div>
  </div>)
}