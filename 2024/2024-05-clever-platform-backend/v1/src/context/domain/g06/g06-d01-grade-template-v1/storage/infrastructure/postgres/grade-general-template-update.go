package postgres

import (
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeGeneralTemplateUpdate(tx *sqlx.Tx, entity *constant.GradeGeneralTemplateEntity) error {

	query := `
		UPDATE grade.general_template
		SET
	`
	var setClauses []string
	var args []interface{}
	argID := 1

	if entity.TemplateType != nil {
		setClauses = append(setClauses, "template_type = $"+strconv.Itoa(argID))
		args = append(args, entity.TemplateType)
		argID++
	}

	if entity.TemplateName != nil {
		setClauses = append(setClauses, "template_name = $"+strconv.Itoa(argID))
		args = append(args, entity.TemplateName)
		argID++
	}

	if entity.Status != nil {
		setClauses = append(setClauses, "status = $"+strconv.Itoa(argID))
		args = append(args, entity.Status)
		argID++
	}

	if entity.ActiveFlag != nil {
		setClauses = append(setClauses, "active_flag = $"+strconv.Itoa(argID))
		args = append(args, entity.ActiveFlag)
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

	if entity.AdditionalData != nil {
		setClauses = append(setClauses, "additional_data = $"+strconv.Itoa(argID))
		args = append(args, entity.AdditionalData)
		argID++
	}

	query += strings.Join(setClauses, ", ")
	query += " WHERE id = $" + strconv.Itoa(argID)
	args = append(args, entity.Id)
	_, err := tx.Exec(query, args...)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
