import { FaqItem } from '../faq-page';

interface FaqListProps {
  qaList: FaqItem[];
  onDelete: (id: number) => void;
  onAdd: () => void;
  onSave: () => void;
}

const FaqList: React.FC<FaqListProps> = ({ qaList, onDelete, onAdd, onSave }) => {
  return (
    <div className="">
      <div className="flex flex-col mb-[28px] ">
        <p className="font-semibold text-[28px] leading-[28px] text-[#101828] dark:text-white">
          คำถามที่พบบ่อย
        </p>
      </div>
      <div className="flex  text-base font-medium leading-4 dark:text-[#D7D7D7] mb-10 md:mb-14">
        <div>
          สามารถสร้างคำถามและคำตอบได้ในหน้านี้
          <span className="text-red-600">*</span>
        </div>
      </div>
      <div className="flex flex-col gap-y-[25px] h-full max-h-[742px] overflow-y-scroll pr-5">
        <div className="border border-dashed border-black dark:border-[#D7D7D7] rounded-xl w-full min-h-[166px] flex flex-col items-center justify-center">
          <button
            onClick={onAdd}
            className="border border-dashed border-black dark:border-[#D7D7D7] rounded-xl w-full min-h-[166px] flex flex-col items-center justify-center"
          >
            <div className="flex justify-center">
              <div className="dark:hidden">
                <svg
                  width="64"
                  height="57"
                  viewBox="0 0 64 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.3169 19.2202L32.3169 37.8869"
                    stroke="#A3A3A3"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                  <path
                    d="M42.8579 28.5537L21.7756 28.5537"
                    stroke="#A3A3A3"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div className="hidden dark:block">
                <svg
                  width="64"
                  height="57"
                  viewBox="0 0 64 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32.3169 19.2202L32.3169 37.8869"
                    stroke="#D7D7D7"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                  <path
                    d="M42.8579 28.5537L21.7756 28.5537"
                    stroke="#D7D7D7"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="text-[#A3A3A3] font-medium text-xl leading-4 dark:text-[#D7D7D7]">
              เพิ่มคำถาม
            </div>
          </button>
        </div>

        {qaList.map(({ answer, question, id }) => {
          return (
            <div
              key={id}
              className="p-[10px] border border-[#9096A2] rounded-xl w-full h-fit flex items-start justify-between"
            >
              <div className=" flex flex-col md:ml-[62px] w-full py-[17px] md:py-0">
                <div className="flex justify-between">
                  <p className="font-semibold text-base leading-8 md:text-2xl md:leading-[54px] text-[#D9A84E] w-[200px] md:w-full  break-words">
                    {question}
                  </p>
                  <button
                    className="rounded-md bg-white border border-transparent text-center hover:border-[#0000001A] text-sm text-black transition-all shadow-md w-[24px] h-[24px]"
                    type="button"
                    onClick={() => onDelete(id)}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.4031 7.25586L7.01465 20.6443M7.01465 7.25586L20.4031 20.6443"
                          stroke="#000000"
                          strokeWidth="2.23141"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
                <p
                  style={{ whiteSpace: 'pre-line' }}
                  className="text-[#504F4F] font-normal text-sm leading-8 md:text-base md:leading-[54px] dark:text-[#D7D7D7] max-w-[329px] md:max-w-[514px] break-words"
                >
                  {answer.replace(/\\n/g, '\n')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqList;
