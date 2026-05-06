package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLessonProgressOverview(
	schoolId int,
	classIds []int,
	studyGroupIds []int,
	subjectIds []int,
	startAt time.Time,
	endAt time.Time,
	pagination *helper.Pagination,
) (entities []constant.ProgressReport, err error) {
	query := `
		WITH all_lessons AS (
			SELECT 
				l.id,
				l.name AS lesson_name,
				s.name AS subject_name
			FROM subject.lesson l
			JOIN subject.subject s ON l.subject_id = s.id
			JOIN school.school_subject ss ON ss.subject_id = s.id
			WHERE ss.school_id = $1
			  AND s.id = ANY($2)
		),
		start_scores AS (
			SELECT
				l.id,
				COALESCE(SUM(lpl.star), 0) AS total_stars
			FROM all_lessons l
			LEFT JOIN subject.sub_lesson sl ON sl.lesson_id = l.id
			LEFT JOIN level.level ll ON ll.sub_lesson_id = sl.id
			LEFT JOIN level.level_play_log lpl ON lpl.level_id = ll.id 
				AND lpl.played_at <= $3
				AND lpl.class_id = ANY($4)
			LEFT JOIN "class"."study_group" sg ON "lpl"."class_id" = "sg"."class_id"
			WHERE TRUE
		`
	args := []interface{}{schoolId, subjectIds, startAt, classIds, endAt, classIds}
	argsIndex := len(args) + 1

	if len(studyGroupIds) != 0 {
		query += fmt.Sprintf(` AND "sg"."id" = ANY($%d)`, argsIndex)
		args = append(args, studyGroupIds)
		argsIndex++
	}

	query += `
			GROUP BY l.id
		),
		end_scores AS (
			SELECT
				l.id,
				COALESCE(SUM(lpl.star), 0) AS total_stars
			FROM all_lessons l
			LEFT JOIN subject.sub_lesson sl ON sl.lesson_id = l.id
			LEFT JOIN level.level ll ON ll.sub_lesson_id = sl.id
			LEFT JOIN level.level_play_log lpl ON lpl.level_id = ll.id 
				AND lpl.played_at <= $5
				AND lpl.class_id = ANY($6)
			LEFT JOIN "class"."study_group" sg ON "lpl"."class_id" = "sg"."class_id"
			WHERE TRUE
		`

	if len(studyGroupIds) != 0 {
		query += fmt.Sprintf(` AND "sg"."id" = ANY($%d)`, argsIndex)
		args = append(args, studyGroupIds)
		argsIndex++
	}

	query += `
			GROUP BY l.id
		)
		SELECT DISTINCT ON ("a"."id")
			a.lesson_name AS scope,
			COALESCE(CASE
				WHEN s.total_stars = 0 AND e.total_stars != 0 THEN 100.00
			    WHEN s.total_stars = 0 THEN 0.00
				ELSE ((e.total_stars - s.total_stars) / NULLIF(s.total_stars, 0)::DECIMAL(10,2)) * 100
			END, 0) AS progress
		FROM all_lessons a
		LEFT JOIN start_scores s ON a.id = s.id
		LEFT JOIN end_scores e ON a.id = e.id
	`

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err = postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return
		}
		query += fmt.Sprintf(` ORDER BY "a"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	entities = []constant.ProgressReport{}
	err = postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return
	}
	return
}
