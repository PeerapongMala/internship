import Breadcrumbs from '@component/web/atom/Breadcums';
import CWTitleGroup from '@component/web/cw-title-group';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import StoreGlobalPersist from '@store/global/persist';
import React, { useEffect, useState } from 'react';
import API from '@domain/g02/g02-d05/local/api';
import APILesson from '@domain/g02/g02-d03/local/api';
import { Lesson } from '@domain/g02/g02-d03/local/Type';
import { SubLessonData } from '@domain/g02/g02-d04/local/api/type';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { Link } from '@tanstack/react-router';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { TLesson } from '@domain/g06/local/types/academic';

const HeaderBreadcrumbs = ({
  links,
  headerTitle,
  headerDescription,
  sublessonId,
  backLink,
  showLevelCount,
  setLessonStateData,
  setSubLessonStateData,
}: {
  links: { label: string; href: string }[];
  headerTitle: React.ReactNode;
  headerDescription?: React.ReactNode;
  sublessonId?: string;
  backLink?: string;
  showLevelCount?: boolean;
  setLessonStateData?: (lesson: TLesson | undefined) => void;
  setSubLessonStateData?: (subLesson: SubLessonData | undefined) => void;
}) => {
  const [lessonId, setLessonId] = useState<string>();
  const [lessonData, setLessonData] = useState<Lesson>();
  const [subLessonData, setSubLessonData] = useState<SubLessonData>();
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  useEffect(() => {
    if (sublessonId) {
      API.academicLevel.GetG02D04A07SubLessonById(sublessonId).then((res) => {
        if (res.status_code === 200) {
          setLessonId(res.data?.[0]?.lesson_id);
          setSubLessonData(res.data?.[0] as SubLessonData);
          setSubLessonStateData?.(res.data?.[0] as SubLessonData);
        }
      });
    }
  }, [sublessonId]);

  useEffect(() => {
    if (lessonId) {
      APILesson.Lesson.LessonGetById.Get(lessonId)
        .then((res) => {
          setLessonData(res.data[0]);
          setLessonStateData?.(res.data[0] as TLesson);
        })
        .catch((err) => console.error(err));
    }
  }, [lessonId]);

  return (
    <div className="w-full">
      <CWBreadcrumbs links={links} />
      <CWTitleGroup
        listText={[
          `${curriculumData.name} (${curriculumData.short_name})`,
          `${subjectData.seed_year_short_name}`,
          `${subjectData.seed_subject_group_name}`,
          `${subjectData.name}`,
        ]}
        className="mt-5"
      />
      <div className="my-5">
        <div className="flex gap-5">
          {backLink && (
            <Link to={backLink}>
              <IconArrowBackward />
            </Link>
          )}
          <h1 className="text-[26px] font-bold">{headerTitle}</h1>
        </div>
        <div className="mt-2">{headerDescription}</div>
      </div>
      {sublessonId && (
        <CWTitleGroup
          listText={[
            `บทที่ ${lessonData?.id || '-'} - ${lessonData?.name || '-'}`,
            `บทที่ ${lessonData?.id || '-'} - ${subLessonData?.id || '-'} ${subLessonData?.name || '-'}`,
          ]}
          subtitle={
            showLevelCount
              ? [{ totalNumber: subLessonData?.level_count, title: 'ด่าน' }]
              : undefined
          }
          className="mt-5"
        />
      )}
    </div>
  );
};

export default HeaderBreadcrumbs;
