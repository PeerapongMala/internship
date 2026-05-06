package postgres

import (
	"log"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateHomework(tx *sqlx.Tx, entity *constant.HomeworkEntity) error {
	query := "UPDATE homework.homework SET "
	params := []interface{}{}
	paramID := 1

	if entity.YearId != nil && *entity.YearId != 0 {
		query += `"year_id" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.YearId)
		paramID++
	}

	if entity.HomeworkTemplateId != nil && *entity.HomeworkTemplateId != 0 {
		query += `"homework_template_id" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.HomeworkTemplateId)
		paramID++
	}

	if entity.Status != nil && *entity.Status != "" {
		query += `"status" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Status)
		paramID++
	}

	if entity.Name != nil && *entity.Name != "" {
		query += `"name" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.Name)
		paramID++
	}

	if entity.StartedAtTime != nil {
		query += `"started_at" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.StartedAtTime)
		paramID++
	}

	if entity.DueAtTime != nil {
		query += `"due_at" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.DueAtTime)
		paramID++
	}

	if entity.ClosedAtTime != nil {
		query += `"closed_at" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.ClosedAtTime)
		paramID++
	}

	if len(params) == 0 {
		return nil
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
