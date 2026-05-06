import { useTranslation } from 'react-i18next';

import ImageArrowGlyphRight from '@global/assets/arrow-glyph-right.svg';
import ImageIconCart from '@global/assets/icon-cart.svg';
import Button from '@global/component/web/atom/wc-a-button';
import StoreGame from '@global/store/game';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';
import ShopMenuHead from './wc-a-shop-menu-head';
import { useNavigate } from '@tanstack/react-router';

interface ShopMenuBodyEmptyProps {
  titleMenu: string;
  coin: string;
  coinArcade: string;
}

const ShopMenuBodyEmpty = ({ titleMenu, coin, coinArcade }: ShopMenuBodyEmptyProps) => {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const navigate = useNavigate();

  console.log('ShopMenuBodyEmpty props:', { titleMenu, coin, coinArcade });

  let title = '';
  let description = '';
  let action = '';
  let image = '';

  switch (stateFlow) {
    case STATEFLOW.Pet:
      title = t('no_pet');
      description = t('do_mission_to_get_pet');
      action = t('go_to_shop');
      image = ImageIconCart;
      break;
    case STATEFLOW.Honer:
      title = t('no_honer');
      description = t('do_mission_to_get_honer');
      action = t('do_mission');
      image = ImageArrowGlyphRight;
      break;
    case STATEFLOW.Frame:
      title = t('no_frame');
      description = t('do_mission_to_get_frame');
      action = t('go_to_shop');
      image = ImageIconCart;
      break;
    case STATEFLOW.Gift:
      title = t('no_gift');
      description = t('do_mission_to_get_gift');
      action = t('do_mission');
      image = ImageArrowGlyphRight;
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col w-full bg-secondary/10 bg-opacity-10 rounded-br-[60px] rounded-tr-[60px]">
      <div className=" w-full h-[85px] bg-white rounded-tr-[60px] bg-opacity-90 z-50">
        {/* Force render without conditions */}
        <ShopMenuHead
          title={titleMenu || 'Default Title'}
          coin={coin || '0'}
          coinArcade={coinArcade || '0'}
        />
      </div>

      <div className="flex flex-col flex-grow justify-center items-center p-4 gap-4 z-10 ">
        {title && (
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-3xl font-semibold">{title}</div>
            <div className="text-2xl mb-10">{description}</div>
            <Button
              onClick={() => {
                // Decide where to redirect based on stateFlow
                switch (stateFlow) {
                  case STATEFLOW.Pet:
                  case STATEFLOW.Frame:
                    navigate({ to: '/shop', viewTransition: true });
                    break;
                  case STATEFLOW.Honer:
                  case STATEFLOW.Gift:
                    navigate({ to: '/main-menu', viewTransition: true });
                    break;
                }
              }}
              height="4rem"
              width="22rem"
              variant="success"
              textClassName="text-[1.5rem] justify-center items-center"
              suffix={<img src={image} className="w-14 pr-2" />}
            >
              {action}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopMenuBodyEmpty;
