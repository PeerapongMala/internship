import LayoutBlank from '@core/design-system/library/component/layout/blank';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@store/global/index.ts';

const WCTRouteTemplate = (props: { children?: React.ReactNode }) => {
  const { templateIs } = StoreGlobal.StateGet(['templateIs']);

  if (!templateIs) {
    return <LayoutBlank>{props.children}</LayoutBlank>;
  }

  return <LayoutDefault>{props.children}</LayoutDefault>;
};

export default WCTRouteTemplate;
