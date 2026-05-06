import { useEffect, useState } from 'react';

import { UserData } from '@domain/g02/g02-d01/local/type';
import API from '@domain/g04/g04-d01/local/api';
import { LessonEntity, SublessonEntity } from '@domain/g04/g04-d01/local/type';
import StoreLessons from '@store/global/lessons';
import StoreGlobalPersist from '@store/global/persist';
import StoreSublessons from '@store/global/sublessons';
import pLimit from 'p-limit';

export function useLevelUpdate() {
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  const [isLevelUpdating, setIsLevelUpdating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // New state for progress

  useEffect(() => {}, []);

  async function updateLevelToStore(sublessonId?: string) {
    console.log('updateLevelToStore');
    
    setIsLevelUpdating(true); // Set updating state to true at the start
    setProgress(0); // Reset progress at the start

    try {
      const limitFn = pLimit(1);
      let sublessonsToUpdate: SublessonEntity[] = [];
      let totalSublessons = 0;

      if (sublessonId) {
        // Only update the specified sublesson
        const sublesson = StoreSublessons.MethodGet().get(sublessonId) as
          | SublessonEntity
          | undefined;
        if (sublesson) {
          sublessonsToUpdate = [sublesson];
          totalSublessons = 1;
        } else {
          setIsLevelUpdating(false);
          return;
        }
      } else {
        // Update all sublessons as before
        const lessonAll = StoreLessons.MethodGet().all();
        sublessonsToUpdate = Object.values(lessonAll).flatMap((lesson) => {
          return StoreSublessons.MethodGet().getFromLessonId(
            (lesson as LessonEntity).id,
          ) as SublessonEntity[];
        });
        totalSublessons = sublessonsToUpdate.length;
      }

      let processedSublessons = 0;

      const promises = sublessonsToUpdate.map((sublesson) =>
        limitFn(async () => {
          try {
            const res = await API.Level.LevelList.Get(sublesson.id);
            if (res.status_code === 200) {
              const levelList = res.data;
              StoreSublessons.MethodGet().addLevels(sublesson.id, levelList, userData.id);
            }
          } catch (error) {
            console.error(`Error updating levels for sublesson ${sublesson.id}:`, error);
          } finally {
            processedSublessons++;
            setProgress(Math.round((processedSublessons / totalSublessons) * 100));
          }
        }),
      );

      await Promise.all(promises);
    } catch (error) {
      console.error('Error updating levels to store:', error);
    } finally {
      setIsLevelUpdating(false); // Ensure updating state is reset in all cases
    }
  }

  return {
    updateLevelToStore,
    isLevelUpdating,
    progress, // Expose progress state
  };
}
