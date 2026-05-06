package postgres

import (
	"log"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateHomeworkTemplate(tx *sqlx.Tx, entity *constant.HomeworkTemplateEntity) error {
	query := "UPDATE homework.homework_template SET "
	params := []interface{}{}
	paramID := 1

	if entity.LessonId != nil && *entity.LessonId != 0 {
		query += `"lesson_id" = $` + strconv.Itoa(paramID) + `, `
		params = append(params, entity.LessonId)
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
