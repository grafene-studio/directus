<template>
	<div>
		<interface-list-options :value="value" @input="emitValue" />

		<div class="grid" v-if="value.template && presetFields">
			<div class="grid-element full"><v-divider /></div>
			<div class="grid-element full">
				<p class="type-label">Presets</p>
				<interface-list
					v-model="presetsValue"
					:addLabel="'Add Preset'"
					:fields="presetFields"
					:template="'{{label}}'"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import InterfaceListOptions from '@/interfaces/list/options.vue';
import { i18n } from '@/lang';
export default defineComponent({
	components: {
		InterfaceListOptions,
	},
	props: {
		value: {
			type: Object,
			default: null,
		},
	},
	setup(props, { emit }) {
		const presetsValue = computed({
			get() {
				return props.value?.presets;
			},
			set(newPresets: string) {
				emit('input', {
					...(props.value || {}),
					presets: newPresets,
				});
			},
		});

		const presetFields = computed(() => {
			const key = {
				name: 'key',
				field: 'key',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
					sort: 2,
					options: {
						dbSafe: true,
						font: 'monospace',
						placeholder: 'key...',
					},
				},
				schema: null,
			};
			const label = {
				name: i18n.global.t('label'),
				field: 'label',
				type: 'string',
				meta: {
					interface: 'input',
					width: 'half',
					options: {
						placeholder: i18n.global.t('label...'),
					},
				},
				schema: null,
			};

			const repeater = {
				name: 'Preset',
				field: 'preset',
				type: 'json',
				meta: {
					interface: 'list',
					options: {
						template: props.value?.template,
						fields: props.value?.fields,
						value: [
							{
								label: 'ciao',
								value: 'cicococo',
							},
						],
					},
				},
			};
			return [
				key,
				label,
				repeater,
				// fields: props.value?.fields,
			];
		});

		return {
			emitValue,
			presetsValue,
			presetFields,
		};

		function emitValue(value: any) {
			emit('input', value);
		}
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/form-grid';

.grid {
	@include form-grid;

	margin-top: 24px;

	&-element {
		&.full {
			grid-column: start/full;
		}
	}
}
</style>
