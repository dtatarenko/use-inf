import React from "react";
import styles from './chat.module.scss'
// import {ExecuteQuery} from "@sisense/sdk-ui";
import {InputMessage} from './InputMessage';
import {MessagesArea} from './MessagesArea';
import {useMessages} from './useMessages';
import {TextMessage} from './TextMessage';
// import {ChartMessage, useChart} from './ChartMessage';
// import {TableMessage} from './TableMessage';
// import {ExecuteQuery} from '../executeQuery';
// import exampleData from "../../data/example-data";
import {CopyButtonsContainer} from "./copy/CopyButtonsContainer";
import {NLQProvider} from './types/NLQProvider';
import {ExecuteQuery} from './ExecuteQuery';
import {BarChart, Table} from '@sisense/sdk-ui';

// import inlineresources from 'inlineresources';

export interface ChatProps {
	nlq: NLQProvider;
}

export const Chat = ({nlq}: ChatProps) => {
	const [messages, addMessage] = useMessages();

	const addNewUserMessage = (text: string) => {
		addMessage(<TextMessage text={text}/>);

		nlq.request(text).then(answer => {
			if (answer.chart) {
				const chart = answer.chart;
				addMessage(
					<ExecuteQuery {...chart} >
						{
							(data) => {
								const code = '<BarChart data={data} dataOptions{answer.chart?.dataOptions} />'
								return (
									<CopyButtonsContainer code={code}>
										<BarChart dataSet={data} dataOptions={chart.dataOptions}/>
									</CopyButtonsContainer>);
							}
						}

					</ExecuteQuery>
					,
					true
				);
			} else if (answer.message) {
				addMessage(<TextMessage text={answer.message}/>, true);
			} else if (answer.table) {
				const table = answer.table;
				addMessage(
					<ExecuteQuery {...table} >
						{
							(data) => {
								const code = '<Table data={data} dataOptions{table?.dataOptions} />'
								return (
									<CopyButtonsContainer code={code}>
										<Table dataSet={data} dataOptions={options}/>
									</CopyButtonsContainer>);
							}
						}

					</ExecuteQuery>,
					true
				);
			} else if (answer.debug === 'example-data') {
				// addMessage(<ExecuteQuery {...(exampleData as any)} />, true);
			}
		});
	}

	const copy = () => {
		// inlineresources.loadAndInlineCssLinks(document, options)
	}

	return (
		<div className={styles.chat}>
			{/*<button onClick={copy}*/}
			<MessagesArea messages={messages}/>
			<InputMessage onAddValue={addNewUserMessage}/>
		</div>);
}