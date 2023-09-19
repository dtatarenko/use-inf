import React from 'react';
import styles from './chat.module.scss'

export interface MessageProps {
	id: number;
	income: boolean;
	content: React.ReactNode;
}

export const Message = ({content, income}:MessageProps) => {
	return (<div className={`${styles.message} ${income ? styles.incomeMessage : ''}`}>{content}</div>)
}