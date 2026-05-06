import { useEffect, useState } from 'react';
import { GetFaq } from '../../../local/api/restapi/get-faq';
import { FaqProp } from '../../../local/type';
interface Props {
  topic: string;
  body: string;
}

export default function TopicList({ topic, body }: Props) {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState<string>('+');

  function handleOpen() {
    setOpen(!open);
  }

  useEffect(() => {
    open ? setSymbol('-') : setSymbol('+');
    // console.log("Open state:", open);
    // console.log("Symbol:", symbol);
    // console.log("Topic Color:", topicColor);
  }, [open]);

  return (
    <div className="flex flex-row justify-start items-start p-4 border-b border-[#E2E2E2] space-x-2 md:space-x-4 w-full h-fit">
      <button
        className="flex justify-center items-center bg-secondary text-white dark:text-black rounded-xl p-4 w-8 h-8 text-lg md:text-2xl md:w-10 md:h-10 md:p-4"
        onClick={handleOpen}
      >
        {symbol}
      </button>
      {/* Col */}
      <div className="flex flex-col justify-start items-start space-y-2 md:space-y-4">
        <h1
          className={`${open ? 'text-secondary' : 'text-black dark:text-white'} text-lg md:text-xl font-bold`}
        >
          {topic}
        </h1>
        {open && (
          <ul>
            <li className="text-[#504F4F] dark:text-white text-sm md:text-base font-light">
              <p style={{ whiteSpace: 'pre-line' }}>{body.replace(/\\n/g, '\n')}</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
