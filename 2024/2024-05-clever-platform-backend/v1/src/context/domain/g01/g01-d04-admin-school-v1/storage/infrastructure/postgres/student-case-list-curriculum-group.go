package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListCurriculumGroup(userId string, filter *constant.CurriculumGroupFilter) ([]constant.CurriculumGroupEntity, error) {
	query := `
		SELECT DISTINCT
			"c"."id",
			"c"."name",
			"c"."short_name"
		FROM
			"curriculum_group"."curriculum_group" c
		WHERE
			TRUE
		ORDER BY "c"."id"
	`
	// args := []interface{}{}
	// argsIndex := 1

	// if filter.AcademicYear != "" {
	// 	query += fmt.Sprintf(` AND "cs"."academic_year" = $%d`, argsIndex)
	// 	args = append(args, filter.AcademicYear)
	// 	argsIndex++
	// }

	curriculumGroupEntities := []constant.CurriculumGroupEntity{}
	err := postgresRepository.Database.Select(&curriculumGroupEntities, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return curriculumGroupEntities, nil
}
