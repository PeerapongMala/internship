import Button from '@component/web/atom/wc-a-button';
import { cn } from '@global/helper/cn';
import { useState } from 'react';
import ImageIconBackspace from '@global/assets/icon-backspace.svg';

const WCMCalculator = () => {
  const [result, setResult] = useState('0');
  const [text, setText] = useState('');
  const [tempResult, setTempResult] = useState('');

  const handleClick = (value: any) => {
    switch (value) {
      case 'DEL':
        setResult((prev) => prev.slice(0, -1) || '0');
        setText((prev) => prev.slice(0, -1)); // Update text state
        break;

      case 'AC':
        setResult('0');
        setTempResult('');
        setText(''); // RESET text state
        break;

      case '=':
        try {
          const finalResult = eval(tempResult.replace('x', '*').replace(/[^-()\d/*+.]/g, ''));
          setResult(finalResult.toString());
          setTempResult(finalResult.toString());
          setText(''); // Clear text after showing the result
        } catch (error) {
          setResult('Error');
          setText(''); // Clear text on error
        }
        break;

      case '+':
      case '-':
      case '/':
      case 'x':
        if (tempResult && !isNaN(Number(tempResult[tempResult.length - 1]))) {
          setTempResult((prev) => prev + value);
          setResult(value);
          setText((prev) => prev + value); // Append operator to text
        }
        break;

      default:
        if (
          result === '0' ||
          result === '+' ||
          result === '-' ||
          result === '/' ||
          result === 'x'
        ) {
          setResult(value);
        } else {
          setResult((prev) => prev + value);
        }
        setTempResult((prev) => prev + value);
        setText((prev) => prev + value); // Append number to text
        break;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="border-2 border-secondary px-4 pt-1 rounded-full flex flex-col items-end">
        <span className="text-base font-semibold text-black/50">{text}&nbsp;</span>
        <span className="text-2xl font-semibold">{result}</span>
      </div>
      <div className="grid grid-cols-4 gap-x-2 gap-y-2 p-3 rounded-lg">
        <PinButton pin={'7'} onClick={handleClick} />
        <PinButton pin={'8'} onClick={handleClick} />
        <PinButton pin={'9'} onClick={handleClick} />
        <PinButton
          pin={'DEL'}
          onClick={handleClick}
          variant="warning"
          icon={ImageIconBackspace}
        />
        <PinButton pin={'4'} onClick={handleClick} />
        <PinButton pin={'5'} onClick={handleClick} />
        <PinButton pin={'6'} onClick={handleClick} />
        <PinButton pin={'+'} onClick={handleClick} />
        <PinButton pin={'1'} onClick={handleClick} />
        <PinButton pin={'2'} onClick={handleClick} />
        <PinButton pin={'3'} onClick={handleClick} />
        <PinButton pin={'-'} onClick={handleClick} />
        <PinButton pin={'.'} onClick={handleClick} />
        <PinButton pin={'0'} onClick={handleClick} />
        <PinButton pin={'/'} onClick={handleClick} />
        <PinButton pin={'x'} onClick={handleClick} />
        <PinButton
          pin={'AC'}
          onClick={handleClick}
          className="col-span-2"
          width="125px"
          variant="warning"
        />
        <PinButton
          pin={'='}
          onClick={handleClick}
          className="col-span-2"
          width="125px"
          variant="warning"
        />
      </div>
    </div>
  );
};

const PinButton = ({
  pin,
  onClick,
  variant,
  icon,
  className,
  width,
  height,
}: {
  pin: string;
  onClick: (pin: string) => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'white'
    | 'ghost';
  icon?: string;
  className?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <div className={cn('flex justify-center items-center h-16', className)}>
      <Button
        onClick={() => onClick(pin)}
        className=""
        size="circle"
        variant={variant}
        width={width ? width : '60px'}
        height={height ? height : '60px'}
      >
        <div className="flex justify-center items-center h-[30px]">
          {icon ? (
            <img src={ImageIconBackspace} alt="backspace" className="h-8 w-8" />
          ) : (
            <span className="text-2xl font-semibold text-white">{pin}</span>
          )}
        </div>
      </Button>
    </div>
  );
};

export default WCMCalculator;
