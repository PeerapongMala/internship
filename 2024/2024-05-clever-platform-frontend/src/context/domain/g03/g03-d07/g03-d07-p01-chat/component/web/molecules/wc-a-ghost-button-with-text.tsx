import IconButton from '../atoms/wc-a-icon-button';
import { TextNormal } from '../atoms/wc-a-text';

interface GhostButtonWithLabelProps {
  icon: string;
  text?: string;
  btnClass?: string;
  onClick?: () => void;
}

export function GhostButtonWithLabel({
  icon,
  text,
  btnClass,
  onClick,
}: GhostButtonWithLabelProps) {
  return (
    <div className="relative">
      {text && (
        <TextNormal
          className="absolute h-[32px] w-max bg-white bg-opacity-80 rounded-l-full px-3"
          style={{
            translate: 'calc(-100% + 0.5rem) 50%',
            boxShadow: '0px 4px 8px 0px rgba(255, 255, 255, 0.25)',
          }}
        >
          {text}
        </TextNormal>
      )}
      <IconButton
        // backgroundColor="rgba(255, 255, 255, 0.80)"
        // borderBottomColor="#DDDCDF"
        className={btnClass}
        variant="ghost"
        iconSrc={icon}
        onClick={onClick}
      />
    </div>
  );
}

export default GhostButtonWithLabel;
