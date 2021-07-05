<template>
	<div>
		<div v-if="presets" class="preset-form">
			<template v-for="preset in presets" :key="preset.key">
				<v-button class="preset-button" xSmall secondary @click="addPreset(preset.preset)">
					{{ preset.label }}
				</v-button>
			</template>
		</div>
		<interface-list :value="value" :template="template" :fields="fields" @input="emitValue" />
	</div>
</template>

<script lang="ts">
import { i18n } from '@/lang';
import { Field } from '@/types';
import { defineComponent, PropType } from 'vue';
export default defineComponent({
	props: {
		value: {
			type: Array as PropType<Record<string, any>[]>,
			default: null,
		},
		presets: {
			type: Array as PropType<Record<string, any>[]>,
			default: null,
		},
		fields: {
			type: Array as PropType<Partial<Field>[]>,
			default: () => [],
		},
		template: {
			type: String,
			default: null,
		},
		addLabel: {
			type: String,
			default: i18n.global.t('create_new'),
		},
		limit: {
			type: Number,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		headerPlaceholder: {
			type: String,
			default: i18n.global.t('empty_item'),
		},
		collection: {
			type: String,
			default: null,
		},
	},
	setup(props, { emit }) {
		return {
			emitValue,
			addPreset,
		};

		function addPreset(preset: any) {
			emitValue([...(props.value || []), ...(preset || [])]);
		}

		function emitValue(value: any) {
			emit('input', [...(value || [])]);
		}
	},
});
</script>
<style lang="scss" scoped>
.preset-form {
	margin-bottom: 12px;

	.preset-button {
		margin-right: 6px;
	}
}
</style>
