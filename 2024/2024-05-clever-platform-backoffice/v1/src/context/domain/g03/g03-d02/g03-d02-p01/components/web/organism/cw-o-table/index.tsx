import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWMTablePagination from '../../molecule/cw-m-table-pagination';
import CWMSelectLimit from '../../molecule/cw-m-table-select-limit';

export enum HeaderType {
  SINGLE,
  GROUP,
}

interface PhorPro6TableHeaders {
  key: string;
  label: string;
  type: HeaderType;
}

export interface PhorPro6TableHeadersGroup {
  key: string;
  label: string;
  value: string;
}

export type PhorPro6TableHeaderSingle = PhorPro6TableHeaders & {
  type: HeaderType.SINGLE;
};

export type PhorPro6TableHeaderGroup = PhorPro6TableHeaders & {
  type: HeaderType.GROUP;
  groups: PhorPro6TableHeadersGroup[];
};

export interface PhorPro6TableData {
  [k: string]:
    | string
    | {
        value: string;
        className: string;
      };
}

export interface PhorPro6TableProps {
  headers: Array<PhorPro6TableHeaderSingle | PhorPro6TableHeaderGroup>;
  data: PhorPro6TableData[];
}

const CWOPhorPro6Table = ({ headers, data }: PhorPro6TableProps) => {
  const getDataValue = (data: PhorPro6TableData, key: string) => {
    if (typeof data[key] !== 'string') {
      return data[key];
    } else {
      return {
        value: data[key],
        className: '',
      };
    }
  };

  return (
    <div className="flex flex-col gap-y-5">
      <table className="table-auto">
        <thead>
          <tr>
            {headers.map((h) => {
              if (h.type === HeaderType.SINGLE) {
                return (
                  <th
                    key={h.key}
                    className="w-28 border border-neutral-400 text-center text-sm font-bold"
                  >
                    {h.label}
                  </th>
                );
              } else {
                return (
                  <th
                    key={h.key}
                    className="clear-padding border border-neutral-400 text-center text-sm font-bold"
                  >
                    <th
                      className={cn(
                        'flex justify-center border-b border-neutral-400 text-center text-sm font-bold',
                      )}
                    >
                      {h.label}
                    </th>
                    <div className="flex justify-evenly border-neutral-400">
                      {h.groups.map((g, index) => {
                        if (index === h.groups.length - 1) {
                          return (
                            <div
                              key={g.key}
                              className="flex min-w-24 flex-1 flex-col justify-end text-start text-sm font-bold"
                            >
                              <th className="flex h-full items-center justify-center border-b border-neutral-400 text-center text-sm font-bold">
                                {g.label}
                              </th>
                              <th className="clear-padding text-center text-sm font-bold">
                                {g.value}
                              </th>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={g.key}
                            className="flex flex-1 flex-col justify-end border-r border-neutral-400 text-start text-sm font-bold"
                          >
                            <th className="clear-padding flex -rotate-180 items-center border-t border-neutral-400 [writing-mode:vertical-lr]">
                              <p className="h-28 truncate text-sm font-bold">{g.label}</p>
                            </th>
                            <th className="clear-padding text-center text-sm font-bold text-primary">
                              {g.value}
                            </th>
                          </div>
                        );
                      })}
                    </div>
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => {
            return (
              <tr className={cn('h-8', (index + 1) % 2 === 0 && 'bg-neutral-100')}>
                {headers.map((h) => {
                  if (h.type === HeaderType.SINGLE) {
                    return (
                      <td
                        className={cn(
                          'clear-padding border border-neutral-400 text-center text-sm',
                          getDataValue(d, h.key).className,
                        )}
                      >
                        {getDataValue(d, h.key).value}
                      </td>
                    );
                  } else {
                    return (
                      <td className="clear-padding border border-neutral-400">
                        <div className="flex justify-evenly border-neutral-400">
                          {h.groups.map((g, j) => {
                            if (j === h.groups.length - 1) {
                              return (
                                <div className="flex min-w-24 flex-1 flex-col justify-end text-start">
                                  <td
                                    className={cn(
                                      'clear-padding flex h-8 items-center justify-center text-center text-sm',
                                      getDataValue(d, g.key).className,
                                    )}
                                  >
                                    {getDataValue(d, g.key).value}
                                  </td>
                                </div>
                              );
                            }
                            return (
                              <div className="flex flex-1 flex-col justify-end border-r border-neutral-400 text-start">
                                <td
                                  className={cn(
                                    'clear-padding flex h-8 items-center justify-center text-center text-sm',
                                    getDataValue(d, g.key).className,
                                  )}
                                >
                                  {getDataValue(d, g.key).value}
                                </td>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex w-full justify-between">
        <CWMSelectLimit />
        <CWMTablePagination />
      </div>
    </div>
  );
};

export default CWOPhorPro6Table;
