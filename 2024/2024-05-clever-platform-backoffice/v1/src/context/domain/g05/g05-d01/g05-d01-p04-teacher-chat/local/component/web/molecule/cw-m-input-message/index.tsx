import { FormEvent } from 'react';
import { BsSend } from 'react-icons/bs';

type InputMessageProps = {
  onSubmitMessage?: (content: string, form: HTMLFormElement) => void;
};
const InputMessage = ({ onSubmitMessage }: InputMessageProps) => {
  const handleSubmitMessage = (e: FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const content = formData.get('content')?.toString().trim();

    if (!content || content?.length === 0) return;
    onSubmitMessage?.(content, form);

    form.reset();
  };

  return (
    <div className="flex w-full items-center rounded-full border border-gray-300 bg-white">
      <form onSubmit={handleSubmitMessage} className="flex w-full items-center">
        <input
          name="content"
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent p-2 px-5 text-gray-700 placeholder-gray-400 outline-none"
        />
        <button
          type="submit"
          className="flex h-7 w-10 items-center justify-center text-black transition hover:text-blue-600"
        >
          <BsSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default InputMessage;
