import { useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import Button from '@component/web/atom/wc-a-button';
import StoreGame from '@global/store/game';
import ImageBGLogin from './assets/background-login.jpg';
import icon1 from './assets/LoadContent/1/icon.png';
import icon2 from './assets/LoadContent/2/icon.png';
import icon3 from './assets/LoadContent/3/icon.png';
import ConfigJson from './config/index.json';

import { Icon } from '@component/web/atom/wc-a-icon';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import { useWifiType } from '@global/helper/wifi-speed';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import StoreLoadingScene from '@store/web/loading-scene';
import { HistoryState, useLocation, useNavigate } from '@tanstack/react-router';
import IconCloudDownload from './assets/icon-cloud-download.svg';
import IconHome from './assets/icon-home.svg';
import IconLogout from './assets/icon-logout.svg';
import IconWarning from './assets/icon-warning.svg';
import IconWifiOff from './assets/icon-wifi-off.svg';

import { handleLogout } from '@global/helper/auth';
import { StoreModelFileMethods } from '@store/global/avatar-models';
import styles from './index.module.css';

enum StateFlow {
  InitialDownload = -1,
  Download = 0,
  Warning = 1,
  Offline = 2,
}
interface ModelData {
  model_id: string;
  url: string;
  model_version_id?: string;
  size?: number;
  [key: string]: any;
}
interface LoadModelPageState {
  modelsToUpdate?: ModelData[];
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const location = useLocation();

  const [isInitialLoaded, setIsInitialLoaded] = useState(false);
  const [downloadFileSize, setDownloadFileSize] = useState<number | undefined>();
  const [missingModels, setMissingModels] = useState<string[]>([]);
  const [isCheckingModels, setIsCheckingModels] = useState(true);
  const [hasNeverDownloaded, setHasNeverDownloaded] = useState(false);
  const { networkType, networkSpeed } = useWifiType();

  const state = location.state as LoadModelPageState | undefined;
  const modelsToUpdate = state?.modelsToUpdate || [];

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { loadingIs: loadingSceneLoadingIs, progress } = StoreLoadingScene.StateGet([
    'loadingIs',
    'progress',
  ]);
  const { appVersion } = StoreGlobal.StateGet(['appVersion']);
  const { loadingIs: globalLoadingIs } = StoreGlobal.StateGet(['loadingIs']);
  const { localAppVersion } = StoreGlobalPersist.StateGet(['localAppVersion']);
  const { userDatas } = StoreGlobalPersist.StateGet(['userDatas']);

  useEffect(() => {
    const initialize = async () => {
      try {
        StoreGame.MethodGet().GameCanvasEnableSet(false);
        StoreGlobal.MethodGet().loadingSet(true);
        StoreLoadingScene.MethodGet().loadingSceneInit();

        const initialDownloadStatus = await checkInitialDownloadStatus();
        setHasNeverDownloaded(initialDownloadStatus);

        const missing = await checkMissingModels();
        setMissingModels(missing);
        setIsCheckingModels(false);

        console.log('Initial status:', {
          initialDownloadStatus,
          missingModels: missing,
          appVersion,
          localAppVersion
        });

        if (initialDownloadStatus) {
          console.log('Initial download required');
          StoreGame.MethodGet().State.Flow.Set(StateFlow.InitialDownload);
          return;
        }

        if (missing.length === 0) {
          console.log('All models exist, navigating to /initial');
          StoreGlobal.MethodGet().loadingSet(false);
          navigate({
            to: '/initial',
            replace: true,
          });
          return;
        }
        if (missing.length > 0) {
          console.log(`Missing ${missing.length} models`);
          const totalSize = await calculateDownloadSize(missing);
          setDownloadFileSize(totalSize);

          // ตั้งค่า state flow ตาม network type
          if (networkType === 'offline') {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.Offline);
          } else if (networkType === 'slow-4g' || networkType === '4g') {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.Download);
          } else {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.Warning);
          }
          return;
        }
        if (appVersion === localAppVersion && missing.length === 0 && !initialDownloadStatus) {
          console.log('App is up to date, no missing models');
          StoreGlobal.MethodGet().loadingSet(false);
          navigate({
            to: userDatas.length > 0 ? '/pin' : '/login-id',
            replace: true,
          });
        }
      } catch (error) {
        console.error('Initialization error:', error);
        StoreGlobal.MethodGet().loadingSet(false);
      }
    };

    initialize();

    return () => {
      // Cleanup if needed
    };
  }, [appVersion, localAppVersion, navigate, networkType]);

  const checkInitialDownloadStatus = async (): Promise<boolean> => {
    try {
      const allKeys = await StoreModelFileMethods.getAllKeys();
      return allKeys.length === 0;
    } catch (error) {
      console.error('Error checking initial download status:', error);
      return true;
    }
  };

  const checkMissingModels = async (): Promise<string[]> => {
    try {
      const missingModels: string[] = [];

      if (modelsToUpdate && modelsToUpdate.length > 0) {
        for (const model of modelsToUpdate) {
          if (model.model_id) {

            const exists = await StoreModelFileMethods.existItem(model.model_id);
            if (!exists) {
              missingModels.push(model.model_id);
            } else {

              if (model.model_version_id) {
                const currentVersion = await StoreModelFileMethods.getVersion(model.model_id);
                if (currentVersion !== model.model_version_id) {
                  missingModels.push(model.model_id);
                }
              }
            }
          }
        }
      }

      return missingModels;
    } catch (error) {
      console.error('Error checking models:', error);
      return [];
    }
  };

  const calculateDownloadSize = async (models: string[]): Promise<number> => {
    return models.length * 5000;
  };

  useEffect(() => {
    if (!isCheckingModels && networkType) {
      if (hasNeverDownloaded) {
        StoreGame.MethodGet().State.Flow.Set(StateFlow.InitialDownload);
      } else if (networkType === 'offline') {
        StoreGame.MethodGet().State.Flow.Set(StateFlow.Offline);
      } else if (networkType === 'slow-4g' || networkType === '4g') {
        StoreGame.MethodGet().State.Flow.Set(StateFlow.Download);
      } else {
        StoreGame.MethodGet().State.Flow.Set(StateFlow.Warning);
      }
    }
  }, [isCheckingModels, networkType, hasNeverDownloaded]);

  useEffect(() => {
    if (globalLoadingIs && networkType && !isCheckingModels) {
      setTimeout(() => {
        StoreGlobal.MethodGet().loadingSet(false);
      }, 500);
    }
  }, [networkSpeed, networkType, isCheckingModels]);

  useEffect(() => {
    if (loadingSceneLoadingIs) {
      const updateProgressInterval = setInterval(() => {
        if (progress < 100) {
          StoreLoadingScene.MethodGet().step({
            progressPercentage: progress + 1 + Math.random() * 1,
          });
        }
      }, 20);

      if (progress >= 100) {
        clearInterval(updateProgressInterval);
        StoreLoadingScene.MethodGet().complete({
          delay: 500,
          cb: () => {
            StoreGlobalPersist.MethodGet().setLocalAppVersion(appVersion);
            navigate({
              to: userDatas.length > 0 ? '/pin' : '/login-id',
              replace: true,
            });
          },
        });
      }
      return () => {
        clearInterval(updateProgressInterval);
      };
    }
  }, [loadingSceneLoadingIs, progress]);

  const handleExitGame = () => {
    handleLogout()
    navigate({ to: '/pin', replace: true });
  };

  const handleDownloadContent = () => {
    if (missingModels.length > 0) {
      navigate({
        to: '/load-model',
        replace: true,
        state: {
          modelsToUpdate: missingModels
        } as unknown as HistoryState
      });
    } else {
      navigate({ to: '/load-model', replace: true });
    }
    StoreLoadingScene.MethodGet().start({
      delay: 200,
    });
  };

  const handlePlayOffline = () => {
    if (missingModels.length > 0) {
      navigate({ to: '/account-select', replace: true });
    } else {
      navigate({ to: '/account-select', replace: true });
    }
  };

  const handleInitialDownload = () => {
    navigate({
      to: '/initial',
      replace: true,
    });
  };

  const LoadingSceneUI = useCallback(
    () => StoreLoadingScene.MethodGet().uiGet(),
    [loadingSceneLoadingIs],
  );

  const formatFileSize = (sizeInKB: number | undefined): string => {
    if (!sizeInKB) return 'N/A';
    if (sizeInKB < 1024) return `${sizeInKB.toFixed(0)} KB`;
    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  // Dialog styles
  const dialogBaseStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    background: 'var(--gradient-white-80, rgba(255, 255, 255, 0.80))',
    borderRadius: '64px',
    padding: '32px',
    maxWidth: '800px',
    width: '90%',
  };

  return loadingSceneLoadingIs ? (
    <LoadingSceneUI />
  ) : (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1"
    >
      <>
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{ backgroundImage: `url(${ImageBGLogin})` }}
        />

        {!globalLoadingIs && !isCheckingModels && (
          <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0">
            {/* Initial Download Dialog */}
            {stateFlow === StateFlow.InitialDownload && (
              <div className={styles['dialog']} style={dialogBaseStyle}>
                <div className={styles['layout-header']}>
                  <div className={styles['icon']}>
                    <img src={icon1} alt="Initial download" />
                  </div>
                  <div className={styles['text-title']}>
                    <Trans t={t} i18nKey={'initial-download-title'} />
                  </div>
                </div>
                <div className={styles['layout-content']}>
                  <div className={styles['text-content']}>
                    <Trans t={t} i18nKey={'initial-download-message'} />
                    {missingModels.length > 0 && (
                      <div className="mt-4">
                        <Trans
                          t={t}
                          i18nKey={'initial-download-missing-models'}
                          values={{ count: missingModels.length }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles['layout-footer']}>
                  <Button
                    prefix={<Icon src={IconLogout} />}
                    variant={'danger'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleExitGame}
                  >
                    {t('exit-game-btn-label')}
                  </Button>
                  <Button
                    prefix={<Icon src={IconCloudDownload} />}
                    variant={'primary'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleInitialDownload}
                  >
                    {t('go-to-initial-download-btn-label')}
                  </Button>
                </div>
              </div>
            )}

            {/* Download Dialog */}
            {stateFlow === StateFlow.Download && (
              <div className={styles['dialog']} style={dialogBaseStyle}>
                <div className={styles['layout-header']}>
                  <div className={styles['icon']}>
                    <img src={icon1} alt="Download" />
                  </div>
                  <div className={styles['text-title']}>
                    <Trans t={t} i18nKey={'download-new-content-title'} />
                  </div>
                </div>
                <div className={styles['layout-content']}>
                  <div className={styles['text-content']}>
                    {missingModels.length > 0 ? (
                      <Trans
                        t={t}
                        i18nKey={'download-models-required'}
                        values={{
                          count: missingModels.length,
                          size: formatFileSize(downloadFileSize)
                        }}
                      />
                    ) : downloadFileSize ? (
                      <Trans
                        t={t}
                        i18nKey={'download-content-with-size'}
                        values={{ fileSize: formatFileSize(downloadFileSize) }}
                      />
                    ) : (
                      <Trans t={t} i18nKey={'download-content-without-size'} />
                    )}
                  </div>
                </div>
                <div className={styles['layout-footer']}>
                  <Button
                    prefix={<Icon src={IconLogout} />}
                    variant={'danger'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleExitGame}
                  >
                    {t('exit-game-btn-label')}
                  </Button>
                  <Button
                    prefix={<Icon src={IconCloudDownload} />}
                    variant={'primary'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleDownloadContent}
                  >
                    {missingModels.length > 0
                      ? t('download-models-btn-label')
                      : t('start-download-btn-label')}
                  </Button>
                </div>
              </div>
            )}

            {/* Warning Dialog */}
            {stateFlow === StateFlow.Warning && (
              <div className={styles['dialog']} style={dialogBaseStyle}>
                <div className={styles['layout-header']}>
                  <div className={styles['icon']}>
                    <img src={icon2} alt="Warning" />
                  </div>
                  <div className={`${styles['text-title']} text-[#cc0000]`}>
                    <Trans t={t} i18nKey={'warning-download-title'} />
                  </div>
                </div>
                <div className={styles['layout-content']}>
                  <div className={styles['text-content']}>
                    {missingModels.length > 0 ? (
                      <Trans
                        t={t}
                        i18nKey={'warning-download-models'}
                        values={{
                          count: missingModels.length,
                          size: formatFileSize(downloadFileSize)
                        }}
                      />
                    ) : downloadFileSize ? (
                      <Trans
                        t={t}
                        i18nKey={'warning-download-with-size'}
                        values={{ fileSize: formatFileSize(downloadFileSize) }}
                      />
                    ) : (
                      <Trans t={t} i18nKey={'warning-download-without-size'} />
                    )}
                  </div>
                </div>
                <div className={styles['layout-footer']}>
                  <Button
                    prefix={<Icon src={IconLogout} />}
                    variant={'danger'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleExitGame}
                  >
                    {t('exit-game-btn-label')}
                  </Button>
                  <Button
                    prefix={<Icon src={IconWarning} />}
                    variant={'warning'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleDownloadContent}
                  >
                    {missingModels.length > 0
                      ? t('download-models-anyway-btn-label')
                      : t('start-download-with-mobile-internet-btn-label')}
                  </Button>
                </div>
              </div>
            )}

            {/* Offline Dialog */}
            {stateFlow === StateFlow.Offline && (
              <div className={styles['dialog']} style={dialogBaseStyle}>
                <div className={styles['layout-header']}>
                  <div className={styles['icon']}>
                    <img src={icon3} alt="Offline" />
                  </div>
                  <div className={`${styles['text-title']}`}>
                    <Trans t={t} i18nKey={'offline-mode-title'} />
                  </div>
                </div>
                <div className={styles['layout-content']}>
                  <div className={styles['text-content']}>
                    {missingModels.length > 0 ? (
                      <Trans
                        t={t}
                        i18nKey={'offline-mode-missing-models'}
                        values={{ count: missingModels.length }}
                      />
                    ) : (
                      <Trans t={t} i18nKey={'offline-mode-description'} />
                    )}
                  </div>
                </div>
                <div className={styles['layout-footer']}>
                  <Button
                    prefix={<Icon src={IconHome} />}
                    variant={'danger'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handleExitGame}
                  >
                    {t('exit-game-btn-label')}
                  </Button>
                  <Button
                    prefix={<Icon src={IconWifiOff} className="text-white" />}
                    variant={'warning'}
                    className="w-full"
                    textClassName="w-full text-xl justify-center items-center"
                    onClick={handlePlayOffline}
                  >
                    {missingModels.length > 0
                      ? t('play-offline-anyway-btn-label')
                      : t('start-offline-btn-label')}
                  </Button>
                </div>
              </div>
            )}
          </SafezonePanel>
        )}
      </>
    </ResponsiveScaler>
  );
};

export default DomainJSX;