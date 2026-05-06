import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import StoreGlobal from '@store/global/index';
import { GetBanners } from '@domain/g01/g01-d01/local/api/restapi/get-banners'; 
import img from '@asset/Ads/ads-2.png';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<Awaited<ReturnType<typeof GetBanners>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { responsiveEvent } = StoreGlobal.StateGet(['bannerIs', 'responsiveEvent']);

  useEffect(() => {
    const loadBanners = async () => {
      setIsLoading(true);
      try {
        const data = await GetBanners();
        setBanners(data);
      } catch (err: any) {
        setError(err.message ?? 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    loadBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  if (isLoading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center h-fit">
      <div
        className={responsiveEvent.mobileIs ? 'w-full px-5' : ' max-w-[700px] w-[75%]'}
      >
        {banners.length > 1 ? (
          <Slider {...settings}>
            {banners.map((banner, index) => (
              <img
                key={banner.id}
                className="rounded-2xl w-full object-center object-cover aspect-[1170/385]"
                src={banner.banner_image_url}
                alt={`Banner ${index + 1}`}
              />
            ))}
          </Slider>
        ) : (
          <div>
            <img
              className="rounded-2xl w-full object-center object-cover aspect-[1170/385]"
              src={banners.length === 0 ? img : banners[0].banner_image_url}
              alt="Banner"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
