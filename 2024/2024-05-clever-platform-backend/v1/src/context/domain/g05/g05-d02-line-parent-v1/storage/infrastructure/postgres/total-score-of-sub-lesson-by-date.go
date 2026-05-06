package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TotalScoreOfSubLessonByDate(in *constant.OverViewStatusFilter, date_check string, pagination *helper.Pagination) ([]*constant.SubLessonScore, error) {
	query := `
		WITH max_star AS (
			SELECT 
				DISTINCT ON (l.sub_lesson_id)
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
  				AND lpl.class_id = $3
                AND ht.lesson_id = $4
 				AND ($5 = '' OR DATE(lpl.played_at) <= $5::DATE)
			ORDER BY l.sub_lesson_id, lpl.star DESC
			),
			sub_lesson_subject as (
				SELECT
                    sle.id as sub_lesson_id,
                    sle.name
				FROM "user".student st 
				INNER JOIN school.school_subject ss
					ON st.school_id = ss.school_id
				INNER JOIN subject.lesson l
					ON ss.subject_id = l.subject_id
				INNER JOIN school.school_lesson sl
					ON sl.lesson_id = l.id
                INNER JOIN subject.sub_lesson sle
                	ON sle.lesson_id = sl.lesson_id
                INNER JOIN school.school_sub_lesson ssl
                	ON ssl.sub_lesson_id = sle.id
				WHERE 
					st.user_id = $1
					AND ss.subject_id = $2
                    AND l.id = $4
					AND sl.class_id = $3
			)
			SELECT 
				sls.sub_lesson_id as sub_lesson_id,
				sls.name as sub_lesson_name,
				COALESCE (SUM(mx.max_star), 0) as score
			FROM sub_lesson_subject sls
			LEFT JOIN max_star mx
				ON sls.sub_lesson_id = mx.sub_lesson_id
			GROUP BY sls.sub_lesson_id, sls.name
			ORDER BY sls.sub_lesson_id
	`

	date := in.StartedAt
	if date_check == "end" {
		date = in.EndedAt
	}
	args := []interface{}{in.StudentID, in.SubjectID, in.ClassID, in.LessonID, date}
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
	query += fmt.Sprintf(` OFFSET $6 LIMIT $7`)

	subLesson := []*constant.SubLessonScore{}

	err = postgresRepository.Database.Select(&subLesson, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLesson, nil
}
