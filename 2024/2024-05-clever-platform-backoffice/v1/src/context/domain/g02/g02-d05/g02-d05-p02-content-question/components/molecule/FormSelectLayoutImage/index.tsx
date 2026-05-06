const FormSelectLayoutImage = ({
  onChange,
  value,
  layoutOptions,
}: {
  onChange?: (layout: string) => void;
  value: string;
  layoutOptions: { id: string; imgSrc: string; title: string }[];
}) => {
  const handleSelectedLayoutRatio = (layout: string) => {
    if (onChange) onChange(layout);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        {layoutOptions.map((option) => (
          <div
            key={option.id}
            className="mb-5 flex items-center justify-center text-center"
          >
            <div
              className={`w-full max-w-[19rem] cursor-pointer rounded border bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none ${value === option.id ? 'border-2 border-primary' : 'border-white-light'} `}
              onClick={() => handleSelectedLayoutRatio(option.id)}
            >
              <div className="p-2">
                <div className="overflow-hidden rounded-tl rounded-tr">
                  <img src={option.imgSrc} alt="cover" className="w-full" />
                </div>
                <h5 className="mb-4 text-xl font-semibold text-[#3b3f5c] dark:text-white-light">
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
