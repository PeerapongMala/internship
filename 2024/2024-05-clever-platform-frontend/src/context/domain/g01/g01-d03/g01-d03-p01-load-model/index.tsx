import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import API from '@domain/g03/g03-d05/local/api';
import { extractFBXFromZip, terminateExtractWorkers } from '@global/helper/extractFBX';
import { estimateFileSize, formatFileSize } from '@global/helper/sizeEstimator';
import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import StoreLoadingScene from '@global/store/web/loading-scene';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import ImageBGGeneral from '/default/background-login.png';

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
  const { loadingIs } = StoreLoadingScene.StateGet(['loadingIs']);
  const location = useLocation();
  const state = location.state as LoadModelPageState | undefined;
  const modelsToUpdate = state?.modelsToUpdate || [];
  const navigate = useNavigate();
  const { t } = useTranslation(['global']);
  const [progress, setProgress] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(t('download_model.check_model'));
  const [isFading, setIsFading] = useState(false);

  const updatedCountRef = useRef(0);
  const skippedCountRef = useRef(0);
  const lastProgressRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const lastMessageUpdateRef = useRef(0);

  const updateStatusSmoothly = useCallback((message: string) => {
    const now = Date.now();
    if (now - lastMessageUpdateRef.current > 300 ||
      message.includes('ผิดพลาด') ||
      message.includes('สำเร็จ')) {
      cancelAnimationFrame(animationFrameRef.current!);

      setIsFading(true);
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(() => {
          setDisplayMessage(message);

          setIsFading(false);
          lastMessageUpdateRef.current = now;
        }, 300);
      });
    }
  }, []);

  const updateProgress = useCallback((
    loaded: number,
    total: number,
    currentLoadedSize: number,
    currentTotalSize: number
  ): void => {
    const safeLoaded = Math.min(loaded, total);
    const safeLoadedSize = Math.min(currentLoadedSize, currentTotalSize);
    const percentByModel = Math.min(100, Math.round((safeLoaded / Math.max(total, 1)) * 100));
    const loadedMB = formatFileSize(safeLoadedSize);
    const totalMB = formatFileSize(currentTotalSize);

    // อัพเดท progress ทุกครั้งโดยไม่ต้อง throttle
    setProgress(prev => Math.max(prev, percentByModel));
    lastProgressRef.current = percentByModel;


    StoreLoadingScene.MethodGet().progressUpdate(percentByModel);
    StoreLoadingScene.MethodGet().progressTextUpdate(
      // `${loadedMB}/${totalMB} (${safeLoaded}/${total})`
      ` (${safeLoaded}/${total} models)`
    );
  }, []);

  const checkModelVersion = async (model: ModelData): Promise<boolean> => {
    try {
      const existingRecord = await StoreModelFileMethods.existItem(model.model_id);
      if (!existingRecord) return true;

      const existingVersion = await StoreModelFileMethods.getVersion(model.model_id);
      return existingVersion !== model.model_version_id;
    } catch (error) {
      console.error(`Error checking version for model ${model.model_id}:`, error);
      return true;
    }
  };


  const loadModels = async (modelsToLoad?: ModelData[]): Promise<void> => {
    try {
      setProgress(0);
      updateStatusSmoothly(t('download_model.check_model'));
      updatedCountRef.current = 0;
      skippedCountRef.current = 0;

      const response = await API.AvatarModelAssets.ModelAssets.Get();
      if (response.status_code !== 200 || !Array.isArray(response.data)) {
        throw new Error('Failed to fetch model URLs from API');
      }

      // Helper function to check if model is a character model (skip these - using local GLTF instead)
      const isCharacterModel = (modelId: string): boolean => {
        // Character models have format like: set1_character1_level1, set2_character2_level3, etc.
        return /set\d+_character\d+/i.test(modelId);
      };

      const allModels = response.data
        .filter((item: any): item is ModelData =>
          item?.model_id && typeof item.model_id === 'string' &&
          item?.url && typeof item.url === 'string'
        )
        // Skip character models - now using local GLTF files
        .filter((item: any) => !isCharacterModel(item.model_id))
        .map(item => ({
          model_id: item.model_id,
          url: item.url,
          model_version_id: item.model_version_id || '1.0.0'
        }));

      const { deletedCount } = await StoreModelFileMethods.clearOutdatedModels(allModels);
      if (deletedCount > 0) {
        updateStatusSmoothly(t('download_model.delete_old_versions_model', { count: deletedCount }));
      }

      const models = modelsToLoad?.length ? modelsToLoad : allModels;

      if (!models.length) {
        updateStatusSmoothly(t('download_model.no_old_versions_model'));
        setProgress(100);
        setTimeout(() => navigate({ to: '/main-menu' }), 1000);
        return;
      }

      await processModelQueue(models, (loaded, total, loadedSize) => {
        updateProgress(loaded, total, loadedSize, models.reduce((sum, m) => sum + estimateFileSize(m), 0));
      });

    } catch (error) {
      console.error('Error loading models:', error);
      updateStatusSmoothly(t('download_model.fail_update_model'));
      setProgress(100);
      throw error;
    } finally {
      terminateExtractWorkers();
      setProgress(100);

      setTimeout(() => {
        navigate({ to: '/main-menu', replace: true });
      }, 1500);
    }
  };
  async function processModelQueue(
    models: ModelData[],
    onProgress: (done: number, total: number, loadedSize: number) => void
  ) {
    let loadedModels = 0;
    let loadedSize = 0;

    // models is update
    const modelsToActuallyUpdate = await Promise.all(
      models.map(async model => ({
        model,
        needsUpdate: await checkModelVersion(model)
      }))
    ).then(results => results.filter(r => r.needsUpdate).map(r => r.model));

    const modelQueue = [...modelsToActuallyUpdate];
    const totalToUpdate = modelQueue.length;
    const totalSize = modelQueue.reduce((sum, m) => sum + estimateFileSize(m), 0);

    const MAX_CONCURRENT_DOWNLOADS = 1; // Reduced from 3 to lower memory usage

    const worker = async () => {
      while (true) {
        const model = modelQueue.shift();
        if (!model) break;

        let modelBlob: Blob | null = null;
        try {
          const result = await extractFBXFromZip(model.url);
          modelBlob = result.modelBlob;

          const blobSize = modelBlob.size;

          // Pass modelBlob directly to avoid creating object URLs and re-fetching
          await StoreModelFileMethods.addItem(
            model.model_id,
            modelBlob, // Pass blob directly
            model.model_version_id,
          );

          // Clear blob reference to allow GC
          modelBlob = null;

          updatedCountRef.current += 1;
          loadedModels++;
          loadedSize += blobSize;
          updateStatusSmoothly(t('download_model.load_model'));
          onProgress(loadedModels, totalToUpdate, loadedSize);

          // Force garbage collection if available (for memory optimization)
          if (typeof (globalThis as any).gc === 'function') {
            (globalThis as any).gc();
          }

          // Add small delay to allow GC to run between models
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
          modelBlob = null;
          loadedModels++;
          loadedSize += estimateFileSize(model);
          // updateStatusSmoothly(`เกิดข้อผิดพลาดกับโมเดล ${model.model_id}`);
          onProgress(loadedModels, totalToUpdate, loadedSize);
        }
      }
    };
    const workers = Array.from({ length: MAX_CONCURRENT_DOWNLOADS }, () => worker());
    await Promise.all(workers);
    updateStatusSmoothly(t('download_model.load_model_success'));
  }

  useEffect(() => {
    setProgress(0);
    StoreLoadingScene.MethodGet().progressUpdate(0);
    StoreLoadingScene.MethodGet().progressTextUpdate(t('download_model.waiting_download_model'));

    StoreLoadingScene.MethodGet().loadingSceneInit();
    StoreLoadingScene.MethodGet().loadingSceneSet({
      characterData: 'A',
      sceneData: ImageBGGeneral,
      title: t('download_model.load_model'),
    });
    StoreLoadingScene.MethodGet().start({ delay: 500 });

    const validModels = modelsToUpdate.filter(model =>
      model?.model_id && model?.url
    );

    loadModels(validModels.length ? validModels : undefined)
      .catch(error => {
        console.error('Failed to load models:', error);
      });

    return () => {
      cancelAnimationFrame(animationFrameRef.current!);
      StoreLoadingScene.MethodGet().complete();
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
    <>
      <LoadingSceneUI />
    </>

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