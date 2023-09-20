import {NLQProvider} from '../chat/types/NLQProvider';


export class CJqlNLQProvider implements NLQProvider {
	constructor(private endpoint: string) {
	}

	async request(message: string) {
		const response = await fetch(this.endpoint);
		return (await response.json())
	}
}

