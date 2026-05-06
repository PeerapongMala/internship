import { useCallback, useRef } from 'react';

type UseLongPressProps = {
  onLongPress?: (event: Event) => void;
  onClick?: (event: Event) => void;
  shouldPreventDefault?: boolean;
  delay?: number;
};

export function useLongPress({
  onLongPress,
  onClick,
  shouldPreventDefault = true,
  delay = 300,
}: UseLongPressProps) {
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget | null>(null);
  const longPressTriggered = useRef(false); // Track if long press was triggered

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.preventDefault();
      }

      // Check if the event is a touch event and prevent default behavior
      longPressTriggered.current = false;
      target.current = event.target;

      // Prevent default behavior for touch events
      if (onLongPress) {
        timeout.current = setTimeout(() => {
          onLongPress(event.nativeEvent);
          longPressTriggered.current = true;
        }, delay);
      }
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      if (
        onClick &&
        shouldTriggerClick &&
        !longPressTriggered.current &&
        target.current === event.target
      ) {
        onClick(event.nativeEvent);
      }
    },
    [onClick],
  );

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
  };
}

type UseClickCountTriggerProps = {
  triggerCount: number; // how many clicks to trigger
  onTrigger: (event: MouseEvent | TouchEvent) => void;
  timeout?: number; // optional timeout window to reset count
};

export function useClickCountTrigger({
  onTrigger,
  triggerCount,
  timeout = 500,
}: UseClickCountTriggerProps) {
  const clickCount = useRef(0);
  const timer = useRef<NodeJS.Timeout>();

  const handleClick = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      clickCount.current += 1;

      if (timer.current) {
        clearTimeout(timer.current);
      }

      if (clickCount.current >= triggerCount) {
        onTrigger(event.nativeEvent);
        clickCount.current = 0;
      } else {
        timer.current = setTimeout(() => {
          clickCount.current = 0;
        }, timeout);
      }
    },
    [triggerCount, timeout, onTrigger],
  );

  return {
    onClick: handleClick,
    onTouchEnd: handleClick,
  };
}
