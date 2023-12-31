import React, { useRef } from "react";
import { CopyImageBtn } from "./CopyImageBtn";
import { DownloadImageBtn } from "./DownloadImageBtn";
import { CopyTableBtn } from "./CopyTableBtn";
import { CopyCodeBtn } from "./CopyCodeBtn";
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import styles from "./copy.module.scss";

export type CopyButtonsContainerProps = {
  children: React.ReactNode;
}
export const CopyButtonsContainer = ({children}: CopyButtonsContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (<div className={styles.messageCopyWrapper}>
    <div ref={containerRef}>
      {children}
    </div>
    <div className={styles.messageCopyButtons}>
      <DownloadImageBtn containerRef={containerRef} />
      <CopyImageBtn containerRef={containerRef} />
      <CopyTableBtn containerRef={containerRef} />
      <CopyCodeBtn containerRef={containerRef} children={children} />
    </div>
  </div>)
}