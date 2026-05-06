import { cn } from '@global/helper/cn';
import { useState, useEffect, useRef } from 'react';
import ImageIconBackspace from '@global/assets/icon-backspace-black.svg';
import ImageIconShift from '@global/assets/icon-shift.png';
import Latex from 'react-latex-next';
import styles from './index.module.css';
import { useTranslation } from 'react-i18next';

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABETS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const SYMBOLS = '∞△>≥<≤+∠|-⦜^{}()×⊥∥π%.=≈≠÷';
const KEYBOARD_SUPPORT = ALPHABETS + SYMBOLS + ALPHABETS_LOWER;

const WCMLatexEditor = ({
  value,
  setValue,
}: {
  value?: string;
  setValue?: (value: string) => void;
}) => {
  const { t } = useTranslation(['global']);
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

  const textOk = t('ok');

  return (
    <div className="flex flex-col gap-2 w-full p-10">
      <div className="flex flex-col w-full">
        <div className="flex w-full h-full">
          <div className="w-full rounded-md rounded-b-none rounded-r-none p-1 border-2 border-secondary border-r-0">
            {text !== '$$' ? <Latex>{text}&nbsp;</Latex> : <>&nbsp;</>}
          </div>
          <div
            onClick={handleOk}
            className="flex !rounded-tr-xl !rounded-l-none h-full w-28 bg-primary/90 items-center justify-center select-none font-bold text-white text-xl cursor-pointer shadow-lg active:scale-90 hover:scale-110 transition-all duration-200 ease-in-out"
          >
            {textOk}
          </div>
        </div>

        <div className="w-full rounded-md rounded-t-none p-1 border-2 border-t-0 border-secondary katex">
          {renderTextWithCursor()}&nbsp;
        </div>
      </div>
      <div className="flex flex-col w-full">
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
              icon={ImageIconShift}
              className={cn(showAlphabets && 'col-span-3')}
              buttonClassName={cn(isShift && 'bg-gray-200')}
            />
          )}
          <PinButton pin={'AC'} onClick={handleClick} />
          <PinButton pin={'←'} onClick={handleClick} buttonClassName="text-4xl" />
          <PinButton pin={'→'} onClick={handleClick} buttonClassName="text-4xl" />
          <PinButton pin={'DEL'} onClick={handleClick} icon={ImageIconBackspace} />
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
        buttonClassName="bg-warning text-white"
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
        buttonClassName="bg-warning text-white"
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
        buttonClassName="bg-warning text-white"
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
        buttonClassName="bg-warning text-white"
      />
      <PinButtonHover
        pin={'='}
        buttonClassName="bg-warning text-white"
        optionClassName="bg-warning"
      >
        <PinButton
          pin={'='}
          onClick={handleClick}
          buttonClassName="border-none bg-warning text-white"
        />
        <PinButton
          pin={'≈'}
          onClick={handleClick}
          buttonClassName="border-none bg-warning text-white"
        />
        <PinButton
          pin={'≠'}
          onClick={handleClick}
          buttonClassName="border-none bg-warning text-white"
        />
      </PinButtonHover>
      <PinButton
        pin={'÷'}
        onClick={handleClick}
        buttonClassName="bg-warning text-white"
      />
    </>
  );
};

const PinButton = ({
  pin,
  onClick,
  icon,
  className,
  buttonClassName,
}: {
  pin: string;
  onClick: (pin: string) => void;
  icon?: string;
  className?: string;
  buttonClassName?: string;
}) => {
  const pinText =
    pin.includes('\\') || pin.includes('^') || pin.includes('|X|') ? `$${pin}$` : pin;
  return (
    <div className={cn('flex justify-start items-center h-16', className)}>
      <div
        onClick={() => onClick(pin)}
        className={cn(
          'flex rounded-md h-[55px] w-[66px] border-2 text-black items-center justify-center font-bold text-2xl cursor-pointer',
          'active:bg-gray-200',
          buttonClassName?.includes('bg-warning') && 'active:bg-warning-stroke',
          buttonClassName?.includes('bg-primary') && 'active:bg-primary-stroke',
          buttonClassName,
          '',
        )}
      >
        <div className="flex justify-center items-center h-[30px]">
          {icon ? (
            <img src={icon} alt="backspace" className="h-8 w-8" />
          ) : (
            <span className="select-none katex">
              <Latex>{pinText}</Latex>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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
            'absolute -top-[60px] flex bg-white rounded-md border-2 h-[66px]',
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
          showOption && buttonClassName?.includes('bg-warning') && 'bg-warning-stroke',
          showOption && buttonClassName?.includes('bg-primary') && 'bg-primary-stroke',
        )}
        icon={icon}
      />
      <div
        className={cn(
          'absolute w-[5px] h-[5px] rounded-full bg-red-500 right-3 bottom-1/4',
          buttonClassName?.includes('bg-warning') && 'bg-violet-500',
        )}
      />
    </div>
  );
};
export default WCMLatexEditor;
