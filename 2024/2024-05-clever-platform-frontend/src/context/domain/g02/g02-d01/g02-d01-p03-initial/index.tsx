import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import API from '@domain/g03/g03-d05/local/api';
import StoreGame from '@global/store/game';
import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import StoreLoadingScene from '@global/store/web/loading-scene';
import StoreGlobal from '@store/global';
import { useLevelUpdate } from '@store/global/level/use-level-update';
import { HistoryState, useNavigate } from '@tanstack/react-router';

import ImageBGGeneral from './assets/background-general.png';
import { STATEFLOW } from './interfaces/stateflow.interface';

import { extractFBXFromZip, terminateExtractWorkers } from '@global/helper/extractFBX';
interface ModelData {
  model_id: string;
  model_version_id: string;
  url: string;
  size?: number;
  [key: string]: any;
}

// Helper function to check if model is a character model (skip these - using local GLTF instead)
const isCharacterModel = (modelId: string): boolean => {
  // Character models have format like: set1_character1_level1, set2_character2_level3, etc.
  return /set\d+_character\d+/i.test(modelId);
};

const DomainJSX = () => {
  const { loadingIs } = StoreLoadingScene.StateGet(['loadingIs']);
  const { redirectUrl } = StoreGlobal.StateGet(['redirectUrl']);

  const { t } = useTranslation(['global']);
  const navigate = useNavigate();
  const { updateLevelToStore, progress: updateLevelProgress } = useLevelUpdate();
  const [displayMessage, setDisplayMessage] = useState(t('download_model.check_model'));

  const estimateFileSize = (model: ModelData): number => {
    if (model.size) return Number(model.size);
    if (model.url) {
      if (model.url.endsWith('.glb') || model.url.endsWith('.gltf')) return 1.5 * 1024 * 1024;
      if (model.url.endsWith('.jpg') || model.url.endsWith('.jpeg')) return 500 * 1024;
      if (model.url.endsWith('.png')) return 1 * 1024 * 1024;
    }
    return 1 * 1024 * 1024;
  };

  const formatFileSize = (bytes: number): string => {
    const MB = bytes / (1024 * 1024);
    return MB.toFixed(2);
  };

  const showDisplayMessage = useCallback((message: string) => {
    setDisplayMessage(message);
    StoreLoadingScene.MethodGet().titleUpdate(message);
  }, []);

  const updateProgress = useCallback((
    loaded: number,
    total: number,
    currentLoadedSize: number,
    currentTotalSize: number
  ): void => {
    const safeLoaded = Math.min(loaded, total);
    const safeLoadedSize = Math.min(currentLoadedSize, currentTotalSize);
    const percentByModel = Math.round((safeLoaded / Math.max(total, 1)) * 100);
    const loadedMB = formatFileSize(safeLoadedSize);
    const totalMB = formatFileSize(currentTotalSize);


    StoreLoadingScene.MethodGet().progressUpdate(percentByModel);
    StoreLoadingScene.MethodGet().progressTextUpdate(
      // `${loadedMB}MB/${totalMB}MB (${safeLoaded}/${total} models)`
      ` (${safeLoaded}/${total} models)`
    );
  }, []);

  const loadModels = async (modelsToLoad?: ModelData[]): Promise<void> => {
    const MAX_CONCURRENT_DOWNLOADS = 1; // Reduced from 3 to lower memory usage

    try {

      showDisplayMessage(t('download_model.waiting_download_model'));
      const response = await API.AvatarModelAssets.ModelAssets.Get();
      if (response.status_code !== 200 || !Array.isArray(response.data)) {
        throw new Error('Failed to fetch model URLs from API');
      }
      showDisplayMessage(t('download_model.check_all_model'));
      const allModels = response.data
        .filter(
          (item: any): item is ModelData =>
            item && typeof item.model_id === 'string' && typeof item.url === 'string',
        )
        // Skip character models - now using local GLTF files
        .filter((item: ModelData) => !isCharacterModel(item.model_id));

      const models = modelsToLoad || allModels;

      showDisplayMessage(t('download_model.find_model', { count: models.length }));

      const modelQueue = [...models]; // คิวของโมเดลที่รอโหลด

      let loadedModels = 0;
      let actualLoadedSize = 0;
      const estimatedTotalSize = models.reduce((sum, model) => sum + estimateFileSize(model), 0);

      //  worker หยิบ model จากคิวแล้วโหลด
      const worker = async () => {
        while (modelQueue.length > 0) {
          const model = modelQueue.shift();
          if (!model) continue;

          let modelBlob: Blob | null = null;
          try {
            // Check if model already cached without loading the blob
            const isCached = await StoreModelFileMethods.existItem(model.model_id);
            if (isCached) {
              // Model already exists, skip download
              actualLoadedSize += estimateFileSize(model);
              updateProgress(++loadedModels, models.length, actualLoadedSize, estimatedTotalSize);
              continue;
            }

            const result = await extractFBXFromZip(model.url);
            modelBlob = result.modelBlob;
            const fbxSize = modelBlob.size;

            await StoreModelFileMethods.addItem(
              model.model_id,
              modelBlob,
              model.model_version_id,
            );

            // Clear blob reference to allow GC
            modelBlob = null;

            actualLoadedSize += fbxSize;
            showDisplayMessage(t('download_model.load_model'));
            updateProgress(++loadedModels, models.length, actualLoadedSize, estimatedTotalSize);

            // Force garbage collection if available
            if (typeof (globalThis as any).gc === 'function') {
              (globalThis as any).gc();
            }

            // Add delay to allow GC to run between models
            // Increased from 150ms to 300ms to give GC more time to free memory
            await new Promise(resolve => setTimeout(resolve, 300));
          } catch (error) {
            modelBlob = null;
            console.error(`Error processing model ${model.model_id}:`, error);
            actualLoadedSize += estimateFileSize(model);
            updateProgress(++loadedModels, models.length, actualLoadedSize, estimatedTotalSize);
          }
        }
      };

      //  worker พร้อมกันตามจำนวนสูงสุด
      const workers = Array.from({ length: MAX_CONCURRENT_DOWNLOADS }, () => worker());
      await Promise.all(workers);

      showDisplayMessage(t('download_model.load_model_success'));

      // 🧹 Cleanup: Terminate extraction workers after all models loaded
      // This frees up memory from worker threads
      terminateExtractWorkers();
      console.log('✅ All models loaded, workers cleaned up');
    } catch (error) {
      console.error('Error loading models:', error);

      // 🧹 Cleanup workers even on error
      terminateExtractWorkers();
    }
  };


  const loadLevel = async (): Promise<void> => {
    try {
      await updateLevelToStore();
      console.log('Level data updated successfully');
    } catch (error) {
      console.error('Error updating level data:', error);
    }
  };

  const checkExistingModels = async (): Promise<{
    hasAllModels: boolean;
    needsUpdate: boolean;
    missingModels: ModelData[];
    outdatedModels: ModelData[];
    newModels: ModelData[];
  }> => {
    try {
      const response = await API.AvatarModelAssets.ModelAssets.Get();
      if (response.status_code !== 200 || !Array.isArray(response.data)) {
        return {
          hasAllModels: false,
          needsUpdate: true,
          missingModels: [],
          outdatedModels: [],
          newModels: []
        };
      }

      const models = response.data
        .filter(
          (item: any): item is ModelData =>
            item && typeof item.model_id === 'string' &&
            typeof item.model_version_id === 'string' &&
            typeof item.url === 'string',
        )
        // Skip character models - now using local GLTF files
        .filter((item: ModelData) => !isCharacterModel(item.model_id));

      // 🔍 Check which models are actually missing from IndexedDB
      const missingModels: ModelData[] = [];
      const outdatedModels: ModelData[] = [];

      console.log(`🔍 Checking ${models.length} models in cache...`);

      for (const model of models) {
        try {
          // Check if model exists in IndexedDB (lightweight check, no blob load)
          const exists = await StoreModelFileMethods.existItem(model.model_id);

          if (!exists) {
            missingModels.push(model);
          } else {
            // Model exists - check version if needed
            const cachedVersion = await StoreModelFileMethods.getVersion?.(model.model_id);
            if (cachedVersion && cachedVersion !== model.model_version_id) {
              outdatedModels.push(model);
            }
          }
        } catch (error) {
          console.error(`Error checking model ${model.model_id}:`, error);
          // If check fails, assume missing to be safe
          missingModels.push(model);
        }
      }

      const hasAllModels = missingModels.length === 0 && outdatedModels.length === 0;

      console.log(`✅ Cache check complete: ${models.length - missingModels.length - outdatedModels.length} cached, ${missingModels.length} missing, ${outdatedModels.length} outdated`);

      return {
        hasAllModels,
        needsUpdate: !hasAllModels,
        missingModels,
        outdatedModels,
        newModels: missingModels // New models = missing models
      };
    } catch (error) {
      console.error('Error checking existing models:', error);
      return {
        hasAllModels: false,
        needsUpdate: true,
        missingModels: [],
        outdatedModels: [],
        newModels: []
      };
    }
  };

  useEffect(() => {
    // Check if the level update is in progress
    if (updateLevelProgress > 0) {
      StoreLoadingScene.MethodGet().progressUpdate(updateLevelProgress);
    }
  }, [updateLevelProgress]);

  useEffect(() => {

    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Avatar);

    StoreLoadingScene.MethodGet().loadingSceneInit();
    StoreLoadingScene.MethodGet().loadingSceneSet({
      characterData: 'A',
      sceneData: ImageBGGeneral,
      title: t('download_model.check_model'),
    });

    StoreLoadingScene.MethodGet().start({ delay: 500 });


    const checkAndLoadModels = async () => {
      try {
        const { hasAllModels, needsUpdate, missingModels, outdatedModels, newModels } = await checkExistingModels();

        // รวมโมเดลที่ต้องอัปเดต (ทั้งโมเดลที่ขาดและเวอร์ชั่นไม่ตรง)
        const allModelsToUpdate = [...missingModels, ...outdatedModels];


        if (missingModels.length > 0 && outdatedModels.length === 0) {
          StoreLoadingScene.MethodGet().loadingSceneSet({
            characterData: 'A',
            sceneData: ImageBGGeneral,
            title: `${displayMessage}`,
          });

          await loadModels(missingModels);
          await loadLevel();

          StoreLoadingScene.MethodGet().complete({
            cb: () => navigateToMainMenu()
          });
          return;
        }

        // (ขาดหรือเวอร์ชั่นไม่ตรง)
        if (needsUpdate && allModelsToUpdate.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 300));

          navigate({
            to: '/version-update',
            replace: true,
            viewTransition: true,
            state: {
              modelsToUpdate: allModelsToUpdate
            } as unknown as HistoryState
          });
          return;
        }

        // โมเดลครบ
        await loadLevel();
        StoreLoadingScene.MethodGet().complete({
          cb: () => navigateToMainMenu()
        });

      } catch (error) {
        console.error('Error during model check and load:', error);
        StoreLoadingScene.MethodGet().complete({
          cb: () => navigateToMainMenu()
        });
      }
    };

    const navigateToMainMenu = () => {
      StoreGlobal.MethodGet().initializedSet(true);
      if (redirectUrl) {
        const goto = redirectUrl;
        StoreGlobal.MethodGet().redirectUrlSet('');
        navigate({ to: goto, replace: true, viewTransition: true });
      } else {
        navigate({ to: '/main-menu', replace: true, viewTransition: true });
      }
    };

    checkAndLoadModels();

    return () => {
      console.log('DomainJSX component unmounted');
    };
  }, []);

  useEffect(() => {
    StoreLoadingScene.MethodGet().titleUpdate(displayMessage);
  }, [displayMessage]);

  const LoadingSceneUI = useCallback(
    () => StoreLoadingScene.MethodGet().uiGet(),
    [loadingIs],
  );

  return loadingIs ? (
    <LoadingSceneUI />
  ) : (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 relative"
    >
      <SafezonePanel className="w-full h-full">
        <></>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;