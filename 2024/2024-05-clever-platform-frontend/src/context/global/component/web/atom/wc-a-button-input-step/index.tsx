import TextWithStroke from '@global/component/web/atom/wc-a-text-stroke';
import { cn } from '@global/helper/cn';
import { createSoundController, SoundController } from '@global/helper/sound';
import { useEffect, useRef } from 'react';
import HighlightSVG from '../../../../assets/btn-top-hightlight.svg';

const ButtonInputStep = ({
  step,
  inputType = 'text',
  value = '',
  placeholder = 'กรอกรหัสโรงเรียน...',
  onChange,
  invalidText,
  invalidTextClass,
}: {
  step: string;
  inputType?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'color'
    | (string & {});
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  invalidText?: string;
  invalidTextClass?: string;
}) => {
  const soundControllerRef = useRef<SoundController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevLengthRef = useRef<number>(0);

  useEffect(() => {
    soundControllerRef.current = createSoundController('typing_game', {
      autoplay: false,
      loop: true,
      volume: 'sfx',
    });
    prevLengthRef.current = value?.length || 0;

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
  }, []);

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

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    const newLength = newValue.length;

    if (newLength !== prevLengthRef.current && soundControllerRef.current) {
      soundControllerRef.current.play();
      stopTypingSound();
    }

    prevLengthRef.current = newLength;
    onChange && onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
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

  return (
    <div className="flex w-full px-10 pb-6 relative">
      <div
        className={cn(
          'relative flex text-xl font-bold rounded-l-full select-none',
          'border-box border-b-4 border-secondary',
          'bg-secondary text-black',
          'w-[150px] h-[80px]',
        )}
        style={{
          boxShadow: '0px 4px 0px 0px rgb(255 238 153 / var(--tw-border-opacity, 1))',
        }}
      >
        <img src={HighlightSVG} className="absolute top-0 left-0 h-full w-auto" />
        <div
          style={{
            textShadow:
              '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
          }}
          className="flex items-center justify-center h-full w-full"
        >
          <TextWithStroke
            text={step}
            className="absolute text-gray-800 text-3xl font-bold top-6 left-8"
            strokeClassName="text-stroke-secondary"
          />
        </div>
      </div>
      <input
        type={inputType}
        className={`w-full h-20 border-4 rounded-r-full pr-4 text-center text-3xl focus:outline-none bg-white ${
          invalidText ? 'border-red-500' : 'border-secondary focus:border-secondary'
        }`}
        value={value}
        placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          boxShadow: '0px 4px 0px 0px rgb(255 238 153 / var(--tw-border-opacity, 1))',
        }}
      />
      {invalidText && (
        <div
          className={cn(
            'absolute -bottom-2 left-40 text-red-500 text-xl',
            invalidTextClass,
          )}
        >
          {invalidText}
        </div>
      )}
    </div>
  );
};

export default ButtonInputStep;
