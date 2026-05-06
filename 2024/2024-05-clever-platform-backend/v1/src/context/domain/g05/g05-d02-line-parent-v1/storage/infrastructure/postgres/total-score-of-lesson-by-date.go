package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TotalScoreOfLessonByDate(in *constant.OverViewStatusFilter, date_check string, pagination *helper.Pagination) ([]*constant.LessonScore, error) {
	query := `
		WITH max_star AS (
			SELECT 
				DISTINCT ON (l.id) 
				l.id as level_id,
				ht.lesson_id,
				l.sub_lesson_id,
				lpl.star AS max_star,
				lpl.student_id,
				lpl.played_at
			FROM homework.homework_template ht
			LEFT JOIN homework.homework_template_level htl
				ON ht.id = htl.homework_template_id
			LEFT JOIN level.level l
				ON l.id = htl.level_id
			LEFT JOIN level.level_play_log lpl
				ON l.id = lpl.level_id
			WHERE 
				lpl.student_id = $1
				AND ht.subject_id = $2
				AND ($4 = '' OR DATE(lpl.played_at) <= $4::DATE)
			ORDER BY l.id, lpl.star DESC
			),
			lesson_subject as (
				SELECT
					l.id,
					l.name
				FROM "user".student st 
				INNER JOIN school.school_subject ss
					ON st.school_id = ss.school_id
				INNER JOIN subject.lesson l
					ON ss.subject_id = l.subject_id
				INNER JOIN school.school_lesson sl
					ON sl.lesson_id = l.id
				WHERE 
					st.user_id = $1
					AND ss.subject_id = $2
					AND sl.class_id = $3
			)
			SELECT 
				ls.id as lesson_id,
				ls.name as lesson_name,
				COALESCE (SUM(mx.max_star), 0) as score
			FROM lesson_subject ls
			LEFT JOIN max_star mx
				ON ls.id = mx.lesson_id
			GROUP BY ls.id, ls.name
			ORDER BY ls.id
	`

	date := in.StartedAt
	if date_check == "end" {
		date = in.EndedAt
	}
	args := []interface{}{in.StudentID, in.SubjectID, in.ClassID, date}
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRowx(
		countQuery,
		args...,
	).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	args = append(args, pagination.Offset, pagination.Limit)
	query += fmt.Sprintf(` OFFSET $5 LIMIT $6`)

	lesson := []*constant.LessonScore{}

	err = postgresRepository.Database.Select(&lesson, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lesson, nil
}
