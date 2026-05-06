package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (p *postgresRepository) GetLessonLevelStatListByParams(in *constant.GetLessonLevelStatListAndCsvParams) ([]constant.LessonLevelStatEntity, error) {
	args := []any{in.StudyGroupId}
	where := "sg.id = $1"
	argIndex := 2

	if in.SubLessonId != nil && *in.SubLessonId != 0 {
		where += fmt.Sprintf(" AND sl.id = $%d", argIndex)
		args = append(args, *in.SubLessonId)
		argIndex++
	}
	if in.LessonId != nil && *in.LessonId != 0 {
		where += fmt.Sprintf(" AND l.id = $%d", argIndex)
		args = append(args, *in.LessonId)
		argIndex++
	}
	if in.Search != nil && *in.Search != "" {
		search := "%" + *in.Search + "%"
		where += fmt.Sprintf(` AND (
			CAST(lv.index AS TEXT) ILIKE $%d OR
			lv.level_type ILIKE $%d OR
			lv.question_type ILIKE $%d OR
			lv.difficulty ILIKE $%d OR
			sl.name ILIKE $%d OR
			ssl.name ILIKE $%d
		)`, argIndex, argIndex+1, argIndex+2, argIndex+3, argIndex+4, argIndex+5)
		for i := 0; i < 6; i++ {
			args = append(args, search)
		}
		argIndex += 6
	}

	whereMaxStarLogs := `
		WHERE 
			lpl.student_id IS NOT NULL 
			AND sgs.study_group_id = $1
		`
	if in.DateFilterBase.StartDate != nil {
		whereMaxStarLogs += fmt.Sprintf(" AND lpl.played_at >= $%d", argIndex)
		args = append(args, *in.DateFilterBase.StartDate)
		argIndex++
	}
	if in.DateFilterBase.EndDate != nil {
		whereMaxStarLogs += fmt.Sprintf(" AND lpl.played_at <= $%d", argIndex)
		args = append(args, *in.DateFilterBase.EndDate)
		argIndex++
	}

	queryMaxStarLogs := fmt.Sprintf(`
		WITH max_star_logs AS (
			SELECT
				lpl.student_id,
				lpl.level_id,
				MAX(lpl.star) AS star,
				AVG(qpl.time_used) AS time_used,
				COUNT(DISTINCT lpl.level_id) AS attempts
			FROM level.level_play_log lpl
			LEFT JOIN class.study_group_student sgs
				ON sgs.student_id =  lpl.student_id
			LEFT JOIN question.question_play_log qpl 
				ON qpl.level_play_log_id = lpl.id
			%s
			GROUP BY lpl.student_id, lpl.level_id
		),`, whereMaxStarLogs)

	query := fmt.Sprintf(`
		%s
		levels_with_data AS (
			SELECT
				lv.id AS level_id,
				lv.index AS level_index,
				lv.question_type,
				lv.level_type,
				lv.difficulty,
				sl.id AS sub_lesson_id,
				sl.name AS sub_lesson_name,
				l.name AS lesson_name,
				sgs.student_id,
				COALESCE(msl.star, 0) AS student_score,
				1 AS play_log_count,
				COALESCE(msl.time_used, 0) AS time_used,
				COALESCE(msl.attempts, 0) AS student_attempt_count
			FROM class.study_group sg
			JOIN class.class c ON c.id = sg.class_id
			JOIN subject.subject s ON s.id = sg.subject_id
			JOIN subject.lesson l ON l.subject_id = s.id
			JOIN subject.sub_lesson sl ON sl.lesson_id = l.id
			JOIN level.level lv ON lv.sub_lesson_id = sl.id
			LEFT JOIN class.study_group_student sgs ON sgs.study_group_id = sg.id
			LEFT JOIN max_star_logs msl ON msl.level_id = lv.id AND msl.student_id = sgs.student_id
			WHERE %s
		)
		SELECT
			level_index AS index,
			lesson_name,
			sub_lesson_name,
			COALESCE(SUM(student_score), 0) AS score,
			COUNT(DISTINCT student_id) AS total_student_played,
			COALESCE(SUM(student_attempt_count), 0) AS total_attempt,
			COALESCE(AVG(time_used), 0) AS avg_time_used,
			question_type AS question_type,
			level_type AS level_type,
			difficulty AS difficulty
		FROM levels_with_data
		GROUP BY level_id, level_index, sub_lesson_id, sub_lesson_name, lesson_name, question_type, difficulty, level_type
		ORDER BY sub_lesson_id, level_index
	`, queryMaxStarLogs, where)

	if in.Pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := p.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&in.Pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argIndex, argIndex+1)
		args = append(args, in.Pagination.Offset, in.Pagination.Limit)
	}

	ents := make([]constant.LessonLevelStatEntity, 0)
	if err := p.Database.Select(&ents, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return ents, nil
}
