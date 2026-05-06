package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CurriculumGroupCreate(tx *sqlx.Tx, curriculumGroup *constant.CurriculumGroupEntity) (*constant.CurriculumGroupEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		QueryMethod = postgresRepository.Database.QueryRowx
	} else {
		QueryMethod = tx.QueryRowx
	}

	query := `
		INSERT INTO "curriculum_group"."curriculum_group" (
			name,
			short_name,
			status,
			created_at,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *
	`
	curriculumGroupEntity := constant.CurriculumGroupEntity{}
	err := QueryMethod(
		query,
		curriculumGroup.Name,
		curriculumGroup.ShortName,
		curriculumGroup.Status,
		curriculumGroup.CreatedAt,
		curriculumGroup.CreatedBy,
	).StructScan(&curriculumGroupEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupEntity, nil
}
