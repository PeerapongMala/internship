package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListSubject(userId string, filter *constant.SubjectFilter) ([]constant.SubjectEntity, error) {
	query := `
		SELECT DISTINCT
			"s"."id",
			"s"."name"
		FROM
			"subject"."subject" s
		LEFT JOIN 
			"curriculum_group"."subject_group" sg ON s.subject_group_id = sg.id
		LEFT JOIN 
			"curriculum_group"."year" y ON sg.year_id = y.id
		LEFT JOIN 
			"curriculum_group"."curriculum_group" c ON y.curriculum_group_id = c.id
		WHERE
			TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	// if filter.AcademicYear != 0 {
	// 	query += fmt.Sprintf(` AND "cs"."academic_year" = $%d`, argsIndex)
	// 	args = append(args, filter.AcademicYear)
	// 	argsIndex++
	// }
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	query += fmt.Sprintf(` ORDER BY "s"."id"`)
	subjectEntities := []constant.SubjectEntity{}
	err := postgresRepository.Database.Select(&subjectEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectEntities, nil
}
