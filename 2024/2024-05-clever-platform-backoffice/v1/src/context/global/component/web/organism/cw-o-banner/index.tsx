import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import BannerBritaniaMobile1 from '@asset/banner-britania-mobile-1.jpg';
import BannerBritaniaMobile2 from '@asset/banner-britania-mobile-2.jpg';
import BannerBritaniaMobile3 from '@asset/banner-britania-mobile-3.jpg';
import BannerBritaniaPC1 from '@asset/banner-britania-pc-1.jpg';
import BannerBritaniaPC2 from '@asset/banner-britania-pc-2.jpg';
import BannerBritaniaPC3 from '@asset/banner-britania-pc-3.jpg';
import StoreGlobal from '@store/global/index.ts';
import Stick from 'react-slick';

const CWOBanner = () => {
  const { bannerIs, responsiveEvent } = StoreGlobal.StateGet([
    'bannerIs',
    'responsiveEvent',
  ]);

  const stickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!bannerIs) {
    return <></>;
  }

  if (responsiveEvent.mobileIs) {
    return (
      <Stick {...stickSettings}>
        <img src={BannerBritaniaMobile1} alt="Banner Britania 1" />
        <img src={BannerBritaniaMobile2} alt="Banner Britania 2" />
        <img src={BannerBritaniaMobile3} alt="Banner Britania 3" />
      </Stick>
    );
  }

  return (
    <Stick {...stickSettings}>
      <img src={BannerBritaniaPC1} alt="Banner Britania 1" />
      <img src={BannerBritaniaPC2} alt="Banner Britania 2" />
      <img src={BannerBritaniaPC3} alt="Banner Britania 3" />
    </Stick>
  );
  //   <>
  //     <img className="my-auto" src={BannerBritania1} alt="Banner Britania 1" />
  //   </>;
};

export default CWOBanner;
