import { defineDisplay } from '@/displays/define';
import DisplayJsonValue from './formatted-json-value.vue';

export default defineDisplay({
	id: 'custom-formatted-json-value',
	name: 'Custom Formatted Json Value',
	description: '$t:displays.formatted-json-value.description',
	types: ['json'],
	icon: 'settings_ethernet',
	handler: DisplayJsonValue,
	options: [
		{
			field: 'format',
			name: '$t:display_template',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				options: {
					placeholder: '{{ field }}',
				},
			},
		},
	],
});
