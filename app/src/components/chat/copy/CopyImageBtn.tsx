
import React from "react";

import styles from "./copy.module.scss"

export const CopyImageBtn = ({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) => {
  const copyRefCanvas = () => {
    containerRef.current
  }
  return <div className={styles.copyButton} onClick={copyRefCanvas}>🖼</div>;
}