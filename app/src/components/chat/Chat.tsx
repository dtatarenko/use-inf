import React from "react";
import styles from './chat.module.scss'
import {InputMessage} from './InputMessage';
import {MessagesArea} from './MessagesArea';
import {useMessages} from './useMessages';
import {qqRequest} from './API';
import {TextMessage} from './TextMessage';
import {ChartMessage} from './ChartMessage';
import {TableMessage} from './TableMessage';
import { executeQuery } from '../executeQuery';

export const Chat = () => {
	const [messages, addMessage] = useMessages();

	const addNewUserMessage = (text: string) => {
		addMessage(<TextMessage text={text}/>);

		qqRequest(text).then(answer => {
			if (answer.chart) {
				addMessage(<ChartMessage {...answer.chart} />, true);
			} else if (answer.message) {
				addMessage(<TextMessage text={answer.message}/>, true);
			} else if (answer.table) {
				addMessage(<TableMessage {...answer.table} />, true);
			}
		});
	}

	return (
		<div className={styles.chat}>
			{executeQuery({
				"dataModel":{
					"DataSource":"Sample ECommerce",
					"dimensions":[
						{
							"name":"Commerce",
							"attrs":[
								{
									"name":"AgeRange",
									"type":"text-attribute",
									"expression":"[Commerce.Age Range]"
								}
							]
						},
						{
							"name":"Country",
							"attrs":[
								{
									"name":"Country",
									"type":"text-attribute",
									"expression":"[Country.Country]"
								},
								{
									"name":"CountryID",
									"type":"numeric-attribute",
									"expression":"[Country.Country ID]"
								}
							]
						}
					],
					"dataOptions":{
						"category":[
							{
								"name":"AgeRange",
								"type":"string"
							}
						],
						"value":[
							{
								"name":"AgeRange"
							}
						],
						"breakBy":[]
					}
				}})}
			<MessagesArea messages={messages}/>
			<InputMessage onAddValue={addNewUserMessage}/>
		</div>);
}