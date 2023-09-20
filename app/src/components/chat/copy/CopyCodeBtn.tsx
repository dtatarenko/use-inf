
import React from "react";
import styles from "./copy.module.scss"

export const CopyCodeBtn = (children:any) => {
  const copyCode = async () => {
    if (!children.children) {
      alert("Seens like code is not fully loaded yet, please wait a bit");
      return;
    }
    
    let { type, props } = children.children;

    const plainTextString = '';// `(${type.toString().replace(/react_\d\.default/, 'React')})\n(${JSON.stringify(props)})`;

    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Blob([plainTextString], {
                    type: 'text/plain',
                }),
            }),
        ]);

        alert("The code now in a clipboard!");
    } catch (error) {
        console.error(error)
    }
  }


  return <div className={styles.copyButton} onClick={copyCode}>⚒<canvas style={{display: 'none'}}></canvas></div>;
}