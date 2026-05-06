import CWListItem from "@component/web/atom/cw-list-item";
import IconButton from "@component/web/atom/wc-a-icon-button";
// 👇 Hook นี้ตอนนี้ดึงข้อมูลจาก Global Store (StoreLessons) แล้ว
import { useLessonData } from "@domain/g01/g01-d04/local/hook/use-lesson-meta";
import { TLessonMeta } from "@domain/g01/g01-d04/local/types/lesson-meta";
import { LessonEntity } from "@domain/g04/g04-d01/local/type";
import ImageIconArrowGlyphRightWhite from '@global/assets/arrow-glyph-right.svg';
import ImageIconTrashWhite from '@global/assets/icon-trash.svg';
import StoreLessons from '@store/global/lessons';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate } from "@tanstack/react-router";
import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from "react-i18next";
import ConfigJson from '../../../config/index.json';

interface LessonData {
    id: number;
    title: string;
    lessons: { completed: number; total: number };
    sublessons: { completed: number; total: number };
    lessonIds: number[];
}

interface CWSublessonTabProps {
    onDeleteClick?: (lesson: LessonData) => void;
}

export interface CWSublessonTabRef {
    refreshLessons: () => Promise<void>;
}

const CWSublessonTab = forwardRef<CWSublessonTabRef, CWSublessonTabProps>(({ onDeleteClick }, ref) => {
    const { t } = useTranslation([ConfigJson.key]);
    const navigate = useNavigate();

    // Get stores
    const { store: lessonsStore } = StoreLessons.StateGet(['store']);
    const { store: sublessonsStore } = StoreSublessons.StateGet(['store']);

    // 👇 ใช้ Hook ที่เราแก้ไปเมื่อกี้ เพื่อดึง lessonDataAPI จาก Store
    const { lessonDataAPI, lessonMapping, refreshLessons } = useLessonData() as {
        lessonDataAPI: TLessonMeta[];
        lessonMapping: Map<number, LessonEntity>;
        refreshLessons: () => Promise<any>;
    };

    // Expose refresh function via Ref
    useImperativeHandle(ref, () => ({
        refreshLessons: async () => {
            await refreshLessons();
        }
    }), [refreshLessons]);

    // ถ้าไม่มีข้อมูล (และ Store โหลดเสร็จแล้ว) ให้แสดง Empty State
    if (lessonDataAPI.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 mt-10 text-gray-500">
                <p className="text-xl">{t("lesson.empty")}</p>
            </div>
        );
    }

    return (
        <div className="pt-0">
            {lessonDataAPI.map((apiItem, index) => {
                // 1. หา Lesson Entity ที่ตรงกับข้อมูลจาก API
                const storeLessons = apiItem.lessons
                    .map(lessonObj => lessonMapping.get(lessonObj.lesson_id))
                    .filter((lesson): lesson is LessonEntity => lesson !== undefined);

                // 2. นับจำนวน Lesson ที่โหลดแล้ว (มีอยู่ใน Store)
                const downloadedLessonsCount = storeLessons.length;

                // 3. นับจำนวน Sublesson ที่โหลดเสร็จแล้ว
                const storeMethod = StoreSublessons.MethodGet();
                let downloadedSublessonsCount = 0;

                for (const lesson of storeLessons) {
                    const sublessons = storeMethod.getFromLessonId(lesson.id);
                    downloadedSublessonsCount += sublessons.filter((sub: any) =>
                        storeMethod.isSublessonComplete(sub.id)
                    ).length;
                }

                return (
                    <CWListItem
                        key={index}
                        title={`${apiItem.subject_name} ${apiItem.year_name}`}
                        badges={[
                            {
                                label: `${downloadedLessonsCount} /${apiItem.lesson_count} ${t("lesson.lesson")}`,
                                variant: 'default',
                            },
                            {
                                label: `${downloadedSublessonsCount} /${apiItem.sub_lesson_count} ${t("lesson.sublesson")}`,
                                variant: 'default',
                            },
                        ]}
                        actions={
                            <>
                                <IconButton
                                    variant="danger"
                                    iconSrc={ImageIconTrashWhite}
                                    onClick={() => {
                                        if (onDeleteClick && storeLessons.length > 0) {
                                            const allLessonIds = storeLessons.map(lesson => lesson.id);
                                            const storeLesson = storeLessons[0];

                                            onDeleteClick({
                                                id: storeLesson.id,
                                                lessonIds: allLessonIds,
                                                title: `${apiItem.subject_name} ${apiItem.year_name}`,
                                                lessons: { completed: downloadedLessonsCount, total: apiItem.lesson_count },
                                                sublessons: { completed: downloadedSublessonsCount, total: apiItem.sub_lesson_count },
                                            });
                                        }
                                    }}
                                />
                                <IconButton
                                    variant="primary"
                                    iconSrc={ImageIconArrowGlyphRightWhite}
                                    onClick={() => {
                                        navigate({
                                            to: '/show-lesson',
                                            search: {
                                                subjectName: apiItem.subject_name,
                                                yearName: apiItem.year_name
                                            } as any
                                        })
                                    }}
                                />
                            </>
                        }
                    />
                );
            })}
        </div>
    );
});

CWSublessonTab.displayName = 'CWSublessonTab';

export default CWSublessonTab;
export type { LessonData };

