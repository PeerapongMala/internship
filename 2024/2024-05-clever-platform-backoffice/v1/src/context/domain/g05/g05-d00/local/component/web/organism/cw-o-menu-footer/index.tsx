import { ReactElement } from 'react';
import { RiPieChartLine } from 'react-icons/ri';
import { BiVolume } from 'react-icons/bi';
import { FiBook, FiBarChart2 } from 'react-icons/fi';
import { CiSettings } from 'react-icons/ci';
import { MdErrorOutline } from 'react-icons/md';

type TIcon = {
  id: number;
  icon: ReactElement;
};

const MenuFooter = () => {
  const icons: TIcon[] = [
    { id: 1, icon: <RiPieChartLine /> },
    { id: 2, icon: <BiVolume /> },
    { id: 3, icon: <FiBook /> },
    { id: 4, icon: <FiBarChart2 /> },
    { id: 5, icon: <CiSettings /> },
    { id: 6, icon: <MdErrorOutline /> },
  ];

  return (
    <>
      <div className="h-[76px]"></div>
      <div className="fixed bottom-0 left-0 h-[76px] w-full bg-white shadow-md">
        <div className="mx-auto h-full w-full min-[360px]:w-[360px] min-[400px]:w-[400px] min-[500px]:w-[500px] min-[600px]:w-[600px] min-[700px]:w-[700px] min-[800px]:w-[800px] min-[864px]:w-[864px] min-[900px]:w-[900px] min-[1000px]:w-[1000px] min-[1100px]:w-[1100px] min-[1200px]:w-[1200px] min-[1300px]:w-[1300px] min-[1400px]:w-[1400px] min-[1536px]:w-[1536px] min-[1600px]:w-[1600px] min-[1700px]:w-[1700px] min-[1800px]:w-[1800px] min-[1946px]:w-[1946px]">
          <div className="flex h-full justify-between gap-x-[5px] px-[5px]">
            {icons.map((item) => (
              <div
                key={item.id}
                className="flex h-full flex-1 items-center justify-center"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-gray-100 min-[360px]:px-2 min-[400px]:px-3 min-[500px]:px-4 min-[600px]:px-5 min-[700px]:px-6 min-[800px]:px-8 min-[864px]:px-10 min-[1000px]:px-12 min-[1200px]:px-16 min-[1400px]:px-20 min-[1536px]:px-24">
                  <div className="text-Color-600 flex h-6 w-6 items-center justify-center">
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuFooter;
