import StoreGlobal from '@global/store/global';
import { useEffect,useState } from 'react';
import Announce from '@domain/g01/g01-d01/g01-d01-p01-home/component/header-annouc/index';
import BannerAds from './component/banner-ads';
import MethodOfUse from './component/howto';
import Guide from './component/guide';
import AnnouncementGuidelines from './component/annoucement-guildlines';
import FAQ from './component/faq-home';
import { getPrice  } from '@global/api/restapi/uh-get-price';
interface Price {
  price_per_page: number;
}
const DomainJSX = () => {

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { responsiveEvent, banners } = StoreGlobal.StateGet([
    'responsiveEvent',
    'bannerIs',
  ]);

    const [priceData, setPriceData] = useState<Price>({
      price_per_page: 0,
    });
    useEffect(() => {
      getPrice ()
        .then((res) => {
          setPriceData(res.data);
        })
        .catch((error) => {
          console.log(`Cant not Fetching ${error}`);
        });
    }, []);

  return (
    <div className="relative bg-background dark:bg-dark flex flex-col gap-[96px]">
      <div
        className={`h-full flex flex-col ${
          responsiveEvent.mobileIs ? 'gap-10' : 'gap-[96px]'
        }`}
      >
        <Announce />

        <div
          className={`flex flex-col ${
            responsiveEvent.mobileIs ? '' : 'inline'
          } text-text ${responsiveEvent.mobileIs ? 'text-[34px]' : 'text-[40px]'} font-bold leading-[75.933px] text-center py-[53px]`}
        >
          ลงประกาศหนังสือพิมพ์
          <span className="text-secondary">เริ่มต้นเพียง {priceData.price_per_page} บาท/ประกาศ
          </span>
        </div>
        <BannerAds />
        <MethodOfUse responsiveEvent={responsiveEvent} />
        <Guide responsiveEvent={responsiveEvent} />
        <AnnouncementGuidelines responsiveEvent={responsiveEvent} />
        <FAQ responsiveEvent={responsiveEvent} />
      </div>
    </div>
  );
};

export default DomainJSX;
