<template>
	<div>
		<v-form v-model="_value" :fields="fields" />
	</div>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
	props: {
		value: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props, { emit }) {
		const _value = computed({
			get() {
				return props.value;
			},
			set(newValue: any) {
				emit('input', { ...(props.value || {}), ...(newValue || {}) });
			},
		});

		const fields = [
			{
				name: 'Template',
				field: 'template',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'full',
					options: {
						placeholder: '{{field}}',
					},
				},
				schema: null,
			},
			{
				name: 'Parent Field',
				field: 'parentField',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						placeholder: 'Parent field',
						dbSafe: true,
						font: 'monospace',
					},
				},
				schema: null,
			},
			{
				name: 'Children Field',
				field: 'childrenField',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						placeholder: 'Children field',
						dbSafe: true,
						font: 'monospace',
					},
				},
				schema: null,
			},
		];

		return {
			_value,
			fields,
		};
	},
});
</script>
