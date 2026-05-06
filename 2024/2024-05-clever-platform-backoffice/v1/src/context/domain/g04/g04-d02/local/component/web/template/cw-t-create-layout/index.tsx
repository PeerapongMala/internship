import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import CWMReverseNavigate from '@domain/g01/g01-d05/local/component/web/molecule/cw-m-reverse-navigate';
import { Fragment } from 'react/jsx-runtime';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';
import CWASelect, {
  Option,
} from '@domain/g01/g01-d05/local/component/web/atom/cw-a-select';
import { useEffect, useState } from 'react';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWSelect from '@component/web/cw-select';

interface CWTCreateLayoutProps {
  children?: React.ReactNode;
  breadcrumbs: { text: string; href: string; disabled?: boolean }[];
  tabs?: {
    label: string;
    key: string;
    children?: React.ReactNode;
    onBeforeClick?: () => boolean;
  }[];
  setCurrentTabIndex?: (index: number) => void;

  statusOptions?: { label: any; value: any }[];

  id?: any;
  idLabel?: any;
  status?: string;
  updated_at?: string | null;
  updated_by?: string | null;

  navigateLabel: string;
  navigateTo: string;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  onSubmit?: () => void;
  onStatusChange?: (status: string) => void;
  sideItems?: SideItem[];
  sideChildren?: React.ReactNode;
  onDataChange?: (formData: Record<string, any>) => void;
}

type SideItem = (
  | { type: 'label'; render?: () => React.ReactNode }
  | { type: 'select'; options: { label: string; value: string }[] }
  | { type: 'toggle'; onLabel?: string; offLabel?: string }
  | { type: 'textarea' | 'border'; render?: () => React.ReactNode }
) & {
  key: string;
  label?: string;
  value?: any;
  fulled?: boolean;
  hidden?: boolean;
  disabled?: boolean;
};

const CWTCreateLayout: React.FC<CWTCreateLayoutProps> = function ({
  children,
  ...props
}) {
  const { t } = useTranslation(ConfigJson.key);

  const [formData, setFormData] = useState(
    props.sideItems?.reduce(
      (prev, i) => ({
        ...prev,
        [i.key]: i.value,
      }),
      {} as Record<string, any>,
    ) ??
    ({
      id: props.id,
      status: props.status,
      updated_at: props.updated_at,
      updated_by: props.updated_by,
    } as Record<string, any>),
  );

  useEffect(() => {
    props.onDataChange?.(formData);
  }, [formData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: props.id,
      status: props.status,
      updated_at: props.updated_at,
      updated_by: props.updated_by,
    }));
  }, [props.status, props.id, props.updated_at, props.updated_by]);

  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  useEffect(() => {
    props.setCurrentTabIndex?.(currentTabIndex);
  }, [currentTabIndex]);

  return (
    <CWTLayout breadcrumbs={props.breadcrumbs}>
      <CWMReverseNavigate label={props.navigateLabel} to={props.navigateTo} />

      {props.tabs && (
        <CWMTabs
          currentIndex={currentTabIndex}
          onClick={(index) => {
            if (props.tabs?.[index].onBeforeClick?.() ?? true) {
              setCurrentTabIndex(index);
            }
          }}
          items={props.tabs.map((t) => t.label)}
        />
      )}

      <div className="flex flex-wrap gap-8 *:rounded-md *:bg-white *:p-4 *:shadow-md lg:flex-nowrap *:dark:bg-dark-dark-light">
        <div className="flex h-fit w-full flex-auto flex-col gap-4 overflow-hidden">
          {currentTabIndex == 0 ? (
            <>{children}</>
          ) : (
            props.tabs?.[currentTabIndex]?.children
          )}
        </div>

        <div className="h-fit">
          <div className="grid w-full grid-cols-3 gap-4 lg:w-[400px]">
            {(
              props.sideItems ??
              ([
                {
                  label: props.idLabel ?? 'รหัส',
                  value: formData.id ?? '-',
                  type: 'label',
                },
                {
                  label: 'สถานะ',
                  value: props.status || 'draft',
                  type: 'select',
                  key: 'status',
                  options: props.statusOptions ?? [],
                },
                {
                  label: 'แก้ไขล่าสุด',
                  value: props.updated_at,
                  render: () => (props.updated_at ? toDateTimeTH(props.updated_at) : '-'),
                  type: 'label',
                },
                {
                  label: 'แก้ไขล่าสุดโดย',
                  value: props.updated_by ?? '-',
                  type: 'label',
                },
              ] as SideItem[])
            ).map((config, index) => (
              <Fragment key={`config-${index}`}>
                {!(config.hidden ?? false) && (
                  <>
                    {config.label && (
                      <div className="flex items-center">{config.label}:</div>
                    )}
                    <div className="col-span-2">
                      {config.type == 'select' ? (
                        <CWSelect
                          options={config.options}
                          value={formData[config.key]}
                          onChange={(e) => {
                            const value = e.currentTarget.value;
                            props.onStatusChange?.(value);
                            setFormData((prev) => ({
                              ...prev,
                              [config.key]: value,
                            }));
                          }}
                        />
                      ) : config.type == 'toggle' ? (
                        <div className="flex gap-2">
                          <CWButtonSwitch
                            initialState={config.value}
                            onChange={(value) => {
                              if (!config.disabled) {
                                setFormData((prev) => ({
                                  ...prev,
                                  [config.key]: value,
                                }));
                              }
                            }}
                          />
                          <div>
                            {formData[config.key] ? config.onLabel : config.offLabel}
                          </div>
                        </div>
                      ) : config.type == 'textarea' ? (
                        <div></div>
                      ) : config.type == 'border' ? (
                        <div className="col-span-3">
                          <hr />
                        </div>
                      ) : config.type == 'label' ? (
                        (config.render?.() ?? config.value ?? '-')
                      ) : (
                        ''
                      )}
                    </div>
                  </>
                )}
              </Fragment>
            ))}
            <div className="col-span-3 flex-1">
              <CWButton
                title={props.buttonLabel ?? 'บันทึก'}
                onClick={() => props.onSubmit?.()}
                disabled={props.buttonDisabled}
              />
            </div>

          </div>
          {props.sideChildren}
        </div>
      </div>
    </CWTLayout>
  );
};

export default CWTCreateLayout;
