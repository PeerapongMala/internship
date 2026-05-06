import IconMagnify from '@component/web/atom/wc-a-icon-magnify';
import { cn } from '@global/helper/cn';
import { createSoundController, SoundController } from '@global/helper/sound';
import { FormEvent, InputHTMLAttributes, useEffect, useRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  onSearchClick?: () => void;
  onSearchSubmit?: (value: string) => void;
};

const CWInputSearch = ({
  className,
  disabled,
  placeholder,
  value,
  onChange,
  onSearchSubmit,
}: InputProps) => {
  const soundControllerRef = useRef<SoundController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevLengthRef = useRef<number>(0);

  useEffect(() => {
    if (disabled) return;
    soundControllerRef.current = createSoundController('typing_game', {
      autoplay: false,
      loop: true,
      volume: 'sfx',
    });

    prevLengthRef.current = value?.toString().length || 0;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (soundControllerRef.current) {
        soundControllerRef.current.stop();
        soundControllerRef.current.destory();
        soundControllerRef.current = null;
      }
    };
  }, [disabled]);

  const stopTypingSound = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (soundControllerRef.current) {
        soundControllerRef.current.stop();
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newLength = newValue.length;
    if (!disabled && newLength !== prevLengthRef.current && soundControllerRef.current) {
      soundControllerRef.current.play();
      stopTypingSound();
    }

    prevLengthRef.current = newLength;

    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !disabled &&
      (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') &&
      soundControllerRef.current
    ) {
      soundControllerRef.current.play();
      stopTypingSound();
    }
  };

  const handleBlur = () => {
    if (soundControllerRef.current) {
      soundControllerRef.current.stop();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchText = formData.get('search-text')?.toString();

    if (soundControllerRef.current) {
      soundControllerRef.current.stop();
    }

    onSearchSubmit?.(searchText ?? '');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        name="search-text"
        className={cn(
          `form-input w-full rounded-md border border-neutral-200 px-2 py-[3px] ${disabled ? 'cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]' : ''} `,
          className,
        )}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="submit"
        className={`absolute right-0 top-0 flex h-full items-center justify-center`}
      >
        <IconMagnify className="h-5 w-5" />
      </button>
    </form>
  );
};

export default CWInputSearch;
