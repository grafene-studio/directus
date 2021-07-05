<template>
	<div class="layout-filters">
		<div class="form-grid with-fill">
			<div class="field half-left">
				<filter-field
					:filter="getFilter('status')"
					:field="statusField"
					@input="handleFilters(createStatusFilter($event))"
					@unset="deleteFilter"
				/>
			</div>
			<div class="field half-left">
				<filter-field
					:filter="getFilter('category')"
					:field="categoryField"
					@input="
						_createDenormalizedFilter($event, categoryField, {
							key: 'category',
							field: 'category.id',
							operator: 'in',
							value: null,
						})
					"
					@unset="deleteFilter"
				/>
			</div>
			<div class="field half-right">
				<filter-field
					:filter="getFilter('origin')"
					:field="originField"
					@input="
						_createDenormalizedFilter($event, originField, {
							key: 'origin',
							field: 'origin.id',
							operator: 'in',
							value: null,
						})
					"
					@unset="deleteFilter"
				/>
			</div>
		</div>
		<v-button x-small @click="$emit('update:filters', [])" :disabled="!(filters.length > 0)">
			{{ $t('clear_filters') }}
		</v-button>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue';
import { useFieldsStore } from '@/stores/';
import { Field, Filter } from '@/types';

import FilterField from './filter.vue';
import { createStatusFilter, createDenormalizedFilter } from './filters';

export default defineComponent({
	components: {
		FilterField,
	},
	props: {
		collection: {
			type: String,
			required: true,
		},
		filters: {
			type: Array as PropType<Filter[]>,
			default: () => [],
		},
	},
	setup(props, { emit }) {
		const fieldsStore = useFieldsStore();
		const fields = computed<Field[]>(() => fieldsStore.getFieldsForCollection(props.collection));

		const statusField = ref<Field>(null as unknown as Field);
		const categoryField = ref<Field>(null as unknown as Field);
		const originField = ref<Field>(null as unknown as Field);

		fields.value.map((field: Field) => {
			if (field.field === 'status') statusField.value = field;
			if (field.field === 'category') categoryField.value = field;
			if (field.field === 'origin') originField.value = field;
		});

		if (statusField.value == null || categoryField.value == null || originField.value == null)
			throw new Error('Filter setup failed!');

		/* Adds deselectable option to the statusfield */
		if (statusField.value?.meta?.options) statusField.value.meta.options.allowNone = true;

		return {
			fields,
			statusField,
			categoryField,
			originField,
			handleFilters,
			getFilter,
			deleteFilter,
			createStatusFilter,
			_createDenormalizedFilter,
		};

		function handleFilters(filter: Filter) {
			const { key } = filter;

			const index = props.filters.findIndex((filter) => filter.key === key);

			if (index === -1) {
				emit('update:filters', [...(props.filters || []), filter]);
			} else {
				const removeDuplicates = props.filters.filter((filter) => filter.key !== key);
				emit('update:filters', [...(removeDuplicates || []), filter]);
			}
		}

		function getFilter(key: Filter['key']) {
			const filter = props.filters.find((filter) => filter.key === key);
			if (filter && (key === 'category' || key === 'origin')) {
				// Alias the value to the first item of the concatenated string, otherwise it 500s
				// We assume that the first value is the "display" value we want.
				const legalValue = filter.value.split(',')[0];
				return {
					...filter,
					value: legalValue,
				};
			}
			return filter;
		}

		function deleteFilter(key: Filter['key']) {
			const removeFilter = props.filters.filter((filter) => filter.key !== key);
			emit('update:filters', [...(removeFilter || [])]);
		}

		async function _createDenormalizedFilter(value: string, field: Field, filter: Filter) {
			if (field == null) throw new Error('Field missing!');
			const result = await createDenormalizedFilter(value, field, filter);

			handleFilters(result);
		}
	},
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixins/form-grid';

.layout-filters {
	margin-bottom: 12px;
	margin-left: 32px;
}

.form-grid {
	@include form-grid;

	margin: 12px 0;
}
</style>
