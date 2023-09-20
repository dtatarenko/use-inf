
import React from "react";
import domtoimage from "dom-to-image";

import styles from "./copy.module.scss"

export const CopyImageBtn = ({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) => {
  const copyRefCanvas = async () => {
    if (!containerRef.current) {
      alert("Seens like chart is not fully loaded yet, please wait a bit");
      return;
    }

    const dataUrl = await domtoimage.toPng(containerRef.current, { quality: 0.95 });
    const link = document.createElement('a');
    link.download = 'csdk-result.png';
    link.href = dataUrl;
    link.click();
  }
  return <div className={styles.copyButton} onClick={copyRefCanvas}>🖼<canvas style={{display: 'none'}}></canvas></div>;
}