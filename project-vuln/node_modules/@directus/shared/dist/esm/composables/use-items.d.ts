import { Item } from '../types';
import { ComputedRef, Ref, WritableComputedRef } from 'vue';
import { Query } from '../types/query';
declare type ManualSortData = {
    item: string | number;
    to: string | number;
};
declare type UsableItems = {
    itemCount: Ref<number | null>;
    totalCount: Ref<number | null>;
    items: Ref<Item[]>;
    totalPages: ComputedRef<number>;
    loading: Ref<boolean>;
    error: Ref<any>;
    changeManualSort: (data: ManualSortData) => Promise<void>;
    getItems: () => Promise<void>;
};
declare type ComputedQuery = {
    fields: Ref<Query['fields']> | ComputedRef<Query['fields']> | WritableComputedRef<Query['fields']>;
    limit: Ref<Query['limit']> | ComputedRef<Query['limit']> | WritableComputedRef<Query['limit']>;
    sort: Ref<Query['sort']> | ComputedRef<Query['sort']> | WritableComputedRef<Query['sort']>;
    search: Ref<Query['search']> | ComputedRef<Query['search']> | WritableComputedRef<Query['search']>;
    filter: Ref<Query['filter']> | ComputedRef<Query['filter']> | WritableComputedRef<Query['filter']>;
    page: Ref<Query['page']> | WritableComputedRef<Query['page']>;
};
export declare function useItems(collection: Ref<string | null>, query: ComputedQuery, fetchOnInit?: boolean): UsableItems;
export {};
//# sourceMappingURL=use-items.d.ts.map