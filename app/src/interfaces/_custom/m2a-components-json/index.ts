import { defineInterface } from '@/interfaces/define';
import Interface from './interface.vue';

export default defineInterface({
	id: 'm2a-components-json',
	name: 'M2A Components - JSON',
	description: 'My Custom Interface!',
	icon: 'box',
	component: Interface,
	options: [],
	types: ['json'],
});
