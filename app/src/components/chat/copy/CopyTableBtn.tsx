
import React from "react";

import styles from "./copy.module.scss"

export const CopyTableBtn = ({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) => {
  const copyTable = async () => {
    if (!containerRef.current) {
      alert("Seens like table is not fully loaded yet, please wait a bit");
      return;
    }
    
    const tableCaptions =  document.querySelectorAll('.fixedDataTableLayout_rowsContainer > .fixedDataTableRowLayout_rowWrapper .fixedDataTableLayout_header .public_fixedDataTableCell_cellContent');
    const tableData =  document.querySelectorAll('.fixedDataTableLayout_rowsContainer .fixedDataTableRowLayout_rowWrapper > .public_fixedDataTable_bodyRow .public_fixedDataTableCell_cellContent');
    

    const table = document.createElement("table");
    const headers = document.createElement("tr");
    table.appendChild(headers);
    
    tableCaptions.forEach(el => {
        headers.innerHTML +='<th>' + el.textContent + '</th>'
    })

    let newTr:any;
    const captionLength = tableCaptions.length;
    tableData.forEach((v, k) => {
        if((k + 1) % captionLength) {
            if(newTr) {
                newTr.innerHTML +='<td>' + v.textContent + '</td>';
            }
        } else {
            newTr = document.createElement("tr");
            newTr.innerHTML ='<td>' + v.textContent + '</td>';
            table.appendChild(newTr);
        }
    })

    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([table.outerHTML], {
                    type: 'text/html',
                }),
            }),
        ]);

        alert("The table now in a clipboard!");
    } catch (error) {
        console.error(error)
    }
  }


  return <div className={styles.copyButton} onClick={copyTable}>☶<canvas style={{display: 'none'}}></canvas></div>;
}