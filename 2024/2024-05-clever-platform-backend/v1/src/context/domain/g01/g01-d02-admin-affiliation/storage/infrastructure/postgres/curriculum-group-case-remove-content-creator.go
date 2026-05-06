package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CurriculumGroupCaseRemoveContentCreator(tx *sqlx.Tx, curriculumGroupId int, contentCreatorId string) error {
	query := `
		DELETE FROM "curriculum_group"."curriculum_group_content_creator"
		WHERE
			"curriculum_group_id" = $1
			AND
			"content_creator_id" = $2
	`
	_, err := tx.Exec(query, curriculumGroupId, contentCreatorId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
