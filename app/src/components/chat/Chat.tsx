import React from "react";
import styles from './chat.module.scss'
import {InputMessage} from './InputMessage';

export const Chat = () => {
	return (
		<div className={styles.chat}>
			<div> Okay! Let's start!</div>
			<InputMessage />
		</div>);
}