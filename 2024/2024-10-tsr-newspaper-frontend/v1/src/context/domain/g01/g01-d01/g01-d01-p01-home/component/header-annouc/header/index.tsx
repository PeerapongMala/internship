import { useState, useEffect } from 'react';

import { GetHeader, HeaderData } from '../../../../local/api/restapi/get-header';

export const useHeaders = () => {
  const [banners, setBanners] = useState<HeaderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    GetHeader()
      .then(setBanners)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { banners, isLoading, error };
};

interface BannerProps {
  dataBanners: HeaderData[];
  isMobile: boolean;
}

const Banner: React.FC<BannerProps> = ({ dataBanners, isMobile }) => {
  const { banners, isLoading, error } = useHeaders();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (dataBanners?.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [dataBanners]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? (dataBanners?.length || 1) - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (dataBanners?.length || 1));
  };

  return (
    <div className="relative w-full h-fit" data-carousel="slide">
      <div
        className={`relative overflow-hidden max-h-[600px] w-full aspect-[671/632] lg:aspect-[1440/632] rounded-lg`}
      >
        {dataBanners.map((data, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            data-carousel-item
          >
            <img
              src={data.cover_image_url}
              className={`absolute inset-0 w-full h-full object-center object-cover`}
              alt={`Banner ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Slider Controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToPrevious}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
// แยก desktop / mobile
//

// interface CoverPageData {
//   src: string;
//   date: Date;
//   label: string;
// }

// interface CoverPageProps {
//   coverPages: CoverPageData[];
//   isMobile: boolean;
// }

// const CoverPage: React.FC<CoverPageProps> = ({ coverPages, isMobile }) => {
//   const sortedCoverPages = coverPages
//     .sort((a, b) => b.date.getTime() - a.date.getTime())
//     .slice(0, isMobile ? 1 : 4);

//   return (
//     <div className="flex flex-col items-center">
//       {/* Header Label */}
//       {isMobile ? (
//         // Mobile View
//         <>
//           <div className="w-[260px] h-[56px] bg-secondary rounded-t-2xl flex items-center justify-center">
//             <div className="text-white font-bold text-[16px] leading-normal tracking-[0.24px]">
//               หนังสือพิมพ์ล่าสุด
//             </div>
//           </div>
//           <div className="flex rounded-b-2xl overflow-hidden">
//             {sortedCoverPages.map((cover, index) => (
//               <div
//                 key={index}
//                 className="relative w-[260px] h-[168px] bg-gray-200 border-2 border-[#EDEDED] flex items-center justify-center"
//                 style={{
//                   backgroundImage: url(${cover.src}),
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   boxShadow: 'inset 0px -25px 10px -13px rgba(50, 50, 50, 0.4)',
//                 }}
//               >
//                 <p className="absolute bottom-1 text-[#504F4F] font-[Anuphan] text-[24px] font-semibold leading-normal tracking-[0.24px]">
//                   {cover.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         // Desktop View
//         <>
//           <div className="w-[263px] h-[56px] bg-secondary rounded-t-2xl flex items-center justify-center">
//             <div className="text-white font-bold text-[24px] leading-normal tracking-[0.24px]">
//               หนังสือพิมพ์ล่าสุด
//             </div>
//           </div>
//           <div className="flex rounded-2xl overflow-hidden">
//             {sortedCoverPages.map((cover, index) => (
//               <div
//                 key={index}
//                 className="relative w-[219px] h-[168px] bg-gray-200 border-2 border-[#EDEDED] flex items-center justify-center"
//                 style={{
//                   backgroundImage: url(${cover.src}),
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   boxShadow: 'inset 0px -25px 10px -13px rgba(50, 50, 50, 0.4)',
//                 }}
//               >
//                 <p className="absolute bottom-1 text-[#504F4F] font-[Anuphan] text-[24px] font-semibold leading-normal tracking-[0.24px]">
//                   {cover.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CoverPage;
