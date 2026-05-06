package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetYearIdBySubjectGroupId(subjectGroupId int) (yearId int, err error) {
	query := `
		SELECT 
		 "cgsg"."year_id"
		FROM 
		 "curriculum_group"."subject_group" cgsg
		LEFT JOIN
		 "subject".subject ss
		ON 
		 "cgsg"."id" = "ss"."subject_group_id"
		WHERE 
		 "ss"."subject_group_id" = $1
		LIMIT 1
	`

	err = postgresRepository.Database.QueryRow(query, subjectGroupId).Scan(&yearId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return yearId, nil
}
