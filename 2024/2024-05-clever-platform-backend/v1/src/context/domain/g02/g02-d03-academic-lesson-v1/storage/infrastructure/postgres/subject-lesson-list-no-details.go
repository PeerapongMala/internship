package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectLessonListNoDetails(pagination *helper.Pagination, subjectId int, filter constant.LessonListFilter) (*[]constant.SubjectLessonResponse, error) {
	query := `
		SELECT
			"id",
			"name"
		FROM "subject"."lesson"
		WHERE "subject_id" = $1
	`
	args := []interface{}{subjectId}
	argsIndex := len(args) + 1

	if filter.Status != nil {
		query += fmt.Sprintf(` AND "status" = $%d`, argsIndex)
		args = append(args, *filter.Status)
		argsIndex++
	}
	if filter.SearchText != nil {
		query += fmt.Sprintf(` AND "name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.SearchText+"%")
		argsIndex++
	}
	if !filter.StartDate.IsZero() {
		query += fmt.Sprintf(` AND "created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if !filter.EndDate.IsZero() {
		query += fmt.Sprintf(` AND "created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	response := []constant.SubjectLessonResponse{}
	err := postgresRepository.Database.Select(&response, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &response, nil
}
