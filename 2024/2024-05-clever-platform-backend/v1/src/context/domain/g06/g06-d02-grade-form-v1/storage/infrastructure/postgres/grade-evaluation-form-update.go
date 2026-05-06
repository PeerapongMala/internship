package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeEvaluationFormUpdate(tx *sqlx.Tx, entity *constant.GradeEvaluationFormEntity) error {

	if entity.IsArchived != nil && !*entity.IsArchived { // ถ้าต้องการ set เป็น active (is_archived = false)
		var count int
		err := tx.Get(&count, `
			WITH current AS (
			    SELECT * FROM grade.evaluation_form WHERE id = $1 LIMIT 1
			)
			SELECT COUNT(*)
			FROM grade.evaluation_form gf
			JOIN current c ON TRUE
			WHERE 
				gf.is_archived IS FALSE 
				AND gf.id != c.id 
				AND gf.school_id = c.school_id 
				AND gf.academic_year = c.academic_year 
				AND gf.year = c.year 
				AND gf.school_room = c.school_room
		`, entity.Id)
		if err != nil {
			return fmt.Errorf("failed to check existing active form: %w", err)
		}
		if count > 0 {
			msg := "another active evaluation form already exists"
			return helper.NewHttpError(http.StatusBadRequest, &msg)
		}
	}

	query := `
		UPDATE grade.evaluation_form
		SET
	`
	var setClauses []string
	var args []interface{}
	argID := 1

	if entity.AcademicYear != nil {
		setClauses = append(setClauses, "academic_year = $"+strconv.Itoa(argID))
		args = append(args, entity.AcademicYear)
		argID++
	}

	if entity.Year != nil {
		setClauses = append(setClauses, "year = $"+strconv.Itoa(argID))
		args = append(args, entity.Year)
		argID++
	}

	if entity.SchoolRoom != nil {
		setClauses = append(setClauses, "school_room = $"+strconv.Itoa(argID))
		args = append(args, entity.SchoolRoom)
		argID++
	}

	if entity.SchoolTerm != nil {
		setClauses = append(setClauses, "school_term = $"+strconv.Itoa(argID))
		args = append(args, entity.SchoolTerm)
		argID++
	}

	if entity.Status != nil {
		setClauses = append(setClauses, "status = $"+strconv.Itoa(argID))
		args = append(args, entity.Status)
		argID++
	}

	if entity.IsLock != nil {
		setClauses = append(setClauses, "is_lock = $"+strconv.Itoa(argID))
		args = append(args, entity.IsLock)
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
	if entity.IsArchived != nil {
		setClauses = append(setClauses, "is_archived = $"+strconv.Itoa(argID))
		args = append(args, entity.IsArchived)
		argID++
	}
	if entity.WizardIndex != nil {
		setClauses = append(setClauses, "wizard_index = $"+strconv.Itoa(argID))
		args = append(args, entity.WizardIndex)
		argID++
	}

	query += strings.Join(setClauses, ", ")
	query += " WHERE id = $" + strconv.Itoa(argID)
	log.Printf("GradeEvaluationFormUpdate query: %s, args %+v\n", query, args)
	args = append(args, entity.Id)
	_, err := tx.Exec(query, args...)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
