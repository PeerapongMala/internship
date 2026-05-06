import styles from './index.module.css';

interface ScrollableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function ScrollableContainer({
  children,
  className = '',
  ...divProps
}: ScrollableContainerProps) {
  return (
    <div
      {...divProps}
      className={`${styles['scrollable-container']} w-full h-full overflow-x-auto ${className}`}
    >
      {children}
    </div>
  );
}

export default ScrollableContainer;
