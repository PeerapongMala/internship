import {
  LevelSubmitDataResponse,
  LevelSubmitDataWithLevelId,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import API from '@domain/g04/g04-d03/local/api/index';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreLevel from '@store/global/level';
import { useEffect } from 'react';

const BackgroundUpload = () => {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // if internet connection is available, upload the results

    if (isOnline) {
      const levelSubmitResults: LevelSubmitDataWithLevelId | undefined =
        StoreLevel.MethodGet().getLevelSubmitResults();

      const bulkUpload: LevelSubmitDataResponse = {};

      async function SubmitUpload() {
        try {
          let totalResults = 0;
          let uploadSuccess = 0;
          let failSuccess = 0;
          let stillFail = 0;

          for (const key in levelSubmitResults) {
            if (levelSubmitResults[key].isUpload === false) {
              const submitResult = levelSubmitResults[key];
              const results = submitResult.results || [];

              bulkUpload[key] = { result: [] };

              for (let i = 0; i < results.length; i++) {
                const result = results[i];
                totalResults++;

                if (result.status?.status_code !== 200) {
                  // Needs upload
                  const response =
                    await API.Level.CreateG04D03LearningGameplaySubmitResultWithUser(
                      result.level_id.toString(),
                      submitResult.user,
                      result,
                    );

                  bulkUpload[key].result.push({
                    uniqueId: result.uniqueId,
                    levelId: result.level_id,
                    status_code: response.status_code,
                    message: response.message,
                  });

                  if (response.status_code === 200) {
                    uploadSuccess++;
                  } else {
                    stillFail++;
                  }
                } else {
                  // Already uploaded successfully
                  failSuccess++;
                }
              }
            }
          }

          StoreLevel.MethodGet().updateLevelSubmitResults(bulkUpload);

          console.log('=== Upload Report ===');
          console.log('Total results:', totalResults);
          console.log('Upload success:', uploadSuccess);
          console.log('Fail success:', failSuccess);
          console.log('Still Fail (before status != 200):', stillFail);
        } catch (error) {
          console.error('error', error);
        }
      }

      SubmitUpload();
    } else {
      console.log('No internet connection. Results will not be uploaded.');
    }
  }, [isOnline]);

  return <></>;
};

export default BackgroundUpload;
