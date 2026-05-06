package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TagGroupCreate(tx *sqlx.Tx, tagGroup *constant.TagGroupEntity) (*constant.TagGroupEntity, error) {
	query := `
		INSERT INTO "subject"."tag_group" (
			"index",
			"subject_id",
			"name"	
		)	
		VALUES ($1, $2, $3)
		RETURNING *
	`
	tagGroupEntity := constant.TagGroupEntity{}
	err := tx.QueryRowx(
		query,
		tagGroup.Index,
		tagGroup.SubjectId,
		tagGroup.Name,
	).StructScan(&tagGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &tagGroupEntity, err
}
