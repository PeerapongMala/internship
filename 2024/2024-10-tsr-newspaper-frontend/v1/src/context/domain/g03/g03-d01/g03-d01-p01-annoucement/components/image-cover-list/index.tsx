import { FileWithPreview } from '../file-upload';

interface ImageCoverListProps {
  imageCoverList: FileWithPreview[];
  fileDragging: number | null;
  fileDropping: number | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave: () => void;
  onRemove: (index: number) => void;
}

const ImageCoverList: React.FC<ImageCoverListProps> = ({
  imageCoverList,
  fileDragging,
  fileDropping,
  onDragStart,
  onDragEnd,
  onDrop,
  onDragEnter,
  onDragLeave,
  onRemove,
}) => {
  return (
    <div className="flex gap-[11px] flex-wrap overflow-y-auto overflow-x-hidden max-h-[504px] p-2 pb-3 md:flex-nowrap md:h-[180px] md:overflow-x-auto md:overflow-y-hidden whitespace-nowrap mb-[84px]">
      {imageCoverList.map((fileData, index) => (
        <div
          key={fileData.id || index}
          className={`relative xl:w-[350px] xl:h-[160px] w-full h-[200px] flex flex-col items-center bg-[#D9A84E] border rounded cursor-move select-none ${
            fileDragging === index ? 'border-blue-600' : ''
          } ${fileDropping === index ? 'ring-2 ring-blue-400' : ''}`}
          draggable="true"
          onDragStart={(e) => onDragStart(e, index)}
          onDragEnd={onDragEnd}
          onDrop={(e) => onDrop(e, index)}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragLeave={onDragLeave}
        >
          <button
            className="absolute top-0 right-0 z-50 p-1 bg-black rounded-bl-lg focus:outline-none"
            type="button"
            onClick={() => onRemove(index)}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.4031 7.25586L7.01465 20.6443M7.01465 7.25586L20.4031 20.6443"
                stroke="white"
                strokeWidth="2.23141"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex-shrink-0 w-[450px] h-[250px] xl:w-[298px] ">
            <img
              className="absolute inset-0 z-0 object-cover w-full h-full  "
              src={
                fileData.image_url ||
                (fileData.file ? URL.createObjectURL(fileData.file) : '')
              }
              alt={`preview-${index}`}
            />
          </div>

          <div
            className={`absolute inset-0 z-40 transition-colors duration-300 ${
              fileDropping === index && fileDragging !== index
                ? 'bg-blue-200 bg-opacity-80'
                : ''
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageCoverList;
