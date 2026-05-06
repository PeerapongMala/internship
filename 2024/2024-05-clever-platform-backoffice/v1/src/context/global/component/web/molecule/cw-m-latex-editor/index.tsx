import { useState, useEffect, useRef } from 'react';
import Latex from 'react-latex-next';
import styles from './index.module.css';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import IconBackspace from '@core/design-system/library/component/icon/IconBackspace';
import IconShift from '@core/design-system/library/component/icon/IconBackspace';

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABETS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const SYMBOLS = '∞△>≥<≤+∠|-⦜^{}()×⊥∥π%.=≈≠÷';
const KEYBOARD_SUPPORT = ALPHABETS + SYMBOLS + ALPHABETS_LOWER;

// million-ignore
const CWMLatexEditor = ({
  value,
  setValue,
  onClose,
}: {
  value?: string;
  setValue?: (value: string) => void;
  onClose?: () => void;
}) => {
  const [text, setText] = useState('$$');
  const [cursorPosition, setCursorPosition] = useState(1); // Start cursor at position 0
  const [showAlphabets, setShowAlphabets] = useState(false);
  const [isShift, setIsShift] = useState(false);

  const updateText = (value: string) => {
    setText((prev) => {
      // Ensure the text always starts and ends with a `$`

      let newText = prev.slice(0, cursorPosition) + value + prev.slice(cursorPosition);
      if (!newText.startsWith('$')) {
        newText = `$${newText}`;
      }
      if (!newText.endsWith('$')) {
        newText += '$';
      }
      return newText;
    });
    setCursorPosition((prev) => prev + value.length);
  };

  const deleteText = () => {
    if (text !== '$$' && cursorPosition > 1) {
      setText((prev) => {
        const newText = prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition);
        return newText;
      });
    }
  };

  const updateCursorPosition = (action: string) => {
    switch (action) {
      case 'DEL':
        setCursorPosition((prev) => Math.max(1, prev - 1));
        break;
      case '←':
        let newCursorPositionLeft = Math.max(1, cursorPosition - 1);

        /* 
          if cursor in equation, (! is cursor)
          input: when cursor in come from latest ''  ex. $\left|{X}\right|!$
          output: move cursor to latest '}' ex. $\left|{X!}\right|$
        */
        // let isLatestDollarSignIndex = text[newCursorPositionLeft] === '';
        // let isFirstDollarSignIndex = false;
        // if (newCursorPositionLeft > 0) {
        //   for (let i = newCursorPositionLeft - 1; i >= 0; i--) {
        //     if (text[i] === '') {
        //       isFirstDollarSignIndex = true;
        //       break;
        //     }
        //   }
        // }

        // if (isLatestDollarSignIndex && isFirstDollarSignIndex) {
        //   let latestIndex = null;
        //   let firstIndex = null;
        //   if (newCursorPositionLeft > 0) {
        //     for (let i = newCursorPositionLeft - 1; i >= 0; i--) {
        //       if (text[i] === '}') {
        //         latestIndex = i;
        //       }
        //       if (text[i] === '{') {
        //         if (latestIndex !== null) {
        //           firstIndex = i;
        //           break;
        //         }
        //       }
        //     }

        //     if (latestIndex !== null && firstIndex !== null) {
        //       newCursorPositionLeft = latestIndex;
        //     }
        //   }
        // }
        setCursorPosition(newCursorPositionLeft);
        break;
      case '→':
        setCursorPosition((prev) => Math.min(text.length - 1, prev + 1));
        break;
      default:
        break;
    }
  };

  const handleClick = (value: any) => {
    console.log('handleClick:', value);

    switch (value) {
      case 'abc':
        setShowAlphabets((prev) => !prev);
        break;
      case 'DEL':
        deleteText();
        updateCursorPosition('DEL');
        break;

      case 'AC':
        setText('$$');
        setCursorPosition(1);
        break;

      case '+':
      case '-':
      case '/':
      case '×':
        updateText(value);
        break;

      case '←':
        updateCursorPosition('←');
        break;

      case '→':
        updateCursorPosition('→');
        break;

      case 'shift':
        setIsShift((prev) => !prev);
        break;

      default:
        updateText(value);
        break;
    }
  };

  const handleOk = () => {
    if (!text.includes('\\') && !text.includes('^')) {
      const newText = text
        .split('')
        .map((char) => {
          if (char === '$') {
            return '';
          }
          return char;
        })
        .join('');
      setValue?.(newText);
    } else {
      setValue?.(text);
    }
  };

  const renderTextWithCursor = () => {
    const newText = text
      .split('')
      .map((char) => {
        if (char === '$') {
          return ' ';
        }
        return char;
      })
      .join('');
    const beforeCursor = newText.slice(0, cursorPosition);
    const afterCursor = newText.slice(cursorPosition);

    return (
      <>
        {beforeCursor}
        <span className={styles['blinking-cursor']}>&nbsp;</span>
        {afterCursor}
      </>
    );
  };

  useEffect(() => {
    if (value) {
      const newText = value
        .split('')
        .map((char) => {
          if (char === '$') {
            return '';
          }
          return char;
        })
        .join('');
      setText(`$${newText}$`);
      setCursorPosition(newText.length + 1);
    }
  }, [value]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      console.log('Key pressed:', key);

      if (key === 'Backspace') {
        handleClick('DEL');
      } else if (key === 'Enter') {
        // handleOk();
      } else if (KEYBOARD_SUPPORT.includes(key)) {
        if (key === ' ') {
          return;
        }
        handleClick(key);
      } else if (key === 'ArrowLeft') {
        handleClick('←');
      } else if (key === 'ArrowRight') {
        handleClick('→');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cursorPosition]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full flex-col">
        <div className="flex h-full w-full">
          <div className="w-full rounded-md rounded-b-none border-2 border-secondary p-1 text-2xl">
            {text !== '$$' ? <Latex>{text}&nbsp;</Latex> : <>&nbsp;</>}
          </div>
          {/* <div
            onClick={handleOk}
            className="flex h-full w-28 cursor-pointer select-none items-center justify-center !rounded-l-none !rounded-tr-xl bg-primary/90 text-xl font-bold text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-110 active:scale-90"
          >
            ตกลง
          </div> */}
        </div>

        <div className="katex w-full rounded-md rounded-t-none border-2 border-t-0 border-secondary p-1 !text-2xl">
          {renderTextWithCursor()}&nbsp;
        </div>
      </div>
      <div className="flex w-full flex-col">
        <div className="grid grid-cols-8 gap-x-1">
          <PinButton
            pin={'abc'}
            onClick={handleClick}
            className={cn(!showAlphabets && 'col-span-4')}
            buttonClassName={cn(showAlphabets && 'bg-gray-200')}
          />
          {showAlphabets && (
            <PinButton
              pin={'shift'}
              onClick={handleClick}
              icon={<IconShift className="h-10 w-10" />}
              className={cn(showAlphabets && 'col-span-3')}
              buttonClassName={cn(isShift && 'bg-gray-200')}
            />
          )}
          <PinButton pin={'AC'} onClick={handleClick} />
          <PinButton pin={'←'} onClick={handleClick} buttonClassName="text-4xl" />
          <PinButton pin={'→'} onClick={handleClick} buttonClassName="text-4xl" />
          <PinButton
            pin={'DEL'}
            onClick={handleClick}
            icon={<IconBackspace className="h-10 w-10" />}
          />
        </div>

        {showAlphabets ? (
          <div className="flex flex-wrap justify-center gap-x-3">
            <KeyboardAlphabets handleClick={handleClick} isUpperCase={isShift} />
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-x-1">
            <KeyboardSymbols handleClick={handleClick} />
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center gap-2">
        <button className="btn btn-outline-primary flex w-32 gap-2" onClick={onClose}>
          ยกเลิก
        </button>
        <button className="btn btn-primary flex w-32 gap-2" onClick={handleOk}>
          ตกลง
        </button>
      </div>
    </div>
  );
};

const KeyboardAlphabets = ({
  handleClick,
  isUpperCase = false,
}: {
  handleClick: (value: string) => void;
  isUpperCase?: boolean;
}) => {
  const alphabets = isUpperCase ? ALPHABETS.split('') : ALPHABETS_LOWER.split('');
  return (
    <>
      {alphabets.map((alphabet, index) => (
        <PinButton key={alphabet} pin={alphabet} onClick={handleClick} />
      ))}
    </>
  );
};

const KeyboardSymbols = ({ handleClick }: { handleClick: (value: string) => void }) => {
  return (
    <>
      <PinButton pin={'∞'} onClick={handleClick} />
      <PinButton pin={'△'} onClick={handleClick} />
      <PinButton pin={'\\frac{X}{Y}'} onClick={handleClick} buttonClassName="text-lg" />
      <PinButtonHover pin={'>'}>
        <PinButton pin={'>'} onClick={handleClick} buttonClassName="border-none" />
        <PinButton pin={'≥'} onClick={handleClick} buttonClassName="border-none" />
        <PinButton pin={'<'} onClick={handleClick} buttonClassName="border-none" />
        <PinButton pin={'≤'} onClick={handleClick} buttonClassName="border-none" />
      </PinButtonHover>
      <PinButton
        pin={'7'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'8'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'9'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'+'}
        onClick={handleClick}
        buttonClassName="bg-[#FF6B00] text-white"
      />
      <PinButton pin={'\\circ'} onClick={handleClick} />
      <PinButton pin={'∠'} onClick={handleClick} />
      <PinButton pin={'|X|'} onClick={handleClick} buttonClassName="text-lg" />
      <PinButton pin={'\\sqrt{}'} onClick={handleClick} />
      <PinButton
        pin={'4'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'5'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'6'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'-'}
        onClick={handleClick}
        buttonClassName="bg-[#FF6B00] text-white"
      />
      <PinButtonHover pin={'\\overleftrightarrow{XY}'} buttonClassName="text-base">
        <PinButton
          pin={'\\overleftrightarrow{XY}'}
          onClick={handleClick}
          buttonClassName="border-none text-base"
        />
        <PinButton
          pin={'\\overline{XY}'}
          onClick={handleClick}
          buttonClassName="border-none text-base"
        />
        <PinButton
          pin={'\\overrightarrow{XY}'}
          onClick={handleClick}
          buttonClassName="border-none text-base"
        />
      </PinButtonHover>
      <PinButton pin={'⦜'} onClick={handleClick} />
      <PinButton pin={'{X}^{X}'} onClick={handleClick} buttonClassName="text-lg" />
      <PinButton pin={'(X)'} onClick={handleClick} buttonClassName="text-lg" />
      <PinButton
        pin={'1'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'2'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'3'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'×'}
        onClick={handleClick}
        buttonClassName="bg-[#FF6B00] text-white"
      />
      <PinButtonHover pin={'⊥'}>
        <PinButton pin={'⊥'} onClick={handleClick} buttonClassName="border-none" />
        <PinButton pin={'∥'} onClick={handleClick} buttonClassName="border-none" />
      </PinButtonHover>
      <PinButton pin={'π'} onClick={handleClick} buttonClassName="text-3xl" />
      <PinButtonHover pin={'X'}>
        <PinButton pin={'X'} onClick={handleClick} buttonClassName="border-none" />
        <PinButton pin={'Y'} onClick={handleClick} buttonClassName="border-none" />
        <PinButton pin={'Z'} onClick={handleClick} buttonClassName="border-none" />
      </PinButtonHover>
      <PinButton pin={'\\%'} onClick={handleClick} />
      <PinButton
        pin={'0'}
        onClick={handleClick}
        buttonClassName="bg-primary text-white"
      />
      <PinButton
        pin={'.'}
        onClick={handleClick}
        buttonClassName="bg-[#FF6B00] text-white"
      />
      <PinButtonHover
        pin={'='}
        buttonClassName="bg-[#FF6B00] text-white"
        optionClassName="bg-[#FF6B00] right-0"
      >
        <PinButton
          pin={'='}
          onClick={handleClick}
          buttonClassName="border-none bg-[#FF6B00] text-white"
        />
        <PinButton
          pin={'≈'}
          onClick={handleClick}
          buttonClassName="border-none bg-[#FF6B00] text-white"
        />
        <PinButton
          pin={'≠'}
          onClick={handleClick}
          buttonClassName="border-none bg-[#FF6B00] text-white"
        />
      </PinButtonHover>
      <PinButton
        pin={'÷'}
        onClick={handleClick}
        buttonClassName="bg-[#FF6B00] text-white"
      />
    </>
  );
};

// million-ignore
const PinButton = ({
  pin,
  onClick,
  icon,
  className,
  buttonClassName,
}: {
  pin: string;
  onClick: (pin: string) => void;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}) => {
  const pinText =
    pin.includes('\\') || pin.includes('^') || pin.includes('|X|') ? `$${pin}$` : pin;
  return (
    <div className={cn('flex h-16 items-center justify-start', className)}>
      <div
        onClick={() => onClick(pin)}
        className={cn(
          'flex h-[55px] w-[66px] cursor-pointer items-center justify-center rounded-md border-2 text-2xl font-bold text-black',
          'active:bg-gray-200',
          buttonClassName?.includes('bg-[#FF6B00]') && 'active:bg-[#FF6B00]-stroke',
          buttonClassName?.includes('bg-primary') && 'active:bg-primary-stroke',
          buttonClassName,
          '',
        )}
      >
        <div className="flex h-[30px] items-center justify-center">
          {icon ? (
            icon
          ) : (
            <span className="katex select-none">
              <Latex>{pinText}</Latex>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// million-ignore
const PinButtonHover = ({
  pin,
  icon,
  className,
  buttonClassName,
  optionClassName,
  children,
}: {
  pin: string;
  icon?: string;
  className?: string;
  buttonClassName?: string;
  optionClassName?: string;
  children?: React.ReactNode;
}) => {
  const [showOption, setShowOption] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowOption(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      {showOption && (
        <div
          className={cn(
            'absolute -top-[60px] flex h-[66px] rounded-md border-2 bg-white',
            optionClassName,
          )}
        >
          {children}
        </div>
      )}
      <PinButton
        pin={pin}
        onClick={() => {
          setShowOption(!showOption);
        }}
        className={className}
        buttonClassName={cn(
          buttonClassName,
          showOption && 'bg-gray-200',
          showOption && buttonClassName?.includes('bg-[#FF6B00]') && 'bg-[#FF6B00]',
          showOption && buttonClassName?.includes('bg-primary') && 'bg-primary',
        )}
        icon={icon}
      />
      <div
        className={cn(
          'absolute bottom-1/4 right-3 h-[5px] w-[5px] rounded-full bg-red-500',
          buttonClassName?.includes('bg-[#FF6B00]') && 'bg-violet-500',
        )}
      />
    </div>
  );
};
export default CWMLatexEditor;
