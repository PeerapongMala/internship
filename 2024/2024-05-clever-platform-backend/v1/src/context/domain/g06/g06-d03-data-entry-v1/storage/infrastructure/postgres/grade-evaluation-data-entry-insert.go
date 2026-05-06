package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationDataEntryInsert(tx *sqlx.Tx, entity *constant.EvaluationDataEntry) (insertId int, err error) {
	query := `
		INSERT INTO grade.evaluation_data_entry (
			 sheet_id,
			 version,
			 json_student_score_data,
			 status,
			 is_lock,
			 created_at,
			 created_by,
			 updated_at,
			 updated_by,
			 start_edit_at,
			 end_edit_at
		)
		VALUES ($1, (SELECT (count(*)+1)::varchar FROM grade.evaluation_data_entry WHERE sheet_id = $1), $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.SheetID,
		entity.JsonStudentScoreData,
		entity.Status,
		entity.IsLock,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.UpdatedAt,
		entity.UpdatedBy,
		entity.StartEditAt,
		entity.EndEditAt,
	).Scan(&insertId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	if entity.Status != nil { // update status when change status to sent
		_, err = tx.Exec(`
			UPDATE grade.evaluation_sheet 
			SET 
			    status=$2, 
			    updated_at=$3, 
			    updated_by=$4 
			WHERE id=$1`,
			entity.SheetID,
			*entity.Status,
			entity.UpdatedAt,
			entity.UpdatedBy,
		)
		if err != nil {
			return insertId, fmt.Errorf("update evaluation sheet status: %w", err)
		}
	}

	//when insert new data entry, update new current data entry id
	err = postgresRepository.EvaluationSheetUpdateCurrentDataEntryID(tx, entity.SheetID, insertId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, fmt.Errorf("update current data entry id : %w", err)
	}

	return insertId, nil
}
