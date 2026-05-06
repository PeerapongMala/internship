import Image from '../image/faq.png';
import PaginationRow from '../paginationrow/index';
import TopicList from '../topiclist/index';
import { GetFaq } from '../../../local/api/restapi/get-faq'
import { FaqProp, Pagination } from '../../../local/type';
import { useState, useEffect } from 'react';

type Props = {};

function FaqPage({ }: Props) {
  const [faqData, setFaqData] = useState<FaqProp[]>([]);

  const [pagination, setPagination] = useState<Pagination>({
    limit: 5,
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
        console.error('Error fetching Faq:', err);
      });
  }, [pagination.page]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="flex flex-col bg-white dark:bg-dark justify-start items-center space-y-4 w-full min-h-screen pb-4">
      {/* Image */}
      <div className="w-full flex justify-center">
        <div className="w-full h-64 md:h-auto overflow-hidden md:overflow-visible">
          <img
            className="w-full h-full md:h-auto object-cover md:object-contain object-center"
            src={Image}
            alt="FAQ Header"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between items-center w-full space-y-4 py-20 px-10">
        {/* TopicList Row */}
        <div className="flex flex-col justify-center items-center space-y-4 h-fit md:w-[80%] w-full">
          {faqData.length > 0 ? (
            faqData.map((faq, index) => (
              <TopicList key={index} topic={faq.question!} body={faq.answer!} />
            ))
          ) : (
            <div className="text-center text-gray-500">ไม่มีข้อมูลเพื่อแสดง</div>
          )}
        </div>
      </div>
      <PaginationRow
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

    </div>
  );
}

export default FaqPage;
