import CWSwitchTabs from '@component/web/cs-switch-taps';
import useObserverAccessStore from '@domain/g01/g01-d09/local/stores/observer-access-form';

type TableMenuTabProps = {
  handleOnSwitchTab?: (tabId: number) => void;
};

const TableMenuTab = ({ handleOnSwitchTab }: TableMenuTabProps) => {
  const store = useObserverAccessStore();
  const SwitchTabs = [
    {
      id: '0',
      label: 'ข้อมูลสิทธิ์การเข้าถึง',
      onClick: () => handleOnSwitchTab?.(0),
    },
    store.formData.id
      ? {
          id: '1',
          label: 'รายชื่อโรงเรียน',
          onClick: () => {
            handleOnSwitchTab?.(1);
          },
        }
      : undefined,
  ].filter((tab) => !!tab);

  return <CWSwitchTabs tabs={SwitchTabs} />;
};

export default TableMenuTab;
