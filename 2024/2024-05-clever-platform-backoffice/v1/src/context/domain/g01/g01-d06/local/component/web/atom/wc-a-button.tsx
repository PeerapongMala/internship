interface ButtonProps {
  children: string | React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = function (props: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-primary flex gap-1 text-nowrap !font-normal !shadow-none ${props.className ?? ''}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
