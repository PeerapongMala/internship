import CWListItem from "@component/web/atom/cw-list-item";
import IconButton from "@component/web/atom/wc-a-icon-button";
import ImageIconTrashWhite from '@global/assets/icon-trash.svg';
import StoreSublessons from '@store/global/sublessons';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from "react-i18next";
import ConfigJson from '../../../config/index.json';
import { StateFlow } from "../../../types";

interface SublessonListItemData {
    sublessonId: number;
    sublessonName: string;
    progress: number; // 0-100
    isComplete: boolean;
}

interface CWSublessonListProps {
    activeTab: StateFlow;
    lessonId: number;
    showDownloadedOnly?: boolean;
    onDeleteClick?: (sublesson: SublessonListItemData) => void;
}

export interface CWSublessonListRef {
    refreshSublessons: () => void;
}

const CWSublessonList = forwardRef<CWSublessonListRef, CWSublessonListProps>(
    ({ activeTab, lessonId, showDownloadedOnly = false, onDeleteClick }, ref) => {

        const { t } = useTranslation([ConfigJson.key]);
        const storeSublessonsMethod = StoreSublessons.MethodGet();

        // Force refresh state
        const [refreshKey, setRefreshKey] = useState(0);

        // Get sublessons for the selected lesson from IndexedDB
        const sublessonList: SublessonListItemData[] = useMemo(() => {
            const sublessons = storeSublessonsMethod.getFromLessonId(lessonId);
            const allSublessons = sublessons.map((sublesson: any) => {

                const downloadState = storeSublessonsMethod.getSublessonDownloadState(sublesson.id);
                // Calculate progress percentage
                const isComplete = storeSublessonsMethod.isSublessonComplete(sublesson.id);

                // For now, use simple logic: complete = 100%, incomplete = 0%
                // TODO: Calculate actual progress based on downloaded levels/questions
                const progress = isComplete ? 100 : 0;
                return {
                    sublessonId: sublesson.id,
                    sublessonName:
                        sublesson.sub_lesson_name ||
                        t('sublesson.fallbackName', { id: sublesson.id }),
                    progress: downloadState?.progress ?? 0,
                    isComplete: downloadState?.progress === 100,
                };
            });

            // Filter based on showDownloadedOnly
            if (showDownloadedOnly) {
                return allSublessons.filter((sub: any) => sub.progress > 0);
            }

            return allSublessons;
        }, [lessonId, showDownloadedOnly, refreshKey]); // Watch refreshKey for changes

        // Expose refresh function to parent component
        useImperativeHandle(ref, () => ({
            refreshSublessons: () => {
                console.log('🔄 Refresh sublessons called - triggering re-render');
                setRefreshKey(prev => prev + 1); // Force re-render
            }
        }), []);

        if (sublessonList.length === 0) {
            return (
                <div className="flex items-center justify-center p-8 mt-10 text-gray-500">
                    <p className="text-xl">{t('sublesson.empty')}</p>
                </div>
            );
        }

        return (
            <div className="pt-0">
                {sublessonList.map((sublesson) => {

                    return (
                        <CWListItem
                            key={sublesson.sublessonId}
                            title={sublesson.sublessonName}
                            className="!min-h-[100px]"
                            badges={[
                                {
                                    label: `${sublesson.progress}%`,
                                    variant: sublesson.isComplete ? 'success' : 'default',
                                },
                            ]}
                            actions={
                                <>
                                    {activeTab === StateFlow.SUBLESSON_DOWNLOADED && (
                                        <IconButton
                                            variant="danger"
                                            iconSrc={ImageIconTrashWhite}
                                            onClick={() => {
                                                if (onDeleteClick) {

                                                    onDeleteClick(sublesson);
                                                } else {
                                                    console.log('Delete sublesson:', sublesson);
                                                }
                                            }}
                                        />
                                    )}
                                </>
                            }
                        />
                    );
                })}
            </div>
        );
    }
);

CWSublessonList.displayName = 'CWSublessonList';

export default CWSublessonList;
export type { SublessonListItemData };

