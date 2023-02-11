import axios from 'axios';
import { COUNTER_API_HOST_NAME } from '../constants';

export namespace Counter {
	export function count(context: string): void {
		axios.get(`http://${COUNTER_API_HOST_NAME}/count/${context}`)
			.catch(console.error);
	}
}
