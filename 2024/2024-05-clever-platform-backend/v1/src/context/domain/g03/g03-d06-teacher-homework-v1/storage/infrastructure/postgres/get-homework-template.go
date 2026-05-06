package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetHomeworkTemplateBySchoolIdAndSubjectId(
	schoolId int,
	subjectId int,
	pagination *helper.Pagination,
	filter *constant.HomeWorkTemplateListFilter,
) (
	[]constant.HomeworkTemplateListEntity,
	error,
) {

	query := `
		SELECT 
			ht.id,
			ht."name" AS homework_template_name,
			sy."name" AS year_name,
			sy.short_name AS year_short_name,
			s."name" AS subject_name,
			l.id AS lesson_id,
			l."name" AS lesson_name,
			ht.status AS status,
			count(htl.level_id) AS level_count
		FROM  homework.homework_template ht
		LEFT JOIN subject.subject s 
		ON s.id = ht.subject_id 
		LEFT JOIN school.school_teacher st
		ON st.user_id = ht.teacher_id
		LEFT JOIN curriculum_group.subject_group sg 
		ON sg.id = s.subject_group_id 
		LEFT JOIN curriculum_group."year" y
		ON sg.year_id = y.id
		LEFT JOIN curriculum_group.seed_year sy 
		ON sy.id = y.seed_year_id
		LEFT JOIN subject.lesson l 
		ON l.id = ht.lesson_id 
		LEFT JOIN homework.homework_template_level htl 
		ON htl.homework_template_id = ht.id 
		WHERE st.school_id = $1
		AND s.id = $2
	`
	closingQuery := `GROUP BY ht.id, year_name, year_short_name, subject_name, l.id, l."name"`

	queryBuilder := helper.NewQueryBuilder(query, schoolId, subjectId)

	if filter.LessonName != "" {
		queryBuilder.AddFilter(`AND l."name" =`, filter.LessonName)
	}

	if filter.YearName != "" {
		queryBuilder.AddFilter(`AND sy.short_name =`, filter.YearName)
	}

	if filter.SubjectName != "" {
		queryBuilder.AddFilter(`AND s."name" =`, filter.SubjectName)
	}

	if filter.Status != "" {
		queryBuilder.AddFilter(`AND ht.status =`, filter.Status)
	}

	if filter.HomeworkTemplateName != "" {
		queryBuilder.AddFilter(`AND ht."name" =`, filter.HomeworkTemplateName)
	}

	searchCol := []string{`l."name"`, `sy.short_name`, `s."name"`, `ht."name"`}
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

	entities := []constant.HomeworkTemplateListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
