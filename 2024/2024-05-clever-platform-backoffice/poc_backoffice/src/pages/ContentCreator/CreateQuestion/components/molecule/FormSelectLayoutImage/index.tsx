const FormSelectLayoutImage = ({ onChange, value, layoutOptions }: {
    onChange?: (layout: string) => void
    value: string
    layoutOptions: { id: string, imgSrc: string, title: string }[]
}) => {

    const handleSelectedLayoutRatio = (layout: string) => {
        if (onChange) onChange(layout);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-6">
                {layoutOptions.map((option) => (
                    <div key={option.id} className="mb-5 flex items-center justify-center text-center">
                        <div
                            className={`max-w-[19rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border cursor-pointer
                                dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none
                                ${value === option.id ? 'border-primary border-2' : 'border-white-light'}
                            `}
                            onClick={() => handleSelectedLayoutRatio(option.id)}
                        >
                            <div className="p-2">
                                <div className="rounded-tl rounded-tr overflow-hidden">
                                    <img src={option.imgSrc} alt="cover" className="w-full" />
                                </div>
                                <h5 className="text-[#3b3f5c] text-xl font-semibold mb-4 dark:text-white-light">
                                    {option.title}
                                </h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormSelectLayoutImage;
