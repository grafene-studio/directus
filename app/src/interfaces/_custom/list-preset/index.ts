import { defineInterface } from '@/interfaces/define';
import RepeaterOptions from './options.vue';
import InterfaceList from './list.vue';

export default defineInterface({
	id: 'custom-list',
	name: 'Custom List Repeater',
	description: '$t:interfaces.list.description',
	icon: 'replay',
	component: InterfaceList,
	types: ['json'],
	options: RepeaterOptions,
});
