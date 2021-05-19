<template>
	<div>
		<v-select
			v-model="selection"
			:items="components"
			:placeholder="$t('select_an_item')"
			itemValue="key"
			itemText="label"
		/>

		<div class="form" v-if="selectedComponent">
			<v-divider></v-divider>
			<v-form v-model="content" :fields="selectedComponent.fields" />
		</div>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import _components from './components';
export default defineComponent({
	props: {
		value: {
			type: Object,
			default: null,
		},
	},
	setup(props, { emit }) {
		const components = computed(() => {
			return _components;
		});

		const selection = computed({
			get() {
				return props.value?.selection;
			},
			set(newValue: any) {
				emitValue({ ...(props.value || {}), selection: newValue });
			},
		});

		const content = computed({
			get() {
				return props.value?.[selection.value];
			},
			set(newValue: any) {
				emitValue({ ...(props.value || {}), [selection.value]: newValue });
			},
		});

		const selectedComponent = computed(() => components.value.find((component) => component.key === selection.value));

		return {
			components,
			selectedComponent,
			selection,
			content,
		};

		function emitValue(value: any) {
			emit('input', value);
		}
	},
});
</script>
<style lang="scss" scoped>
.form {
	.v-divider {
		margin: 24px 0;
	}
}
</style>
