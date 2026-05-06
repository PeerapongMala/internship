package postgres

import (
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicCreate(c constant.SubCriteriaTopicsCreateRequest, txs ...*sqlx.Tx) error {
	var QueryMethod sqlx.Ext
	if len(txs) > 0 {
		QueryMethod = txs[0]
	} else {
		QueryMethod = postgresRepository.Database
	}
	query := ` INSERT INTO "curriculum_group"."sub_criteria_topic"(
	indicator_id,
	name,
	short_name,
	status,
	created_at,
	created_by,
	sub_criteria_id,
	year_id
	)
	VALUES($1,$2,$3,$4,$5,$6,$7,$8)
`

	_, err := QueryMethod.Exec(query,
		c.IndicatorId,
		c.Name,
		c.ShortName,
		c.Status,
		time.Now().UTC(),
		c.CreatedBy,
		c.SubCriteriaId,
		c.YearId,
	)
	if err != nil {
		return err
	}
	return nil
}
