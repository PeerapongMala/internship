package postgres

import (
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) EvaluationSheetUpdateCurrentDataEntryID(tx *sqlx.Tx, id int, dataEntryID int) error {
	_, err := tx.Exec(`UPDATE grade.evaluation_sheet SET current_data_entry_id=$1 WHERE id=$2`, dataEntryID, id)
	if err != nil {
		return err
	}

	return nil
}
