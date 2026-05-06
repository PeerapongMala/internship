import { LayoutContainerProps } from '../../../type';
import LayoutContainer from '../templates/wc-t-layout-container';

const LayoutContainerComponent: React.FC<LayoutContainerProps> = ({
  alignment,
  flex,
  className,
  children,
}) => {
  return (
    <LayoutContainer alignment={alignment} flex={flex} className={className}>
      {children}
    </LayoutContainer>
  );
};

export default LayoutContainerComponent;
