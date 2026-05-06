import { cn } from '@global/helper/cn';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import styles from './index.module.css';

// million-ignore
const TextWithStroke = ({
  text,
  className,
  strokeColor = '',
  strokeSize = '',
  strokeClassName = 'text-stroke-primary',
  textClassName = '',
  backgroundClassName = '',
}: {
  text: string;
  className?: string;
  strokeColor?: string;
  strokeSize?: string;
  strokeClassName?:
    | 'text-stroke-primary'
    | 'text-stroke-secondary'
    | 'text-stroke-tertiary'
    | 'text-stroke-success'
    | 'text-stroke-warning'
    | 'text-stroke-danger';
  textClassName?: string;
  backgroundClassName?: string;
}) => {
  const style = {
    WebkitTextStroke: `${strokeSize} ${strokeColor}`,
  };
  const [isSupport, setIsSupport] = useState<boolean>(false);

  useEffect(() => {
    setIsSupport(!isBrowserSupportedTextStroke());
  }, []);

  return (
    <div className={`${className}`}>
      <p
        className={cn(
          'absolute',
          !isSupport ? `text-shadow ${styles[strokeClassName]}` : '',
          textClassName,
        )}
        style={strokeSize && strokeColor ? style : {}}
      >
        {text}
      </p>
      <p className={cn(`absolute ${backgroundClassName}`)}>{text}</p>
    </div>
  );
};

function isBrowserSupportedTextStroke() {
  const parser = new UAParser();
  const browser = parser.getBrowser();
  const device = parser.getDevice();
  const os = parser.getOS();

  if (device.type === 'mobile' || device.type === 'tablet') {
    return false;
  }
  return true;
}

export default TextWithStroke;
