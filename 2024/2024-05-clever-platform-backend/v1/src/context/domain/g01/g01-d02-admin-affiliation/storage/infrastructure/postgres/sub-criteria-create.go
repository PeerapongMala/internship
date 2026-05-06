package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d02-admin-affiliation/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubCriteriaCreate(tx *sqlx.Tx, subCriteria *constant.SubCriteriaEntity) (*constant.SubCriteriaEntity, error) {
	query := `
		INSERT INTO
			"curriculum_group"."sub_criteria"
		(
			"curriculum_group_id",
			"index",
			"name"
		)
		VALUES ($1, $2, $3)
		RETURNING *
	`
	subCriteriaEntity := constant.SubCriteriaEntity{}
	err := tx.QueryRowx(query, subCriteria.CurriculumGroupId, subCriteria.Index, subCriteria.Name).StructScan(&subCriteriaEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subCriteriaEntity, nil
}
