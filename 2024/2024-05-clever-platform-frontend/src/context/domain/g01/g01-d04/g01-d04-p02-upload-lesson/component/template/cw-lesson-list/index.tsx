import CWListItem from "@component/web/atom/cw-list-item";
import IconButton from "@component/web/atom/wc-a-icon-button";
import { useLessonData } from "@domain/g01/g01-d04/local/hook/use-lesson-meta";
import ImageIconArrowGlyphRightWhite from '@global/assets/arrow-glyph-right.svg';
import ImageIconTrashWhite from '@global/assets/icon-trash.svg';
import StoreLessons from '@store/global/lessons';
import StoreSublessons from '@store/global/sublessons';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../types';

interface LessonListItemData {
    lessonId: number;
    lessonName: string;
    downloadedSublessonsCount: number;
    totalSublessonsCount: number;
    isComplete: boolean;
}

interface CWLessonListProps {
    activeTab: StateFlow;
    subjectName?: string;
    yearName?: string;
    onLessonClick?: (lesson: LessonListItemData) => void;
    onDeleteClick?: (lesson: LessonListItemData) => void;
}

export interface CWLessonListRef {
    refreshLessons: () => Promise<void>;
}

const CWLessonList = forwardRef<CWLessonListRef, CWLessonListProps>(
    ({ activeTab, subjectName, yearName, onLessonClick, onDeleteClick }, ref) => {
        const { t } = useTranslation([ConfigJson.key]);
        const { lessonDataAPI, refreshLessons } = useLessonData();
        // Get all lessons from IndexedDB store
        const { store: lessonsStore } = StoreLessons.StateGet(['store']);
        const storeSublessonsMethod = StoreSublessons.MethodGet();

        // Transform lessons to display format
        const lessonList: LessonListItemData[] = useMemo(() => {
            const lessons = Object.values(lessonsStore).map((lesson: any) => {

                // Get sublessons from IndexedDB for downloaded count
                const sublessons = storeSublessonsMethod.getFromLessonId(lesson.id);

                // Count downloaded (complete) sublessons
                const downloadedSublessonsCount = sublessons.filter((sub: any) =>
                    storeSublessonsMethod.isSublessonComplete(sub.id)
                ).length;

                // Get total sublesson count from API data (not from IndexedDB)
                // Find the matching lesson object inside apiItem.lessons
                let totalSublessonsCount = sublessons.length; // fallback to downloaded count
                let matchedApiLesson = null;

                for (const apiItem of lessonDataAPI) {
                    matchedApiLesson = apiItem.lessons.find((l: any) => l.lesson_id === lesson.id);
                    if (matchedApiLesson) {
                        totalSublessonsCount = matchedApiLesson.sub_lesson_count;
                        break;
                    }
                }
                // Check if lesson is complete (all sublessons downloaded)
                const isComplete = totalSublessonsCount > 0 &&
                    downloadedSublessonsCount === totalSublessonsCount;

                return {
                    lessonId: lesson.id,
                    lessonName: lesson.name,
                    downloadedSublessonsCount,
                    totalSublessonsCount,
                    isComplete,
                };
            });

            // Filter by subject/year if provided
            let filteredLessons = lessons;
            if (subjectName && yearName && lessonDataAPI.length > 0) {
                // Find the matching metadata
                const matchingMeta = lessonDataAPI.find(
                    (apiItem: any) => apiItem.subject_name === subjectName && apiItem.year_name === yearName
                );

                if (matchingMeta) {
                    // Get lesson IDs that belong to this subject/year
                    const allowedLessonIds = new Set(
                        matchingMeta.lessons.map((l: any) => l.lesson_id)
                    );
                    // Filter to only show lessons in this set
                    filteredLessons = lessons.filter(lesson =>
                        allowedLessonIds.has(lesson.lessonId)
                    );
                }
            }

            // Filter based on active tab
            if (activeTab === StateFlow.LESSON_DOWNLOADED) {
                // Show lessons with any downloaded content
                return filteredLessons.filter(lesson => lesson.downloadedSublessonsCount > 0);
            }

            // Show all lessons
            return filteredLessons;
        }, [lessonsStore, activeTab, subjectName, yearName, storeSublessonsMethod, lessonDataAPI]);

        // Expose refresh function to parent component
        useImperativeHandle(ref, () => ({
            refreshLessons: async () => {
                await refreshLessons();
            }
        }), [refreshLessons]);

        if (lessonList.length === 0) {
            const emptyMessage =
                activeTab === StateFlow.LESSON_DOWNLOADED
                    ? t('lesson.empty.downloaded')
                    : t('lesson.empty.all');


            return (
                <div className="flex items-center justify-center p-8 mt-10 text-gray-500">
                    <p className="text-xl">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="pt-0">
                {lessonList.map((lesson) => {
                    // Determine button variant based on completion status
                    // primary (blue) for complete lessons, secondary (cyan) for incomplete
                    const buttonVariant = lesson.isComplete ? 'primary' : 'tertiary';
                    console.log({ lesson: lesson })
                    return (
                        <CWListItem
                            key={lesson.lessonId}
                            title={lesson.lessonName}
                            badges={[
                                {
                                    label: t('sublesson-count', {
                                        downloaded: lesson.downloadedSublessonsCount,
                                        total: lesson.totalSublessonsCount,
                                    }),
                                    variant: 'default',
                                },
                            ]}
                            actions={
                                <>
                                    {activeTab === StateFlow.LESSON_DOWNLOADED && (
                                        <IconButton
                                            variant="danger"
                                            iconSrc={ImageIconTrashWhite}
                                            onClick={() => {
                                                if (onDeleteClick) {
                                                    onDeleteClick(lesson);
                                                } else {
                                                    console.log('Delete lesson:', lesson);
                                                }
                                            }}
                                        />
                                    )}
                                    <IconButton
                                        variant={buttonVariant}
                                        iconSrc={ImageIconArrowGlyphRightWhite}
                                        onClick={() => {
                                            if (onLessonClick) {
                                                onLessonClick(lesson);
                                            } else {
                                                console.log('Lesson clicked:', lesson);
                                            }
                                        }}
                                    />
                                </>
                            }
                        />
                    );
                })}
            </div>
        );
    }
);

CWLessonList.displayName = 'CWLessonList';

export default CWLessonList;
export type { LessonListItemData };

