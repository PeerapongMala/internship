package postgres

import (
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (r *postgresRepository) EvaluationSheetUpdate(tx *sqlx.Tx, entity *constant.EvaluationSheetEntity) error {
	// build base query
	query := `
        UPDATE grade.evaluation_sheet
        SET
    `
	var setClauses []string
	var args []interface{}
	argID := 1

	//if entity.ValueType != nil {
	//	setClauses = append(setClauses, "value_type = $"+strconv.Itoa(argID))
	//	args = append(args, entity.ValueType)
	//	argID++
	//}
	//if entity.EvaluationFormSubjectID != nil {
	//	setClauses = append(setClauses, "evaluation_form_subject_id = $"+strconv.Itoa(argID))
	//	args = append(args, entity.EvaluationFormSubjectID)
	//	argID++
	//}
	//if entity.EvaluationFormGeneralEvaluationID != nil {
	//	setClauses = append(setClauses, "evaluation_form_general_evaluation_id = $"+strconv.Itoa(argID))
	//	args = append(args, entity.EvaluationFormGeneralEvaluationID)
	//	argID++
	//}
	if entity.IsLock != nil {
		setClauses = append(setClauses, "is_lock = $"+strconv.Itoa(argID))
		args = append(args, entity.IsLock)
		argID++
	}
	if entity.Status != nil {
		setClauses = append(setClauses, "status = $"+strconv.Itoa(argID))
		args = append(args, entity.Status)
		argID++
	}
	if entity.UpdatedAt != nil {
		setClauses = append(setClauses, "updated_at = $"+strconv.Itoa(argID))
		args = append(args, entity.UpdatedAt)
		argID++
	}
	if entity.UpdatedBy != nil {
		setClauses = append(setClauses, "updated_by = $"+strconv.Itoa(argID))
		args = append(args, entity.UpdatedBy)
		argID++
	}
	if entity.AdminLoginAs != nil {
		setClauses = append(setClauses, "admin_login_as = $"+strconv.Itoa(argID))
		args = append(args, entity.AdminLoginAs)
		argID++
	}
	//if entity.CurrentDataEntryID != nil {
	//	setClauses = append(setClauses, "current_data_entry_id = $"+strconv.Itoa(argID))
	//	args = append(args, entity.CurrentDataEntryID)
	//	argID++
	//}

	// join all SET clauses and add WHERE
	query += strings.Join(setClauses, ", ")
	query += " WHERE id = $" + strconv.Itoa(argID)
	args = append(args, entity.ID)

	// execute
	if _, err := tx.Exec(query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
