import React from 'react';
import styles from './chat.module.scss';

export const TextMessage = ({ text }: { text: string }) => {
	return <span className={styles.textMessage}>{text}</span>
}