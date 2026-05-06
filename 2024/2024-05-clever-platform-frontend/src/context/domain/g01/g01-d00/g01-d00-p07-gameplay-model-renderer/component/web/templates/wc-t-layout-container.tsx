import React from 'react';

import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import { Alignment } from '../../../type';

interface LayoutContainerProps {
  alignment: Alignment;
  children: React.ReactNode;
  flex: Array<number>;
  className?: string;
}

const LayoutContainer = ({
  alignment,
  children,
  flex,
  className,
}: LayoutContainerProps) => {
  const flexDirection = alignment === 'horizontal' ? 'flex-row' : 'flex-col';
  const flexSum = flex.reduce((acc, cur) => acc + cur, 0);

  const getFlexBasisStyle = (value: number) => {
    return { flexBasis: `${(value / flexSum) * 100}%` };
  };

  return (
    <div className={`flex ${flexDirection} h-full w-full ${className} overflow-auto`}>
      {React.Children.map(children, (child, index) => (
        <div
          style={getFlexBasisStyle(flex[index])}
          className="w-full h-full overflow-auto"
        >
          <ScrollableContainer>{child}</ScrollableContainer>
        </div>
      ))}
    </div>
  );
};

export default LayoutContainer;
