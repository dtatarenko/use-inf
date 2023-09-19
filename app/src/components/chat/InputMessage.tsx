import React, {useState} from 'react';
import styles from './chat.module.scss'

export interface InputMessageProps {
	onAddValue: (value: string) => void;
}

export const InputMessage = ({onAddValue}: InputMessageProps) => {
	const [value, setValue] = useState('');
	const applyValue = () => {
		onAddValue(value);
		setValue('');
	};

	return (
		<div className={styles.inputMessage}>
			<input
				value={value}
				type="text"
				id="inputMessage"
				className=""
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => event.code === 'Enter' && applyValue()}
				autoFocus={true}
				placeholder="Type a message"
			/></div>
	)
}