import CWEditor from '@component/web/cw-editor';
import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWSelect from '@component/web/cw-select';
import CWAInputLabel from '@domain/g01/g01-d05/local/component/web/atom/cw-a-input-label';
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from 'react';

import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { getDate, getTime } from '@domain/g04/g04-d01/local/utils';

interface CWFormInputProps {
  fields: Field[][];
  className?: string;
  data: Record<string, any>;
  onDataChange?: Dispatch<SetStateAction<Record<string, any>>>;
}

type Field = (
  | { type: 'border' | 'blank' }
  | { type: 'label' | 'header'; text: React.ReactNode }
  | { type: 'text' | 'date' | 'time' | 'datetime' }
  | { type: 'select'; options: { label: string; value: string }[] }
  | { type: 'editor' }
  | { type: 'number'; step?: number }
  | { type: 'component'; component: React.ReactNode }
) & {
  key?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  labelHidden?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  value?: any;
  hidden?: boolean;
  chceckbox?: boolean;
  chceckboxLabel?: string;
  checkboxKey?: string;
  onCheckboxChange?: (value: boolean) => void;
  onChange?: (value: string) => void;
};

const CWFormInput: React.FC<CWFormInputProps> = ({ data, ...props }) => {
  function getFieldData() {
    return props.fields.reduce(
      (prev, cols) => {
        for (let col of cols) {
          if (col.key && !col.hidden) {
            const value = col.value;
            if (col.type == 'date' || col.type == 'datetime') {
              prev[col.key + '-date'] = getDate(value);
            }
            if (col.type == 'time' || col.type == 'datetime') {
              prev[col.key + '-time'] = getTime(value);
            }
            prev[col.key] = value;
          }
        }
        return prev;
      },
      {} as Record<string, any>,
    );
  }

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

  function onInput(key?: string, value?: any) {
    if (key) {
      props.onDataChange?.((prev) => ({ ...prev, [key]: value }));
    }
  }

  function toZeroTimezone(date: string, time: string) {
    const [year, month, day] = date?.split('-') ?? [];
    const [hour, minute] = time?.split(':') ?? [];

    let datetime = '';
    if (year && month && day && hour && minute) {
      datetime = new Date(+year, +month - 1, +day, +hour, +minute).toISOString();
    } else {
      datetime = `${date ?? ''}T${time ?? ''}Z`;
    }
    return datetime;
  }

  return (
    <div className={`flex w-full flex-col gap-4 ${props.className ?? ''}`}>
      {props.fields.map((cols, index) => (
        <Fragment key={`row-${index}`}>
          {cols.some((col) => (col.hidden ?? false) == false) && (
            <div className="flex gap-4 *:flex-1">
              {cols.map((col, cIndex) => (
                <Fragment key={`row-${index}-col-${cIndex}`}>
                  {!(col.hidden ?? false) && (
                    <div
                      className={`flex flex-col ${col.chceckbox ? 'gap-2' : ''} ${col.className ?? ''}`}
                    >
                      {col.labelHidden && <div className="mb-1">&nbsp;</div>}
                      {col.type == 'select' ? (
                        <CWSelect
                          label={col.label}
                          options={col.options}
                          title={col.placeholder}
                          required={col.required}
                          disabled={data[col.checkboxKey || ''] ?? col.disabled}
                          value={col.key ? data[col.key] : undefined}
                          onChange={(e) => {
                            col.onChange?.(e.currentTarget.value);
                            onInput(col.key, e.currentTarget.value);
                          }}
                          className={col.inputClassName}
                        />
                      ) : col.type == 'text' ? (
                        <CWInput
                          type="text"
                          label={col.label}
                          required={col.required}
                          disabled={data[col.checkboxKey ?? ''] || col.disabled}
                          value={col.key ? data[col.key] : undefined}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            col.onChange?.(value);
                            onInput(col.key, e.currentTarget.value);
                          }}
                          placeholder={col.placeholder}
                          className={col.inputClassName}
                        />
                      ) : col.type == 'time' ? (
                        <CWInput
                          type="time"
                          label={col.label}
                          required={col.required}
                          disabled={data[col.checkboxKey ?? ''] || col.disabled}
                          value={col.key ? data[col.key] : undefined}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            col.onChange?.(value);
                            onInput(col.key, e.currentTarget.value);
                          }}
                          placeholder={col.placeholder}
                          className={col.inputClassName}
                        />
                      ) : col.type == 'date' ? (
                        <div className="flex flex-col gap-1">
                          <div>
                            {col.required && <span className="text-red-500">*</span>}
                            {col.label}
                          </div>
                          <WCAInputDateFlat
                            required={col.required}
                            disabled={data[col.checkboxKey ?? ''] || col.disabled}
                            value={col.key ? data[col.key] : undefined}
                            onChange={(e) => {
                              const value = e[0] ? toDateEN(e[0]) : '';
                              col.onChange?.(value);
                              onInput(col.key, value);
                            }}
                            placeholder={col.placeholder}
                            className={col.inputClassName}
                          />
                        </div>
                      ) : col.type == 'datetime' ? (
                        <div className="flex gap-4 *:flex-1">
                          <div className="flex flex-col gap-1">
                            <div>
                              {col.required && <span className="text-red-500">*</span>}
                              {col.label}
                            </div>
                            <WCAInputDateFlat
                              required={col.required}
                              disabled={data[col.checkboxKey ?? ''] || col.disabled}
                              value={
                                col.key
                                  ? data[col.key + '-date']
                                    ? data[col.key + '-date']
                                    : data[col.key]
                                      ? getDate(data[col.key])
                                      : undefined
                                  : undefined
                              }
                              onChange={(e) => {
                                const _time = data[col.key ?? ''];
                                const time =
                                  data[`${col.key}-time`] ??
                                  (_time ? getTime(_time) : '');
                                const value = e[0] ? toDateEN(e[0]) : '';
                                const datetime = toZeroTimezone(value, time);
                                onInput(col.key + '-date', value);
                                onInput(col.key, datetime);
                                col.onChange?.(datetime);
                              }}
                              placeholder={col.placeholder}
                              className={`flex-1 ${col.inputClassName ?? ''}`}
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-1">
                            <div>&nbsp;</div>
                            <CWInput
                              type="time"
                              required={col.required}
                              disabled={data[col.checkboxKey ?? ''] || col.disabled}
                              value={
                                col.key
                                  ? data[col.key + '-time']
                                    ? data[col.key + '-time']
                                    : data[col.key]
                                      ? getTime(data[col.key])
                                      : undefined
                                  : undefined
                              }
                              onChange={(e) => {
                                const date =
                                  data[`${col.key}-date`] ??
                                  getDate(data[col.key ?? '']) ??
                                  '';
                                const value = e.currentTarget.value + ':00';
                                const datetime = toZeroTimezone(date, value);
                                onInput(col.key + '-time', value);
                                onInput(col.key, datetime);
                                col.onChange?.(datetime);
                              }}
                              placeholder={col.placeholder}
                              className={`${col.inputClassName ?? ''}`}
                            />
                          </div>
                        </div>
                      ) : col.type == 'number' ? (
                        <CWInput
                          type={col.type}
                          label={col.label}
                          required={col.required}
                          placeholder={col.placeholder}
                          disabled={data[col.checkboxKey ?? ''] || col.disabled}
                          value={col.key ? data[col.key] : undefined}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            col.onChange?.(value);
                            onInput(col.key, e.currentTarget.value);
                          }}
                          className={col.inputClassName}
                          step={col.step}
                        />
                      ) : col.type == 'editor' ? (
                        <CWEditor
                          required={col.required}
                          label={col.label}
                          value={col.key && data ? data[col.key] : undefined}
                          onChange={(content) => {
                            onInput(col.key, content);
                            col.onChange?.(content);
                          }}
                          className={col.inputClassName}
                          disabled={col.disabled}
                        />
                      ) : col.type == 'component' ? (
                        col.component
                      ) : col.type == 'label' ? (
                        <div className={col.className}>{col.text}</div>
                      ) : col.type == 'header' ? (
                        <div className={`text-lg font-bold ${col.className ?? ''}`}>
                          {col.text}
                        </div>
                      ) : col.type == 'border' ? (
                        <hr />
                      ) : (
                        ''
                      )}
                      {col.chceckbox && (
                        <CWInputCheckbox
                          label={col.chceckboxLabel}
                          checked={data[col.checkboxKey || ''] || false}
                          onChange={(e) => {
                            onInput(col.checkboxKey, e.currentTarget.checked);
                            col.onCheckboxChange?.(e.currentTarget.checked);
                          }}
                        />
                      )}
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default CWFormInput;
