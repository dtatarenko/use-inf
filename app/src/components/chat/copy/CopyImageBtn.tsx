
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
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': await fetch(dataUrl).then((r) => r.blob()),
        }),
      ]);
      alert("The image now in a clipboard!");
    } catch (error) {
      console.error(error);
    }
  }
  return <div className={styles.copyButton} onClick={copyRefCanvas}>🖼<canvas style={{display: 'none'}}></canvas></div>;
}