export interface FaqProp {
    id?: number
    displayorder?: number
    question?: string
    answer?: string
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
  }

  export interface Pagination {
    limit: number
    page: number
    total: number
  }