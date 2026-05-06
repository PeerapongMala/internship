package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TagCheckIfExists(tagId, tagGroupIndex, subjectId int) (*bool, error) {
	query := `
		SELECT EXISTS (
			SELECT
				1
			FROM
			    "subject"."tag" t
			LEFT JOIN
				"subject"."tag_group" tg
				ON "t"."tag_group_id" = "tg"."id"
			WHERE
			    "t"."id" = $1
				AND
			    "tg"."index" = $2
				AND
			    "tg"."subject_id" = $3
		)	
	`
	var isExists *bool
	err := postgresRepository.Database.QueryRowx(query, tagId, tagGroupIndex, subjectId).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return isExists, nil
}
