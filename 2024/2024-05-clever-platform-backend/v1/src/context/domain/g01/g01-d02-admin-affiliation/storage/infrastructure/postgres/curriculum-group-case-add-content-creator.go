package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CurriculumGroupCaseAddContentCreator(tx *sqlx.Tx, curriculumGroupId int, contentCreatorId string) error {
	query := `
		INSERT INTO
			"curriculum_group"."curriculum_group_content_creator" (
			"curriculum_group_id",
			"content_creator_id"
			)	
		VALUES ($1, $2)	
		ON CONFLICT 
			("curriculum_group_id", "content_creator_id")
		DO NOTHING 
	`
	_, err := tx.Exec(query, curriculumGroupId, contentCreatorId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
