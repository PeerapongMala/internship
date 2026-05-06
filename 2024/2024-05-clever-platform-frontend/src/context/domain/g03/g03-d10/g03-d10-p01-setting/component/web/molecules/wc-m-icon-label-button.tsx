import Button from '@global/component/web/atom/wc-a-button';

export default function IconLabelButton({
  iconSrc,
  width,
  height,
  labelText,
  seperatorClass = 'bg-blue-700',
  variant,
}: {
  iconSrc: string;
  labelText: string;
  width: string;
  height: string;
  seperatorClass: string;
  variant?:
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'white'
    | 'ghost'
    | undefined;
}) {
  return (
    <Button width={width} height={height} style={undefined} variant={variant}>
      <div className="flex justify-start items-center w-full h-full px-3">
        <img
          title="image"
          src={iconSrc}
          className="p-2 select-none pointer-events-none"
        />
        <div className={`w-1 h-full ${seperatorClass}`}></div>
        <span className="font-bold text-white ms-2">{labelText}</span>
      </div>
    </Button>
  );
}
