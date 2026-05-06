package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeSubjectUpdate(tx *sqlx.Tx, entity *constant.SubjectEntity) error {

	query := `
		UPDATE grade.template_subject
		SET
	`

	var updates []string
	var args []interface{}
	argIndex := 1

	if helper.Deref(entity.SubjectNo) != "" {
		updates = append(updates, `"subject_no" = $`+strconv.Itoa(argIndex))
		args = append(args, entity.SubjectNo)
		argIndex++
	}

	if helper.Deref(entity.LearningArea) != "" {
		updates = append(updates, `"learning_area" = $`+strconv.Itoa(argIndex))
		args = append(args, entity.LearningArea)
		argIndex++
	}

	if entity.SubjectName != "" {
		updates = append(updates, `"subject_name" = $`+strconv.Itoa(argIndex))
		args = append(args, entity.SubjectName)
		argIndex++
	}

	if entity.Credits != nil {
		updates = append(updates, `"credits" = $`+strconv.Itoa(argIndex))
		args = append(args, entity.Credits)
		argIndex++
	}

	if entity.Credits != nil {
		updates = append(updates, `"is_extra" = $`+strconv.Itoa(argIndex))
		args = append(args, entity.IsExtra)
		argIndex++
	}

	//force update
	updates = append(updates, `"clever_subject_id" = $`+strconv.Itoa(argIndex))
	args = append(args, entity.CleverSubjectId)
	argIndex++
	//if entity.CleverSubjectId != nil && *entity.CleverSubjectId != 0 {
	//	updates = append(updates, `"clever_subject_id" = $`+strconv.Itoa(argIndex))
	//	args = append(args, entity.CleverSubjectId)
	//	argIndex++
	//}

	updates = append(updates, `"is_clever" = $`+strconv.Itoa(argIndex))
	args = append(args, entity.IsClever)
	argIndex++

	//force update
	updates = append(updates, `"clever_subject_name" = $`+strconv.Itoa(argIndex))
	args = append(args, entity.CleverSubjectName)
	argIndex++
	//if entity.CleverSubjectName != nil && *entity.CleverSubjectName != "" {
	//	updates = append(updates, `"clever_subject_name" = $`+strconv.Itoa(argIndex))
	//	args = append(args, entity.CleverSubjectName)
	//	argIndex++
	//}

	if entity.Hours != nil && *entity.Hours >= 0 {
		updates = append(updates, `"hours" = $`+strconv.Itoa(argIndex))
		args = append(args, entity.Hours)
		argIndex++
	}

	if len(updates) == 0 {
		return nil // No updates to be made
	}

	query += strings.Join(updates, ", ")
	query += ` WHERE "id" = $` + strconv.Itoa(argIndex)
	args = append(args, entity.Id)

	_, err := tx.Exec(query, args...)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
