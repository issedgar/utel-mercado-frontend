export interface ICategory {
    id: string;
    name: string;
}

export interface ICard extends IItem {
    name?: string;
}


export interface IItem {
    id: string;
    price?: number;
    available_quantity?: number;
    condition?: string;
    currency_id?: string;
    thumbnail?: string;
    title?: string;
}

export interface ISort {
    id: string;
    name: string;
}

export interface IValue {
    id: string;
    name: string;
    results: number;
    checked?: boolean;
}

export interface IFilter {
    id: string;
    name: string;
    type: string;
    values: Array<IValue>
}

export interface IPaging {
    limit: number;
    offset: number;
    primary_results: number;
    total: number;
}

export interface IItems {
    available_filters: Array<IFilter>;
    available_sorts: Array<ISort>;
    paging: IPaging;
    results: Array<IItem>;
}

