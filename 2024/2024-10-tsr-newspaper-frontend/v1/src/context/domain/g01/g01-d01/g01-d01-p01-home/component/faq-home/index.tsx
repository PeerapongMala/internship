import { useEffect, useState } from 'react';
import Image from './faq-img.png';
import { Link } from 'react-router-dom';
import { GetFaq } from '../../../local/api/restapi/get-faq';

interface TopicListProps {
  topic: string;
  body: string;
  responsiveEvent: any; // Adjust type as needed
}

interface FaqProp {
  id?: number;
  displayorder?: number;
  question?: string;
  answer?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

interface Pagination {
  limit: number;
  page: number;
  total: number;
}

const TopicList: React.FC<TopicListProps> = ({ topic, body, responsiveEvent }) => {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState<string>('+');

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    open ? setSymbol('-') : setSymbol('+');
  }, [open]);

  return (
    <div
      className={`flex flex-row justify-start items-start p-4 border-b border-[#E2E2E2] space-x-2 ${
        responsiveEvent.mobileIs ? ' space-x-2' : 'md:space-x-4'
      }`}
    >
      <button
        className={`flex justify-center items-center bg-secondary text-white dark:text-black rounded-xl ${
          responsiveEvent.mobileIs
            ? 'w-8 h-8 text-lg p-3'
            : 'md:w-10 md:h-10 md:p-4 text-2xl'
        }`}
        onClick={handleOpen}
      >
        {symbol}
      </button>
      {/* Col */}
      <div
        className={`flex flex-col justify-start items-start ${
          responsiveEvent.mobileIs ? 'space-y-2' : 'md:space-y-4'
        }`}
      >
        <h1
          className={`${
            open ? 'text-secondary' : 'text-black dark:text-white'
          } ${responsiveEvent.mobileIs ? 'text-base' : 'text-lg md:text-xl'} font-bold`}
        >
          {topic}
        </h1>
        {open && (
          <ul>
            <li
              className={`text-[#504F4F] dark:text-white ${
                responsiveEvent.mobileIs ? 'text-sm' : 'md:text-base'
              } font-light`}
            >
              {body}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

interface FAQProps {
  responsiveEvent: any;
}

const FaqPage: React.FC<FAQProps> = ({ responsiveEvent }) => {
  const [faqData, setFaqData] = useState<FaqProp[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 3,
    page: 1,
    total: 0,
  });

  useEffect(() => {
    GetFaq(pagination.page, pagination.limit)
      .then((res) => {
        setFaqData(res.data);
        setPagination((prev) => ({
          ...prev,
          total: res.pagination.total,
        }));
      })
      .catch((err) => {
        console.error('Error fetching FAQ:', err);
      });
  }, [pagination.page]);

  return (
    <div className="flex flex-col items-center h-fit pb-20">
      <div
        className={`flex  ${
          responsiveEvent.mobileIs
            ? 'flex-col-reverse items-center px-6 w-full '
            : 'flex-row justify-center items-start w-full max-w-[1100px]'
        }`}
      >
        {/* FAQ Section */}
        <div
          className={`flex flex-col ${
            responsiveEvent.mobileIs ? 'space-y-4 px-4 w-full' : 'px-4 py-20 w-[700px]'
          }`}
        >
          <h2
            className={`text-text py-7 ${
              responsiveEvent.mobileIs ? 'text-[28px]' : 'text-[40px]'
            } font-semibold`}
          >
            คำถามที่พบบ่อย
          </h2>
          <div
            className={`flex flex-col ${
              responsiveEvent.mobileIs ? 'space-y-4 w-full pb-6' : 'space-y-4 md:w-[80%]'
            }`}
          >
            {faqData.map((faq) => (
              <TopicList
                key={faq.id}
                topic={faq.question || 'No question available'}
                body={faq.answer || 'No answer available'}
                responsiveEvent={responsiveEvent}
              />
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div
          className={`flex justify-center ${
            responsiveEvent.mobileIs ? '' : 'py-10'
          }`}
        >
          <div className="overflow-hidden">
            <img
              className={`${
                responsiveEvent.mobileIs ? 'w-full' : 'w-[456px] h-[443px]'
              } object-cover object-center`}
              src={Image}
              alt="FAQ Header"
            />
          </div>
        </div>
      </div>
      {/* Button for FAQ Section */}
      <div
        className={`flex flex-col items-end ${
          responsiveEvent.mobileIs ? ' w-full  px-10' : 'w-full max-w-[1100px] '
        }`}
      >
        <Link to="/faq">
          <button className="flex items-center justify-center w-[182px] h-[48px] px-[22px] rounded-md bg-[#D9A84E] text-white">
            เรียนรู้เพิ่มเติม
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              className="ml-2"
            >
              <path
                d="M5 12.5H19M19 12.5L15 16.5M19 12.5L15 8.5"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FaqPage;
