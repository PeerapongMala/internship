

type ImageModalProps = {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
};

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl font-bold"
        >
          &times;
        </button>
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-full rounded-lg" />
      </div>
    </div>
  );
};

export default ImageModal;