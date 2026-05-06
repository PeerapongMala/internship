package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetHomeworkBySchoolIdAndSubjectId(
	schoolId int,
	subjectId int,
	pagination *helper.Pagination,
	filter *constant.HomeWorkListFilter,
) (
	[]constant.HomeworkListEntity,
	error,
) {

	query := `
		SELECT
			h.id AS homework_id,
			h.status,
			h."name" AS homework_name,
			s.id AS subject_id,
			s."name" AS subject_name,
			l.id AS lesson_id,
			l."name" AS lesson_name,
			h.started_at AS started_at,
			h.due_at AS due_at,
			h.closed_at AS closed_at,
			count(DISTINCT htl.level_id) AS level_count,
			ARRAY_AGG(DISTINCT hatc.class_id) AS class_ids,
			ARRAY_AGG(DISTINCT hatsg.study_group_id) AS study_group_ids,
			ARRAY_AGG(DISTINCT haty.seed_year_id) AS seed_year_ids
		FROM homework.homework h
		LEFT JOIN homework.homework_template ht
		ON ht.id = h.homework_template_id 
		LEFT JOIN homework.homework_template_level htl
		ON htl.homework_template_id = h.homework_template_id 
		LEFT JOIN subject.subject s 
		ON h.subject_id = s.id
		LEFT JOIN subject.lesson l 
		ON l.id = ht.lesson_id 
		LEFT JOIN school.school_teacher st
		ON st.user_id = ht.teacher_id
		LEFT JOIN homework.homework_assigned_to_class hatc
		ON hatc.homework_id = h.id
		LEFT JOIN homework.homework_assigned_to_study_group hatsg 
		ON hatsg.homework_id = h.id
		LEFT JOIN homework.homework_assigned_to_year haty
		ON haty.homework_id = h.id
		WHERE st.school_id = $1
		AND s.id = $2
	`

	now := time.Now().UTC()
	switch filter.HomeworkType {
	case "must_send":
		query += `AND h.status != 'archived'`
		query += fmt.Sprintf(` AND (h.started_at < '%s' AND h.closed_at > '%s')`, now.Format("2006-01-02 15:04:05"), now.Format("2006-01-02 15:04:05"))
	case "pre-ahead":
		query += `AND h.status != 'archived'`
		query += fmt.Sprintf(` AND (h.started_at > '%s')`, now.Format("2006-01-02 15:04:05"))
	case "archived":
		query += fmt.Sprintf(`AND (h.closed_at < '%s')`, now.Format("2006-01-02 15:04:05"))
	}

	closingQuery := `GROUP BY h.id, homework_name, s.id, subject_name, l.id, l."name", started_at, due_at, closed_at`

	queryBuilder := helper.NewQueryBuilder(query, schoolId, subjectId)

	if filter.HomeworkName != "" {
		queryBuilder.AddFilter(`AND h."name" =`, filter.LessonName)
	}

	if filter.LessonName != "" {
		queryBuilder.AddFilter(`AND l."name" =`, filter.LessonName)
	}

	if filter.StartedAtStart != "" && filter.StartedAtEnd != "" {
		queryBuilder.AddFilter(`AND h.started_at BETWEEN `, filter.StartedAtStart)
		queryBuilder.AddFilter(`AND `, filter.StartedAtEnd)
	}

	if filter.DueAtStart != "" && filter.DueAtEnd != "" {
		queryBuilder.AddFilter(`AND h.due_at BETWEEN `, filter.DueAtStart)
		queryBuilder.AddFilter(`AND `, filter.DueAtEnd)
	}

	if filter.CloseAtStart != "" && filter.CloseAtEnd != "" {
		queryBuilder.AddFilter(`AND h.closed_at BETWEEN `, filter.CloseAtStart)
		queryBuilder.AddFilter(`AND `, filter.CloseAtEnd)
	}

	postgresRepository.queryBuilderAssigndTarget(schoolId, filter, queryBuilder)

	//add search
	searchCol := []string{`h."name"`, `s."name"`, `l."name"`, `h.started_at`, `h.due_at`, `h.closed_at`}
	queryBuilder.ApplySearch(searchCol, filter.Search)
	queryBuilder.AddClosingQuery(closingQuery)

	countQuery, countArgs := queryBuilder.GetTotalCountQueryBuild()

	query, args := queryBuilder.Build()
	if pagination != nil && pagination.Limit.Valid {
		query += fmt.Sprintf(` LIMIT %d OFFSET %d`, pagination.Limit.Int64, pagination.Offset)
	}

	err := postgresRepository.Database.QueryRowx(countQuery, countArgs...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	entities := []constant.HomeworkListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}

func (postgresRepository *postgresRepository) queryBuilderAssigndTarget(schoolId int, filter *constant.HomeWorkListFilter, queryBuilder *helper.QueryBuilder) {

	//if filter.YearId != 0 {
	//	classIds := []int{}
	//	studyGroupIds := []int{}
	//	classList, _ := postgresRepository.GetClassListByYearId(schoolId, filter.YearId)
	//	for _, classEntity := range classList {
	//		classIds = append(classIds, helper.Deref(classEntity.Id))
	//	}
	//
	//	args := []interface{}{}
	//	if filter.ClassId == 0 {
	//		query := `
	//			SELECT
	//				"sg"."id"
	//			FROM "class"."class" c
	//			INNER JOIN "class"."study_group" sg ON "c"."id" = "sg"."class_id"
	//			WHERE "c"."id" = ANY($1::int[])
	//	`
	//		err := postgresRepository.Database.Select(&studyGroupIds, query, classIds)
	//		if err != nil {
	//			log.Printf("%+v", errors.WithStack(err))
	//			return
	//		}
	//
	//		queries := []string{
	//			`haty.seed_year_id =`,
	//			`hatc.class_id =`,
	//			`hatsg.study_group_id =`,
	//		}
	//		args = append(args, filter.YearId, classIds, studyGroupIds)
	//		queryBuilder.AddFiltersWithOR(queries, args)
	//	}
	//	if filter.ClassId != 0 {
	//		query := `
	//			SELECT
	//				"sg"."id"
	//			FROM "class"."class" c
	//			INNER JOIN "class"."study_group" sg ON "c"."id" = "sg"."class_id"
	//			WHERE "c"."id" = $1
	//	`
	//		err := postgresRepository.Database.Select(&studyGroupIds, query, filter.ClassId)
	//		if err != nil {
	//			log.Printf("%+v", errors.WithStack(err))
	//			return
	//		}
	//
	//		queries := []string{
	//			`hatc.class_id =`,
	//			`hatsg.study_group_id =`,
	//		}
	//		args = append(args, filter.ClassId, studyGroupIds)
	//		queryBuilder.AddFiltersWithOR(queries, args)
	//	}
	//
	//}
	args := []interface{}{}
	studyGroupIds := []int{}
	if filter.ClassId != 0 {
		query := `
				SELECT
					"sg"."id"
				FROM "class"."class" c
				INNER JOIN "class"."study_group" sg ON "c"."id" = "sg"."class_id"
				WHERE "c"."id" = $1
		`
		err := postgresRepository.Database.Select(&studyGroupIds, query, filter.ClassId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return
		}

		queries := []string{
			`hatc.class_id =`,
			`hatsg.study_group_id =`,
		}
		args = append(args, filter.ClassId, studyGroupIds)
		queryBuilder.AddFiltersWithOR(queries, args)
	}
	if filter.StudyGroupId != 0 {
		queryBuilder.AddFilter(`AND hatsg.study_group_id =`, filter.StudyGroupId)
	}
}
