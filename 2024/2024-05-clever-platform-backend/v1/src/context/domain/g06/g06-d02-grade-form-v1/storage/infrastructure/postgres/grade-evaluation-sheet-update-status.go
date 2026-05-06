package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationSheetUpdateStatus(tx *sqlx.Tx, formID int, isLock *bool, statusFrom, statusTo constant.EvaluationSheetStatus, updateBy string) (ids []int, err error) {

	query := `
				UPDATE grade.evaluation_sheet
				SET 
					is_lock = $2, 
					status = $3, 
					updated_at = $4, 
					updated_by = $5
				WHERE form_id = $1 and status = $6
				RETURNING id
			`

	rows, err := tx.Query(
		query,
		formID,
		isLock,
		statusTo,
		time.Now().UTC(),
		updateBy,
		statusFrom,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		ids = append(ids, id)
	}

	fmt.Printf("update grade.evaluation_sheet from status %s to %s with %d rows\n", statusFrom, statusTo, len(ids))
	return ids, nil
}

func (postgresRepository *postgresRepository) EvaluationSheetUpdateStatusByIDs(tx *sqlx.Tx, ids []int, status constant.EvaluationSheetStatus, updateBy string) (err error) {

	query := `
				UPDATE grade.evaluation_sheet
				SET 
					status = $2, 
					updated_at = $3, 
					updated_by = $4
				WHERE id = ANY($1)
			`

	_, err = tx.Exec(
		query,
		ids,
		status,
		time.Now().UTC(),
		updateBy,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	fmt.Printf("update grade.evaluation_sheet to status %s with %d rows\n", status, len(ids))
	return nil
}
