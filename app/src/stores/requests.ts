import { nanoid } from 'nanoid';
import { defineStore } from 'pinia';

export const useRequestsStore = defineStore({
	id: 'requestsStore',
	state: () => ({
		queue: [] as string[],
	}),
	getters: {
		queueHasItems(): boolean {
			return this.queue.length > 0;
		},
	},
	actions: {
		startRequest() {
			const id = nanoid();
			this.queue = [...this.queue, id];
			return id;
		},
		endRequest(id: string) {
			this.queue = this.queue.filter((queueID: string) => queueID !== id);
		},
	},
});
