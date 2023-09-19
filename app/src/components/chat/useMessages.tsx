import React, {useCallback, useState} from 'react';
import {MessageProps} from './Message';
import {TextMessage} from './TextMessage';

export const useMessages = () => {
	const [internalMessages] = useState<MessageProps[]>([]);
	const [messages, setMessages] = useState<MessageProps[]>(internalMessages);

	const addMessage = useCallback((value: MessageProps["content"], income = false) => {
		const newMessage: MessageProps = {income, content: value, id: internalMessages.length};

		internalMessages.unshift(newMessage);

		// const newMessage: MessageProps = {income, content: <TextMessage text={value}/>};
		setMessages([...internalMessages]);
	}, [messages]);

	return [messages, addMessage] as const;

}