import React from 'react';
import styles from './chat.module.scss'

export interface InputMessageProps {

}

export const InputMessage = ({}: InputMessageProps) => {
	return (
		<div className={styles.inputMessage}>
			<input
				className=""
				// onChange={onChange}
				autoFocus={true}
				placeholder="Type a message"
			/></div>
	)
}