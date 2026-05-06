import { useState, useEffect } from 'react';
import Banner from './header';
import ExampleNewspaper from './coverpagelist';
import { useHeaders } from './header';
import { getCoverPages } from '../../../local/api/restapi/get-cover-page';

const Announce = () => {
  const today = new Date();
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(today.getDate() - 4); // ย้อนหลัง 4 วัน

  const start_date = `${fourDaysAgo.getFullYear()}-${String(fourDaysAgo.getMonth() + 1).padStart(2, '0')}-${String(fourDaysAgo.getDate()).padStart(2, '0')}`;
  const end_date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const {
    coverPages,
    isLoading: isCoverPagesLoading,
    error: coverPagesError,
  } = getCoverPages({
    start_date,
    end_date,
  });

  const { banners, isLoading: isBannersLoading, error: bannersError } = useHeaders();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // if (isBannersLoading || isCoverPagesLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (bannersError || coverPagesError) {
  //   return <div>Error: {bannersError || coverPagesError}</div>;
  // }

  return (
    <div className={`relative ${isMobile ? 'pb-[175px]' : 'pb-[142px]'}`}>
      <Banner dataBanners={banners} isMobile={isMobile} />
      <div
        className={`absolute bottom-0 ${
          isMobile ? 'z-10 ' : 'z-10 '
        } left-1/2 transform -translate-x-1/2`}
      >
        <ExampleNewspaper coverPages={coverPages} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Announce;
