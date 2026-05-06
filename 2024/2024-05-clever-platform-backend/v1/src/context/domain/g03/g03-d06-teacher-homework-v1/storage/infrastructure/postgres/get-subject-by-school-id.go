package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetSubjectBySchoolId(schoolId int, pagination *helper.Pagination, filter *constant.SubjectListFilter) ([]constant.SubjectListEntity, error) {

	query := `
		SELECT DISTINCT ON ("s"."id")
			s.id AS subject_id,
			s."name" AS subject_name,
			cg."name" AS curriculum_group_name,
			y.id AS year_id,
			sy.short_name AS year_name
		FROM  subject.subject s 
		LEFT JOIN school.school_subject ss 
		ON ss.subject_id = s.id
		LEFT JOIN curriculum_group.subject_group sg 
		ON sg.id = s.subject_group_id 
		LEFT JOIN curriculum_group."year" y
		ON sg.year_id = y.id
		LEFT JOIN curriculum_group.seed_year sy 
		ON sy.id = y.seed_year_id
		LEFT JOIN curriculum_group.curriculum_group cg 
		ON y.curriculum_group_id = cg.id
		WHERE ss.school_id = $1
	`

	queryBuilder := helper.NewQueryBuilder(query, schoolId)

	if filter.SubjectId != 0 {
		queryBuilder.AddFilter(`AND s.id =`, filter.SubjectId)
	}

	if filter.YearName != "" {
		queryBuilder.AddFilter(`AND sy2.short_name =`, filter.YearName)
	}

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

	entities := []constant.SubjectListEntity{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
