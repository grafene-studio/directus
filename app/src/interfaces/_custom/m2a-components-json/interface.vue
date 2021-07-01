<template>
	<div>
		<template v-if="getFields">
			<v-form :fields="getFields" :initialValues="value" @input="emitValue" />
		</template>
		<v-notice v-else icon="warning" type="warning">Seleziona un interfaccia!</v-notice>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, Ref } from '@vue/composition-api';
export default defineComponent({
	props: {
		value: {
			type: Object,
			default: null,
		},
	},
	setup(props, { emit }) {
		const values = inject('values') as Ref<{
			primary_color: string | undefined;
			secondary_color: string | undefined;
			type: string;
		}>;

		const getFields = computed(() => {
			if (values.value.type == null) {
				return false;
			}

			if (values.value.type === 'box') {
				return [
					{
						field: 'content',
						type: 'string',
						meta: {
							width: 'full',
							display: 'raw',
							interface: 'input',
							field: 'label',
							options: { iconLeft: 'label', trim: true },
						},
					},
				];
			}

			if (values.value.type === 'button') {
				return [
					{
						field: 'content',
						type: 'string',
						meta: {
							width: 'full',
							display: 'raw',
							interface: 'input',
							field: 'label',
							options: { iconLeft: 'label', trim: true },
						},
					},
					{
						field: 'link',
						type: 'string',
						meta: {
							width: 'full',
							display: 'raw',
							interface: 'input',
							field: 'label',
							options: { iconLeft: 'label', trim: true },
						},
						name: 'Link',
					},
				];
			}

			return false;
		});

		return {
			values,
			emitValue,
			getFields,
		};

		function emitValue(value: any) {
			emit('input', { ...(value || {}) });
		}
	},
});
</script>
