export default [
	{
		key: 'title',
		label: 'Title',
		fields: [
			{
				name: 'Title',
				field: 'title',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						placeholder: 'Title...',
					},
				},
			},
		],
	},
	{
		key: 'note',
		label: 'Note',
		fields: [
			{
				name: 'Note',
				field: 'note',
				type: 'text',
				meta: {
					interface: 'textarea',
					width: 'full',
					options: {
						placeholder: 'Title...',
					},
				},
			},
		],
	},
];
