import { defineInterface } from '@/interfaces/define';
import Options from './options.vue';
import Interface from './interface.vue';

export default defineInterface({
	id: 'dynamic-text-components',
	name: 'Dynamic Text Components',
	description: '',
	icon: 'replay',
	component: Interface,
	types: ['json'],
	options: Options,
});
