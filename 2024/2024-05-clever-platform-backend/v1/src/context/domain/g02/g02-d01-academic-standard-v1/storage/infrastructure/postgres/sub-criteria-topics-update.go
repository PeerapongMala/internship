package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
)

func (postgresRepository *postgresRepository) SubCriteriaTopicUpdate(c constant.SubCriteriaTopicsUpdateRequest, txs ...*sqlx.Tx) error {
	var QueryMethod sqlx.Ext
	if len(txs) > 0 {
		QueryMethod = txs[0]
	} else {
		QueryMethod = postgresRepository.Database
	}
	query := `UPDATE "curriculum_group"."sub_criteria_topic"
	SET indicator_id = $1,
	name = $2,
	short_name = $3,
	status = $4,
	updated_at = $5,
	updated_by = $6,
	sub_criteria_id = $7,
	year_id = $8
	WHERE id = $9
	`

	result, err := QueryMethod.Exec(query,
		c.IndicatorId,
		c.Name,
		c.ShortName,
		c.Status,
		time.Now().UTC(),
		c.UpdatedBy,
		c.SubCriteriaId,
		c.YearId,
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
		return fmt.Errorf("Topic id is not exist")
	}
	return nil
}
