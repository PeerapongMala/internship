


type CWColorPickerProps = {
    title: string;
    colorType: string;
    selectedColor: string;
    colorShade: string[]
    onSelect: (colorType: string, colorValue: string) => void;
    onReset?: (colorType: string) => void;
};

const CWColorPicker = ({
    title,
    colorType,
    selectedColor,
    colorShade,
    onSelect,
    onReset }: CWColorPickerProps) => {
    return (
        <div className="flex gap-5 justify-between items-center w-[500px]">
            <h4 className="text-sm font-medium mt-1.5">{title}</h4>
            <div className="flex gap-5 ml-5">
                {colorShade.map((color) => (
                    <div className="mt-3">
                        <button
                            key={`${colorType}-${color}`}
                            type="button"
                            className={`size-7 rounded-md border-2 ${selectedColor === color ? 'border-primary' : 'border-2 border-neutral-300'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => onSelect(colorType, color)}
                            aria-label={`Select ${color}`}
                        />
                    </div>
                ))}
                {onReset && (
                    <button
                        type="button"
                        onClick={() => onReset && onReset(colorType)}
                        className="text-sm text-gray-500 hover:text-primary underline"
                        aria-label={`Reset ${title}`}
                    >
                        รีเซ็ต
                    </button>
                )}
            </div>

        </div>
    );
};

export default CWColorPicker;