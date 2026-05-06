export interface DataItem {
    id?: string;
    values: (number | string)[];
    colorHex?: string;
}

export interface Tab {
    id: string;
    label: string;
}