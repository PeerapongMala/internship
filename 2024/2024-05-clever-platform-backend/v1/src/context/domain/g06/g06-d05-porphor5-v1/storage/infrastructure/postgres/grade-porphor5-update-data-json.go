package postgres

import (
	"encoding/json"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) Porphor5UpdateDataJson(tx *sqlx.Tx, formID, id int, dataJson json.RawMessage) (err error) {
	_, err = tx.Exec(`UPDATE grade.porphor5_data SET data_json = $1 WHERE form_id = $2 AND id = $3`, dataJson, formID, id)
	if err != nil {
		return errors.Wrap(err, "failed to update data")
	}

	return nil
}
