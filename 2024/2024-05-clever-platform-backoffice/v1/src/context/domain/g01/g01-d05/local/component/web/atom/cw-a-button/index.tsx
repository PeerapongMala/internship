interface CWAButtonProps {
  children: string | React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CWAButton = function (props: CWAButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-primary flex gap-1 text-nowrap !font-normal ${props.className ?? ''}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default CWAButton;
