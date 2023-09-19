import env from "../config";

import React from "react";
import ReactDOM from "react-dom/client";
import {
	SisenseContextProvider,
	SisenseContextProviderProps
} from "@sisense/sdk-ui";

import {Chat} from "./components/chat/Chat";
import {BarChartExample} from "./components/barChart/BarChart";

import styles from './index.module.scss'

const config: SisenseContextProviderProps = {
	url: env.SISENSE_URL,
	defaultDataSource: "Sample ECommerce",
	token: env.SISENSE_API_TOKEN,
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<SisenseContextProvider
		{...config}
	>
		<div className={styles.app}>
			<Chat></Chat>
		</div>

		{/*<BarChartExample/>*/}

	</SisenseContextProvider>
);
