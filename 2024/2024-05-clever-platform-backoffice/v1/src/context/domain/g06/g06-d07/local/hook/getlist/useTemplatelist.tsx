import { useEffect, useState } from 'react';
import API from '@domain/g06/g06-d07/local/api';
import { getUserData } from '@global/utils/store/getUserData';
import usePagination from '@global/hooks/usePagination';
import { TDocumentTemplate, TTemplateFilter } from '@domain/g06/g06-d07/local/types/template';

export function useDocumentTemplateList(filter?: TTemplateFilter) {
    const userData = getUserData();
    const [template, setTemplate] = useState<TDocumentTemplate[]>([]);
    const [fetching, setFetching] = useState(false);
    const { pagination, setPagination, pageSizeOptions } = usePagination();

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [filter]);

    const fetchTemplate = async () => {
        if (!userData) return;
        setFetching(true);
        try {
            const response = await API.GradeSetting.GetListDocumentTemplate({
                school_id: userData.school_id,
                ...filter,
                ...pagination,
            });

            setTemplate(response.data.data);
            setPagination((prev) => ({
                ...prev,
                total_count: response.data._pagination.total_count,
            }));
        } catch (error) {
            throw error;
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchTemplate();
    }, [pagination.limit, pagination.page, filter]);

    return {
        template,
        fetching,
        pagination,
        setPagination,
        pageSizeOptions,
        fetchTemplate,
    };
}
