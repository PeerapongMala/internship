import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import BannerPC1 from '@asset/banner-pc-1.png';
import BannerPC2 from '@asset/banner-pc-2.png';
import StoreGlobal from '@store/global/index';
import Stick from 'react-slick';

const CWOBanner = () => {
  const { bannerIs, responsiveEvent } = StoreGlobal.StateGet([
    'bannerIs',
    'responsiveEvent',
  ]);

  //เชื่อม banner นี้ กับระบบจัดการแอดมิน
  const banners = [BannerPC1, BannerPC2]; 

  const stickSettings = {
    dots: true,
    infinite: banners.length > 1,  
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };


  if (!bannerIs) {
    return null;
  }

  if (responsiveEvent.mobileIs) {
    return (
      <Stick {...stickSettings}>
      {banners.map((banner, index) => (
        <div key={index} className="relative w-full h-screen overflow-hidden">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={banner}
            alt={`Banner ${index + 1}`}
          />
        </div>
      ))}
    </Stick>
    );
  }

  return (
    <Stick {...stickSettings}>
    {banners.map((banner, index) => (
      <div key={index} className="w-full max-h-screen ">
        <img
          className="w-full h-full"
          src={banner}
          alt={`Banner ${index + 1}`}
        />
      </div>
    ))}
  </Stick>

  );
};

export default CWOBanner;
