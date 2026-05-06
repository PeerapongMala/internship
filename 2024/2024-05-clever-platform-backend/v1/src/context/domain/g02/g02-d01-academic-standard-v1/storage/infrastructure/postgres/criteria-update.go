package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
)

func (postgresRepository *postgresRepository) CriteriaUpdate(c constant.CriteriaUpdateRequest, txs ...*sqlx.Tx) error {
	var QueryMethod sqlx.Ext
	if len(txs) > 0 {
		QueryMethod = txs[0]
	} else {
		QueryMethod = postgresRepository.Database
	}
	query := `UPDATE "curriculum_group"."criteria"
	SET content_id = $1,
	name = $2,
	short_name = $3,
	status = $4,
	updated_at = $5,
	updated_by = $6
	WHERE id = $7
	`
	result, err := QueryMethod.Exec(query,
		c.ContentId,
		c.Name,
		c.ShortName,
		c.Status,
		time.Now().UTC(),
		c.UpdatedBy,
		c.Id,
	)
	if err != nil {
		return err
	}
	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("Criteria Id is not exist")
	}
	return nil
}
