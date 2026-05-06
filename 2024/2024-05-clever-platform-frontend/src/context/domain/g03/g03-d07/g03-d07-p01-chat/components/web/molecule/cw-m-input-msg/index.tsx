import IconSend from '@component/web/atom/wc-a-icon-send';
import { createSoundController, SoundController } from '@global/helper/sound';
import { InputHTMLAttributes, KeyboardEvent, useEffect, useRef } from 'react';

type InputMsgProps = InputHTMLAttributes<HTMLTextAreaElement> & {
  onSubmitMsg?: (content: string) => void;
};

/**
 * This input msg have behavior like in Facebook Messenger.
 * When press enter will submit form
 * When shift + enter will add new line
 * Now includes typing sound effects
 */
const InputMsg = ({
  name,
  placeholder = 'Type a message',
  onSubmitMsg,
}: InputMsgProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const soundControllerRef = useRef<SoundController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevLengthRef = useRef<number>(0);

  useEffect(() => {
    soundControllerRef.current = createSoundController('typing_game', {
      autoplay: false,
      loop: true,
      volume: 'sfx',
    });

    if (textareaRef.current) {
      prevLengthRef.current = textareaRef.current.value.length;
    }

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

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    const newLength = textarea.value.length;
    if (newLength !== prevLengthRef.current && soundControllerRef.current) {
      soundControllerRef.current.play();
      stopTypingSound();
    }

    prevLengthRef.current = newLength;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit message on Enter (not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (soundControllerRef.current) {
        soundControllerRef.current.stop();
      }

      onSubmitMsg?.(e.currentTarget.value);
      if (textareaRef.current) {
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
        prevLengthRef.current = 0;
      }
      return;
    }

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
    <div className="px-5 py-2">
      <div className="flex w-full items-center gap-3 rounded-[100px] border border-neutral-200 px-4 py-2">
        <textarea
          className="max-h-16 min-h-5 w-full flex-1 resize-none focus:border-transparent focus:outline-none"
          ref={textareaRef}
          rows={1}
          maxLength={2000}
          name={name}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
        />
        <IconSend className="right-10 top-0" />
      </div>
    </div>
  );
};

export default InputMsg;
