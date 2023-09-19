import React from 'react';
import styles from './chat.module.scss'
import {Message, MessageProps} from './Message';


export interface MessagesAreaProps {
	messages: MessageProps[];
}

export const MessagesArea = ({messages}: MessagesAreaProps) => {
	return (<div className={styles.messagesArea}>
		{messages.map(message => (<Message key={message.id} {...message}/>))}
	</div>)
}