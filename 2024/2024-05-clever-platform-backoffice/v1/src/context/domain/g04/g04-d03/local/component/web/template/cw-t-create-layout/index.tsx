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

interface CWTCreateLayoutProps {
  children?: React.ReactNode;
  breadcrumbs: { text: string; href: string }[];
  tabs?: { label: string; key: string; children?: React.ReactNode }[];
  setCurrentTabIndex?: (index: number) => void;

  statusOptions?: { label: any; value: any }[];

  id?: any;
  idLabel?: any;
  status?: string;
  modifiedDate?: Date;
  modifiedBy?: string;

  navigateLabel: string;
  navigateTo: string;
  buttonLabel?: string;
  onSubmit?: () => void;
  onStatusChange?: (status: string) => void;
  sideItems?: SideItem[];
  sideChildren?: React.ReactNode;
  onDataChange?: (formData: Record<string, any>) => void;
}

type SideItem = (
  | { type: 'label'; render?: () => React.ReactNode }
  | { type: 'select'; options: Option[] }
  | { type: 'toggle'; onLabel?: string; offLabel?: string }
  | { type: 'textarea' | 'border'; render?: () => React.ReactNode }
) & {
  key: string;
  label?: string;
  value?: any;
  fulled?: boolean;
  hidden?: boolean;
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
        stauts: props.status,
        modifiedDate: props.modifiedDate,
        modifiedBy: props.modifiedBy,
      } as Record<string, any>),
  );

  useEffect(() => {
    props.onDataChange?.(formData);
  }, [formData]);

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
          onClick={setCurrentTabIndex}
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
                  label: props.idLabel ?? t('field.item.id'),
                  value: props.id,
                  type: 'text',
                },
                {
                  label: t('status.name'),
                  value: props.status,
                  type: 'select',
                  key: 'status',
                  options: props.statusOptions ?? [],
                },
                {
                  label: t('field.modifiedDate'),
                  value: props.modifiedDate,
                  rendor: () =>
                    props.modifiedDate
                      ? toDateTimeTH(props.modifiedDate)
                      : props.modifiedDate,
                  type: 'text',
                },
                {
                  label: t('field.modifiedBy'),
                  value: props.modifiedBy ?? '-',
                  type: 'text',
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
                        <CWASelect
                          name="status"
                          options={config.options}
                          value={config.value}
                          onChange={(e) => {
                            props.onStatusChange?.(e.currentTarget.value);
                            setFormData((prev) => ({
                              ...prev,
                              [config.key]: e.currentTarget.value,
                            }));
                          }}
                        />
                      ) : config.type == 'toggle' ? (
                        <div className="flex gap-2">
                          <CWButtonSwitch
                            initialState={config.value}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                [config.key]: value,
                              }))
                            }
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
                        (config.render?.() ?? config.value)
                      ) : (
                        ''
                      )}
                    </div>
                  </>
                )}
              </Fragment>
            ))}
            <CWButton
              className="col-span-3 flex-1"
              title={props.buttonLabel ?? t('button.save')}
              onClick={() => props.onSubmit?.()}
            />
          </div>
          {props.sideChildren}
        </div>
      </div>
    </CWTLayout>
  );
};

export default CWTCreateLayout;
