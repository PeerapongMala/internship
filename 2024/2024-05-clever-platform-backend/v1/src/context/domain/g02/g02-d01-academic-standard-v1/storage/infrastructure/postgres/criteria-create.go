package postgres

import (
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
)

func (postgresRepository *postgresRepository) CriteriaCreate(c constant.CriteriaCreateRequest, txs ...*sqlx.Tx) error {
	var QueryMethod sqlx.Ext
	if len(txs) > 0 {
		QueryMethod = txs[0]
	} else {
		QueryMethod = postgresRepository.Database
	}
	query := `INSERT INTO "curriculum_group"."criteria"(
	content_id,
	name,
	short_name,
	status,
	created_at,
	created_by
	) VALUES($1,$2,$3,$4,$5,$6)
	 `
	_, err := QueryMethod.Exec(query,
		c.ContentId,
		c.Name,
		c.ShortName,
		c.Status,
		time.Now().UTC(),
		c.CreatedBy,
	)
	if err != nil {
		return err
	}
	return nil
}
