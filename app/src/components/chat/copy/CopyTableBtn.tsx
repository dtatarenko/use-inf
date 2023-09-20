
import React from "react";

import styles from "./copy.module.scss"

export const CopyTableBtn = ({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) => {
  const copyTable = async () => {
    if (!containerRef.current) {
      alert("Seens like table is not fully loaded yet, please wait a bit");
      return;
    }
    
    const tableHTMLString = containerRef.current.outerHTML;

    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([tableHTMLString], {
                    type: 'text/html',
                }),
            }),
        ]);

        alert("The table now in a clipboard!");
    } catch (error) {
        console.error(error)
    }
  }


  return <div className={styles.copyButton} onClick={copyTable}>🖼<canvas style={{display: 'none'}}></canvas></div>;
}