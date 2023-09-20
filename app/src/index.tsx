import env from "../config";

import React from "react";
import ReactDOM from "react-dom/client";
import {
	SisenseContextProvider,
	SisenseContextProviderProps
} from "@sisense/sdk-ui";

import {Chat} from "./components/chat/Chat";

import styles from './index.module.scss'
import {MockNLQProvider} from './components/mockNLQProvider/mockNLQProvider';

const config: SisenseContextProviderProps = {
	url: env.SISENSE_URL,
	defaultDataSource: "Sample ECommerce",
	token: env.SISENSE_API_TOKEN,
};

const nlq = new MockNLQProvider();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<SisenseContextProvider
		{...config}
	>
		<div className={styles.app}>
			<Chat nlq={nlq}></Chat>
		</div>

	</SisenseContextProvider>
);
