

// Component to display CoverPages
import { CoverPage } from '@domain/g01/g01-d01/local/api/restapi/get-cover-page';
import { toDateTH } from '@global/helper/uh-date-time';
import { Link } from '@tanstack/react-router';


interface CoverPageProps {
  coverPages: CoverPage[];
  isMobile: boolean;
}

const ExampleNewspaper: React.FC<CoverPageProps> = ({ coverPages, isMobile }) => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const sortedCoverPages = coverPages
    .sort((a, b) => new Date(b.PublicDate).getTime() - new Date(a.PublicDate).getTime())
    .slice(0, isMobile ? 1 : 4);

  return (
    <div className="flex flex-col items-center">
      {/* Header Label */}
      <div
        className="h-[56px] bg-secondary rounded-t-2xl flex items-center justify-center"
        style={{ width: isMobile ? '260px' : '263px' }}
      >
        <div
          className={`text-white font-bold ${isMobile ? 'text-[16px]' : 'text-[24px]'} leading-normal tracking-[0.24px]`}
        >
          หนังสือพิมพ์ 4 วันล่าสุด

        </div>
      </div>

      {/* Cover Pages */}
      <div className={`flex ${isMobile ? 'rounded-b-2xl' : 'rounded-2xl'} overflow-hidden`}>
        {sortedCoverPages.map((item, index) => (
          <div
            key={index}
            className={`relative ${isMobile ? 'w-[260px]' : 'w-[219px]'} h-[168px] bg-gray-200 border-2 border-[#EDEDED] flex items-center justify-center`}
            style={{
              boxShadow: 'inset 0px -25px 10px -13px rgba(50, 50, 50, 0.4)',
            }}
          >
            <Link to={"/download"} className='absolute w-full h-full object-cover'>

              <img
                src={`${BACKEND_URL}/${item.PreviewURL}`}
                alt={`Cover page ${index + 1}`}
                className="absolute w-full h-full object-cover"
              />
            </Link>

            <p className="flex justify-center items-center absolute  bottom-0 text-[#504F4F] font-[Anuphan] text-[20px] font-semibold leading-normal tracking-[0.24px] text-shadow-sm bg-gradient-to-b from-transparent to-black/30 w-full h-10">
              {toDateTH(item.PublicDate)}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ExampleNewspaper;
