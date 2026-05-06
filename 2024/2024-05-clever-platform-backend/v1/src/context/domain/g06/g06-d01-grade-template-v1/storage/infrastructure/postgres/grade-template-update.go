package postgres

import (
	"log"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeTemplateUpdate(tx *sqlx.Tx, entity *constant.GradeTemplateEntity) error {
	query := "UPDATE grade.template SET "
	params := []interface{}{}
	paramID := 1

	if entity.Year != nil && *entity.Year != "" {
		query += `"year" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Year)
		paramID++
	}
	if entity.TemplateName != "" {
		query += `"template_name" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.TemplateName)
		paramID++
	}

	if entity.ActiveFlag != nil {
		query += `"active_flag" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.ActiveFlag)
		paramID++
	}

	if entity.Version != nil && *entity.Version != "" {
		query += `"version" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Version)
		paramID++
	}

	if entity.Status != "" {
		query += `"status" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Status)
		paramID++
	}


	query += `"updated_at" = $` + strconv.Itoa(paramID) + `, `
	params = append(params, entity.UpdatedAt)
	paramID++

	query += `"updated_by" = $` + strconv.Itoa(paramID)
	params = append(params, entity.UpdatedBy)
	paramID++
	
	query += ` WHERE "id" = $` + strconv.Itoa(paramID)
	params = append(params, entity.Id)

	_, err := tx.Exec(query, params...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
