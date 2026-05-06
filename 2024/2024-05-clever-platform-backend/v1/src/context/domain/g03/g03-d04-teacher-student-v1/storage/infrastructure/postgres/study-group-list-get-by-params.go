package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudyGroupListGetByParams(in constant.StudyGroupFilter) ([]constant.StudyGroupEntity, error) {
	stm := `
	SELECT
		study_group.id,
		study_group.name

	FROM "class".study_group as study_group
	INNER JOIN "class".study_group_student AS mapper ON mapper.study_group_id = study_group.id
	INNER JOIN "class"."class" AS c ON c.id = study_group.class_id
	WHERE mapper.student_id = $1
	`

	closingQuery := "ORDER BY study_group.id ASC"
	args := []interface{}{
		in.Student.StudentId,
	}

	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(in.Search) != 0 {
		searhCols := []string{
			"study_group.name",
		}
		queryBuilder.ApplySearch(searhCols, in.Search)
	}

	if in.AcademicYear != 0 {
		queryBuilder.AddFilter("AND c.academic_year =", in.AcademicYear)
	}

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	var items []constant.StudyGroupEntity
	if err := postgresRepository.Database.Select(&items, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return items, nil
}
