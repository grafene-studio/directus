import { Field, Filter } from '@/types';
import api from '@/api';
import { useCollectionsStore, useRelationsStore } from '@/stores';
import useCollection from '@/composables/use-collection';
import _ from 'lodash';

export function createStatusFilter(value: string) {
	const filter: Filter = {
		field: 'status',
		key: 'status',
		operator: 'eq',
		value,
	};

	return createFilter(filter);
}

export async function createDenormalizedFilter(value: string, field: Field, filter: Filter) {
	const { relatedCollection } = useRelation(field);

	const { data } = await api.get(`/_custom/generate-tree-list/${relatedCollection.collection}`, {
		params: {
			parentField: field?.meta?.options?.parentField,
			childrenField: field?.meta?.options?.childrenField,
		},
	});
	const { list } = data.data;

	const uuids = [];

	// We push the value first so we can use it as an alias,
	// as it will be used to "display" the filter value
	uuids.push(value);

	for (const key in list) {
		if (Object.prototype.hasOwnProperty.call(list, key)) {
			const item = list[key];

			if (item.includes(value) && item !== value) uuids.push(item);
		}
	}

	return createFilter({
		...filter,
		value: _.uniq(uuids.flat()).join(','),
	});
}

function createFilter(filter: Filter): Filter {
	return filter;
}

function useRelation(field: Field) {
	const relationsStore = useRelationsStore();
	const collectionsStore = useCollectionsStore();

	const relation = relationsStore.getRelationsForField(field.collection, field.field)?.[0];

	const relatedCollection = collectionsStore.getCollection(relation.related_collection)!;

	const { primaryKeyField: relatedPrimaryKeyField } = useCollection(relatedCollection.collection);

	return { relation, relatedCollection, relatedPrimaryKeyField };
}
