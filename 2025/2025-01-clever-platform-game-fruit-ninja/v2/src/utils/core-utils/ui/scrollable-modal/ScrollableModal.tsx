import React, { useEffect, useRef } from 'react';

const enum VerticalScrollOptions {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

const enum HorizontalScrollOptions {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export const ScrollableModal: React.FC<{
  children?: React.ReactNode;
  autoScrollY?: VerticalScrollOptions;
  autoScrollX?: HorizontalScrollOptions;
}> = ({
  children,
  autoScrollY = VerticalScrollOptions.MIDDLE,
  autoScrollX = HorizontalScrollOptions.CENTER,
}: {
  children?: React.ReactNode;
  autoScrollY?: VerticalScrollOptions;
  autoScrollX?: HorizontalScrollOptions;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
        containerRef.current;

      let scrollX = 0;
      switch (autoScrollX) {
        case HorizontalScrollOptions.LEFT:
          scrollX = 0;
          break;
        case HorizontalScrollOptions.RIGHT:
          scrollX = scrollWidth - clientWidth;
          break;
        case HorizontalScrollOptions.CENTER:
        default:
          scrollX = (scrollWidth - clientWidth) / 2;
          break;
      }

      let scrollY = 0;
      switch (autoScrollY) {
        case VerticalScrollOptions.TOP:
          scrollY = 0;
          break;
        case VerticalScrollOptions.BOTTOM:
          scrollY = scrollHeight - clientHeight;
          break;
        case VerticalScrollOptions.MIDDLE:
        default:
          scrollY = (scrollHeight - clientHeight) / 2;
          break;
      }

      containerRef.current.scrollTo({
        top: scrollY,
        left: scrollX,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="flex-start scrollbar-hide absolute inline-flex h-screen w-screen flex-wrap place-items-center items-center justify-around overflow-x-auto overflow-y-auto align-middle"
      >
        {/* <div className='w-full min-h-screen h-fit flex flex-col items-center justify-center'> */}
        <div className="flex-start inline-flex h-fit min-h-screen w-fit min-w-screen flex-col flex-wrap items-center justify-around">
          {children}
        </div>
      </div>
    </>
  );
};
