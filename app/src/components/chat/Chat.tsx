import React from "react";
import styles from './chat.module.scss'
import {InputMessage} from './InputMessage';
import {MessagesArea} from './MessagesArea';
import {useMessages} from './useMessages';
import {qqRequest} from './API';
import {TextMessage} from './TextMessage';
import {ChartMessage} from './ChartMessage';
import {TableMessage} from './TableMessage';
import { ExecuteQuery } from '../executeQuery';
import exampleData from "../../data/example-data";
import { CopyButtonsContainer } from "./copy/CopyButtonsContainer";

export const Chat = () => {
	const [messages, addMessage] = useMessages();

	const addNewUserMessage = (text: string) => {
		addMessage(<TextMessage text={text}/>);

		qqRequest(text).then(answer => {
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
			} else if (answer.debug === 'example-data') {
        addMessage(<ExecuteQuery {...(exampleData as any)} />, true);
      }
		});
	}

	return (
		<div className={styles.chat}>
			<MessagesArea messages={messages}/>
			<InputMessage onAddValue={addNewUserMessage}/>
		</div>);
}