import React, { Fragment, useEffect, useState } from 'react';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWOHeaderTableButton, {
  CWOHeaderTableButtonProps,
} from '@component/web/organism/cw-o-header-table-button';
import CWTable, { CWTableProps } from '@domain/g04/g04-d02/local/component/web/cw-table';

interface CWTableTemplateProps<T> {
  table: CWTableProps<T>;
  filters?: Filter<T>[];
  header?: CWOHeaderTableButtonProps;
  tabs?: {
    key?: string;
    tabIndex: number;
    items: string[];
    onTabChange?: (index: number) => void;
    onFilters?: (index: number, record: T) => boolean;
  };
  className?: string;
}

export type Filter<T> = (
  | {
      type?: 'select';
      options?: { label: string; value: any }[];
    }
  | {
      type: 'date';
    }
  | {
      type: 'date-range';
    }
  | {
      type: 'component';
      component: React.ReactNode;
    }
) & {
  key: string;
  value: any;
  placeholder?: string;
  className?: string;
  hidden?: boolean;
  onFilter?: (value: string, record: T) => boolean;
  onChange?: (value: any) => void;
};

const CWTableTemplate = function <T extends Record<string, any>>(
  props: CWTableTemplateProps<T>,
) {
  function toDateEN(date: Date) {
    return (
      date
        ?.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .split('/')
        .reverse()
        .join('-') || ''
    );
  }

  return (
    <div className={`panel flex flex-col gap-5 ${props.className ?? ''}`}>
      {props.header && <CWOHeaderTableButton {...props.header} />}

      {props.filters && (
        <div className="flex w-fit flex-wrap gap-2">
          {props.filters?.map((filter, index) => (
            <Fragment key={`filter-${filter.key}`}>
              {!(filter.hidden ?? false) && (
                <div>
                  {filter.type == 'date' ? (
                    <WCAInputDateFlat
                      name={filter.placeholder ?? ''}
                      placeholder={filter.placeholder}
                      className={`min-w-48 ${filter.className ?? ''}`}
                      value={filter.value}
                      onChange={(e) => {
                        const value = e[0] ? toDateEN(e[0]) : '';
                        filter.onChange?.(value);
                        props.table.onPageChange?.(1);
                      }}
                    />
                  ) : filter.type == 'date-range' ? (
                    <CWMDaterange
                      value={filter.value}
                      onChange={(e) => {
                        props.table.onPageChange?.(1);
                        filter.onChange?.(e);
                      }}
                      defaultValue={filter.placeholder}
                    />
                  ) : filter.type == 'component' ? (
                    filter.component
                  ) : (
                    <CWSelect
                      title={filter.placeholder}
                      options={filter.options}
                      value={filter.value}
                      className={`min-w-48 ${filter.className ?? ''}`}
                      onChange={(e) => {
                        filter.onChange?.(e.currentTarget.value);
                        props.table.onPageChange?.(1);
                      }}
                    />
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}

      {props.tabs && (
        <CWMTabs
          items={props.tabs.items ?? []}
          currentIndex={props.tabs.tabIndex}
          onClick={(e) => {
            props.tabs?.onTabChange?.(e);
            props.table.onPageChange?.(1);
          }}
        />
      )}

      <CWTable {...props.table} />
    </div>
  );
};

export default CWTableTemplate;
