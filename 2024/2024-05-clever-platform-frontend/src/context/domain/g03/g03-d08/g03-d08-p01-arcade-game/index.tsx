import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import Button from '@global/component/web/atom/wc-a-button';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import ModalOffLineWarning from '@global/component/web/molecule/wc-m-modal-offline-warning';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from './api';
import Coin from './assets/coin-arcade.svg';
import Dialog from './component/web/atom/wc-a-dialog';
import ConfigJson from './config/index.json';
import { MinigameList } from './type';

interface DomainPathParams {
  gameid: number;
  gamename: string;
  gameimage: string;
  gameprice: number;
}
interface Prop {
  id: any;
  image: any;
  title: any;
  coins: number;
  onClick: () => void;
}

const SubjectSlot = ({ id, image, title, coins, onClick }: Prop) => {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex pb-5">
      <Dialog>
        {/* Image */}
        <img src={image} alt={title} className="w-full h-80 rounded-t-3xl object-cover" />
        {/* Title and Coin Section */}
        <div>
          <h3 className="font-bold text-3xl text-gray-900 text-start pb-1">{title}</h3>
          <Button
            className="w-full"
            prefix={<img src={Coin} alt="Icon" className="w-10 h-10" />}
            onClick={onClick}
          >
            {coins}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [minigames, setMinigames] = useState<MinigameList[]>([]);
  const { gameid, gamename, gameimage, gameprice } = useParams({
    strict: false,
  }) as DomainPathParams;
  const navigate = useNavigate();
  const router = useRouter();

  // online status
  const [showModalOfflineWarning, setShowModalOfflineWarning] = useState(false);
  const isOnline = useOnlineStatus();

  const { initializedIs } = StoreGlobal.StateGet(['initializedIs']);
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  const handleClickBack = () => {
    if (initializedIs) {
      router.history.back();
    } else {
      navigate({ to: '/', viewTransition: true });
    }
  };

  const GotoMainmenu = () => {
    navigate({ to: '/main-menu', viewTransition: true });
  };

  useEffect(() => {
    const fetchMinigames = async () => {
      try {
        const res = await API.MinigameList.Minigame.Get();
        const response: any = res;

        if (response.status_code === 200 && Array.isArray(response.data)) {
          setMinigames(response.data);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMinigames();
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(0);
  }, [gameid, gamename, gameimage, gameprice]);

  const handleSubjectClick = (id: number, title: string, coin: number) => {
    console.log(`Game name is ${title}, Index ${id} clicked , Price is ${coin}`);
    // Check if the user is online before navigating
    if (isOnline) {
      navigate({
        to: `/arcade-leaderboard/${id}`,
        viewTransition: true,
      });
    } else {
      // if the user is offline, show the offline warning modal
      setShowModalOfflineWarning(true);
    }
  };

  const handleRetryOffline = () => {
    StoreGlobal.MethodGet().loadingSet(true);
    new Promise((resolve) => {
      // wait for a sec for given a feedback
      // that we are retrying to connect
      setTimeout(
        () => {
          // if the user back to online, hide the offline warning modal
          if (isOnline) setShowModalOfflineWarning(false);
          resolve(true);
        },
        500 + (-250 + Math.random() * 500),
      );
    }).finally(() => {
      StoreGlobal.MethodGet().loadingSet(false);
    });
  };

  const TitleboxStyle: React.CSSProperties = {
    width: `${569 * 2}px`,
    position: 'absolute',
    left: '50%',
    top: `${21 * 2}px`,
    transform: 'translate(-50%, 0%)',
    display: 'flex',
    gap: '8px',
  };

  const SubjectSelectBoxStyle: React.CSSProperties = {
    width: '100%',
    top: `${75 * 2}px`,
    left: '50%',
    transform: 'translate(-50%, 0%)',
    alignItems: 'center',
    gap: '16px',
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1200, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1 ">
      {/* Safezone */}
      <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0">
        {/* Title Content */}
        <div
          className="flex inset-0 bg-cover bg-center justify-center"
          style={TitleboxStyle}
        >
          <span
            className="noto-sans-thai1200"
            style={{
              color: '#333',
              fontSize: '52px',
              fontWeight: 600,
              lineHeight: 'normal',
            }}
          >
            {t('game_mode')}
          </span>
        </div>
        <ButtonBack
          className="absolute left-10 top-10 w-[64px] h-[64px]"
          onClick={GotoMainmenu}
        />
        {/* Subject Selection Cards */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={SubjectSelectBoxStyle}
        >
          <Carousel responsive={responsive} arrows={false}>
            {minigames.map((game) => (
              <SubjectSlot
                key={game.id}
                id={game.id}
                image={game.image_url}
                title={game.name}
                coins={game.arcade_coin_cost}
                onClick={() =>
                  handleSubjectClick(game.id, game.name, game.arcade_coin_cost)
                }
              />
            ))}
          </Carousel>
        </div>
        <ModalOffLineWarning
          overlay={true}
          isVisible={showModalOfflineWarning}
          setVisible={setShowModalOfflineWarning}
          onOk={handleRetryOffline}
          enablePlayOffline={false}
        />
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
