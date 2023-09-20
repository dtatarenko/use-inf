import React from "react";
import styles from './chat.module.scss'
import {InputMessage} from './InputMessage';
import {MessagesArea} from './MessagesArea';
import {useMessages} from './useMessages';
import {TextMessage} from './TextMessage';
import {ChartMessage} from './ChartMessage';
import {TableMessage} from './TableMessage';
import {ExecuteQuery} from '../executeQuery';
import {CopyButtonsContainer} from "./copy/CopyButtonsContainer";
import {NLQProvider} from './types/NLQProvider';

export interface ChatProps {
	nlq: NLQProvider;
}

export const Chat = ({nlq}: ChatProps) => {
	const [messages, addMessage] = useMessages();

	const addNewUserMessage = (text: string) => {
		addMessage(<TextMessage text={text}/>);

		nlq.request(text).then(answer => {
			if (answer.chart) {
				addMessage(
					<CopyButtonsContainer>
						<ChartMessage {...answer.chart} />
					</CopyButtonsContainer>,
					true
				);
			} else if (answer.message) {
				addMessage(<TextMessage text={answer.message}/>, true);
			} else if (answer.table) {
				addMessage(
					<CopyButtonsContainer>
						<TableMessage {...answer.table} />
					</CopyButtonsContainer>,
					true
				);
			}
		});
	}

	return (
		<div className={styles.chat}>
			<MessagesArea messages={messages}/>
			<InputMessage onAddValue={addNewUserMessage}/>
		</div>);
}