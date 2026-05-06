package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ListSubjectSubLesson(pagination *helper.Pagination, lessonId int, filter constant.SubLessonListFilter) (*[]constant.SubjectSubLessonListResponse, error) {
	response := []constant.SubjectSubLessonListResponse{}
	query := `
	SELECT
	    ls.name AS "lesson_name",
		ls.index AS "lesson_index",
		sl.id,
		sl.lesson_id,
		sl.indicator_id,
		sl.name,
		sl.status,
		sl.created_at,
		sl.created_by,
		sl."updated_at",
		u.first_name AS "updated_by",
		sl.admin_login_as,
		sl.index,
		u.id AS user_id,
		u.email AS email,
		u.title AS title,
		u.first_name AS first_name,
		u.last_name AS last_name,
		ind.name AS indicator_name,
		ind.transcript_name AS transcript_name,
		(
			SELECT COUNT(*)
			FROM "level"."level" l
			WHERE l.sub_lesson_id = sl.id 
		) AS level_count,
		COALESCE("slfs"."is_updated", false) AS "file_is_updated",
		"slfs"."updated_at" AS "file_updated_at"
	FROM 
		"subject"."sub_lesson" sl
	INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
	LEFT JOIN "subject"."sub_lesson_file_status" slfs ON "sl"."id" = "slfs"."sub_lesson_id"
	LEFT JOIN "user"."user" u ON sl.updated_by = u.id
	LEFT JOIN "curriculum_group"."indicator" ind ON sl.indicator_id = ind.id
	WHERE
	    TRUE
	`

	args := []interface{}{}
	argsIndex := len(args) + 1

	if lessonId != 0 {
		query += fmt.Sprintf(` AND sl.lesson_id = $%d`, argsIndex)
		args = append(args, lessonId)
		argsIndex++
	}

	// Filter by Status
	if filter.Status != nil {
		query += fmt.Sprintf(` AND sl.status = $%d`, argsIndex)
		args = append(args, *filter.Status)
		argsIndex++
	}

	// Filter by Search Text
	if filter.SearchText != nil {
		query += fmt.Sprintf(` AND sl.name ILIKE $%d`, argsIndex)
		args = append(args, "%"+*filter.SearchText+"%")
		argsIndex++
	}

	if filter.IndicatorId != nil {
		query += fmt.Sprintf(` AND sl.indicator_id = $%d`, argsIndex)
		args = append(args, *filter.IndicatorId)
		argsIndex++
	}

	// Filter by Start Date
	if !filter.StartDate.IsZero() {
		query += fmt.Sprintf(` AND sl.created_at >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}

	// Filter by End Date
	if !filter.EndDate.IsZero() {
		query += fmt.Sprintf(` AND sl.created_at <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	// Add pagination
	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) AS subquery`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sl"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	// Execute query
	err := postgresRepository.Database.Select(&response, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &response, nil
}
