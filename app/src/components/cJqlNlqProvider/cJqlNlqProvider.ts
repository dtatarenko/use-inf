import {NLQProvider} from '../chat/types/NLQProvider';


export class MockNLQProvider implements NLQProvider {
	constructor(private endpoint: string) {
	}

	async request(message: string) {
		const response = await fetch(this.endpoint);
		const movies = await response.json();
	}
}

