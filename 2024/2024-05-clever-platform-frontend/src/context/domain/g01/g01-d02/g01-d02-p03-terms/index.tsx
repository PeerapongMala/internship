import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import TermsAndConditions from '@component/web/molecule/wc-m-termcondition-modal';
import { toDateTimeTH } from '@global/helper/date';
import StoreGame from '@global/store/game';
import StoreLoadingScene from '@store/web/loading-scene';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleSpinner } from 'react-spinners-kit';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from '../local/api';
import ImageBGLogin from './assets/background-login.jpg';
import ConfigJson from './config/index.json';
import './index.css';

enum StateFlow {
  Language = 0,
  FullScreen = 1,
  AcceptanceInfo = 2,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const [tosData, setTosData] = useState<TermOfService>();

  const { loadingIs, progress } = StoreLoadingScene.StateGet(['loadingIs', 'progress']);

  const currentLanguage = i18n.language as 'th' | 'en' | 'zh';

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(0);
    // init loading scene
    StoreLoadingScene.MethodGet().loadingSceneInit();
    StoreLoadingScene.MethodGet().loadingSceneSet({
      // characterData: 'A', // note: uncomment this line to show character
    });
  }, []);

  useEffect(() => {
    async function init() {
      const isTosAccepted = await API.Terms.CheckAcceptance()
        .then((res) => {
          if (res.status_code === 200) {
            return res.data;
          }
          return false;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });

      if (isTosAccepted) {
        StoreLoadingScene.MethodGet().start({
          delay: 0,
          cbAfterComplete: () => {
            navigate({ to: '/annoucement', replace: true, viewTransition: true });
          },
        });
      } else {
        API.Terms.Get()
          .then((res) => {
            if (res.status_code === 200) {
              setTosData(res.data);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }

    init();
  }, []);

  useEffect(() => {
    // if enter loading state, which move to loading scene
    if (loadingIs) {
      // update progress
      const updateProgressInterval = setInterval(() => {
        if (progress < 100) {
          StoreLoadingScene.MethodGet().progressUpdate(Math.min(100, progress + 1));
        }
      }, 10);

      // after progress reach 100, clear its interval
      if (progress >= 100) {
        clearInterval(updateProgressInterval);
        // on loading complete
        StoreLoadingScene.MethodGet().complete({
          delay: 200,
        });
      }

      return () => {
        clearInterval(updateProgressInterval);
      };
    }
  }, [loadingIs, progress]);

  const handleOnConfirm = () => {
    API.Terms.AcceptAcceptance()
      .then((res) => {
        if (res.status_code === 200) {
          StoreLoadingScene.MethodGet().start({
            delay: 0,
            cbAfterComplete: () => {
              navigate({ to: '/annoucement', replace: true, viewTransition: true });
            },
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const LoadingSceneUI = useCallback(() => StoreLoadingScene.MethodGet().uiGet(), []);

  return loadingIs ? (
    <LoadingSceneUI />
  ) : (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      ></div>
      {/* Safezone */}
      <SafezonePanel>
        <div>
          {tosData ? (
            <TermsAndConditions
              content={
                typeof tosData.content === 'object' && tosData?.content[currentLanguage]
                  ? tosData.content[currentLanguage]
                  : (tosData.content as string)
              }
              date={tosData?.updated_at && toDateTimeTH(tosData?.updated_at)}
              // onCancel={() => setShowTermConditionModal(false)}
              onConfirm={handleOnConfirm}
            />
          ) : (
            <CircleSpinner />
          )}
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
