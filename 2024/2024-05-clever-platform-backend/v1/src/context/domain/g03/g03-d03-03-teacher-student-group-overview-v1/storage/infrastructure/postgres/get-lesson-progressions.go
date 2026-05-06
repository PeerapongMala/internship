package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLessonProgressions(
	classId int,
	subjectId int,
	studyGroupId int,
	startAt time.Time,
	endAt time.Time,
	pagination *helper.Pagination,
) (entities []constant.ProgressReport, err error) {
	query := `
		WITH students AS (
		    SELECT
		        "sgs"."student_id"
		    FROM "class"."study_group_student" sgs
		    WHERE "sgs"."study_group_id" = $3
		),
		all_lessons AS (
			SELECT 
				ls.id,
				ls.name AS lesson_name,
				s.name AS subject_name
			FROM subject.subject s
			JOIN subject.lesson ls ON ls.subject_id = s.id
			  AND s.id = $1
		),
		start_scores AS (
			SELECT
				l.id,
				COALESCE(SUM(lpl.star), 0) AS total_stars
			FROM all_lessons l
			LEFT JOIN subject.sub_lesson sl ON sl.lesson_id = l.id
			LEFT JOIN level.level ll ON ll.sub_lesson_id = sl.id
			LEFT JOIN level.level_play_log lpl ON lpl.level_id = ll.id 
				AND lpl.played_at <= $2
			LEFT JOIN students st ON st.student_id = lpl.student_id	
			WHERE st.student_id IS NOT NULL
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
				AND lpl.played_at <= $4
			LEFT JOIN students st ON st.student_id = lpl.student_id	
			WHERE st.student_id IS NOT NULL
			GROUP BY l.id
		)
		SELECT DISTINCT ON ("a"."lesson_name")
			a.lesson_name AS scope,
			COALESCE(CASE
				WHEN COALESCE(s.total_stars, 0) = 0 AND COALESCE(e.total_stars, 0) != 0 THEN 100.00
			    WHEN COALESCE(s.total_stars, 0) = 0 THEN 0.00
				ELSE ((e.total_stars - s.total_stars) / NULLIF(s.total_stars, 0)::DECIMAL(10,2)) * 100
			END, 0) AS progress
		FROM all_lessons a
		LEFT JOIN start_scores s ON a.id = s.id
		LEFT JOIN end_scores e ON a.id = e.id
	`

	args := []interface{}{subjectId, startAt, studyGroupId, endAt}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) AS total`, query)
		if err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY a.lesson_name OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.ProgressReport{}
		if err = rows.StructScan(&item); err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
