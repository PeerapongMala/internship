import CWButton from '@component/web/cw-button'
import CWInputSearch from '@component/web/cw-input-search'
import CWSelect from '@component/web/cw-select'
import IconPlus from '@core/design-system/library/component/icon/IconPlus'
import { TTemplateFilter } from '@domain/g06/g06-d07/local/types/template'
import { debounce } from 'lodash'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

type CWHeaderTemplateProps = {
    filter: TTemplateFilter;
    onCreate?: () => void;
    onSearch?: (value: string) => void;
    onTemplateChange?: (templateId: number | undefined) => void;
}

const optionsTemplate = [
    { label: 'รูปแบบที่ 1', value: 1 },
    { label: 'รูปแบบที่ 2', value: 2 },
    { label: 'รูปแบบที่ 3', value: 3 }
]

const CWHeaderTemplate = ({
    filter,
    onCreate,
    onSearch,
    onTemplateChange
}: CWHeaderTemplateProps) => {
    const [searchText, setSearchText] = useState(filter.name || '')

    useEffect(() => {
        setSearchText(filter.name || '');
    }, [filter.name]);
    const debouncedSearch = useMemo(
        () => debounce((value: string) => {
            if (onSearch) {
                onSearch(value);
            }
        }, 300),
        [onSearch]
    );
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    const handleTemplateChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === '' ? undefined : Number(e.target.value);
        if (onTemplateChange) {
            onTemplateChange(value);
        }
    }, [onTemplateChange]);

    return (
        <div className='w-full'>
            <div className='flex gap-5 mb-5'>
                <CWButton
                    title='เพิ่มรูปแบบเอกสาร'
                    icon={<IconPlus />}
                    onClick={onCreate}
                />
                <CWInputSearch
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>

            <CWSelect
                title={'Template เอกสาร'}
                className='max-w-[250px]'
                value={filter?.format_id}
                options={optionsTemplate}
                onChange={handleTemplateChange}
            />
        </div>
    )
}

export default CWHeaderTemplate