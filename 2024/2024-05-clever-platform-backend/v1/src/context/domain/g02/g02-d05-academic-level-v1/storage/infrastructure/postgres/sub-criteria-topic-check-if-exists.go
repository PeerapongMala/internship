package postgres

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicCheckIfExists(subCriteriaShortName string, subCriteriaIndex, curriculumGroupId int) (int, error) {
	query := `
			SELECT
				"sct"."id"
			FROM
			    "curriculum_group"."sub_criteria_topic" sct
			LEFT JOIN "curriculum_group"."sub_criteria" sc ON "sct"."sub_criteria_id" = "sc"."id"
			WHERE
			    "sct"."short_name" = $1
				AND "sc"."index" = $2
				AND "sc"."curriculum_group_id" = $3
	`
	var id int
	err := postgresRepository.Database.QueryRowx(query, subCriteriaShortName, subCriteriaIndex, curriculumGroupId).Scan(&id)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return id, nil
}
