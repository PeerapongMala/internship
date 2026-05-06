package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
)

func (p postgresRepository) GetLevelPlayLogsOverviewByStudyGroup(studyGroupId int, filter constant.LevelPlayLogFilter) (entities []constant.LevelPlayLogsOverviewByStudyGroup, err error) {
	args := []any{studyGroupId}
	argIndex := 2

	var lessonFilter string
	if len(filter.SubLessonIds) > 0 {
		placeholders := make([]string, len(filter.SubLessonIds))
		for i, id := range filter.SubLessonIds {
			placeholders[i] = fmt.Sprintf("$%d", argIndex)
			args = append(args, id)
			argIndex++
		}
		lessonFilter += fmt.Sprintf(" AND sl.id IN (%s)", strings.Join(placeholders, ","))
	}
	if len(filter.LessonIds) > 0 {
		placeholders := make([]string, len(filter.LessonIds))
		for i, id := range filter.LessonIds {
			placeholders[i] = fmt.Sprintf("$%d", argIndex)
			args = append(args, id)
			argIndex++
		}
		lessonFilter += fmt.Sprintf(" AND l.id IN (%s)", strings.Join(placeholders, ","))
	}

	var playedAtFilter string
	if filter.StartAt != nil && filter.EndAt != nil {
		playedAtFilter = fmt.Sprintf("AND lpl.played_at BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, *filter.StartAt, *filter.EndAt)
		argIndex += 2
	}

	query := fmt.Sprintf(`
		WITH all_levels AS (
			SELECT
				sg.id AS study_group_id,
				lv.id AS level_id
			FROM class.study_group sg
			JOIN class.class c ON c.id = sg.class_id
			JOIN subject.subject s ON s.id = sg.subject_id
			JOIN subject.lesson l ON l.subject_id = s.id
			JOIN subject.sub_lesson sl ON sl.lesson_id = l.id
			JOIN level.level lv ON lv.sub_lesson_id = sl.id
			WHERE sg.id = $1
			%s
		),
		best_attempts AS (
			SELECT
				lpl.student_id,
				lpl.level_id,
				MAX(lpl.star) AS max_star
			FROM level.level_play_log lpl
			JOIN class.study_group_student sgs ON sgs.student_id = lpl.student_id
			WHERE sgs.study_group_id = $1
				AND lpl.level_id IN (SELECT level_id FROM all_levels)
				%s
			GROUP BY lpl.student_id, lpl.level_id
		),
		student_scores AS (
			SELECT
				student_id,
				SUM(max_star) AS total_score,
				COUNT(*) FILTER (WHERE max_star > 0) AS passed_level_count
			FROM best_attempts
			GROUP BY student_id
		),
		student_count AS (
			SELECT COUNT(*) AS total_student FROM class.study_group_student WHERE study_group_id = $1
		),
		level_count AS (
			SELECT 
				COUNT(DISTINCT lv.id) AS total_level_in_study_group
			FROM class.study_group sg
			JOIN class.class c ON c.id = sg.class_id
			JOIN subject.subject s ON s.id = sg.subject_id
			JOIN subject.lesson l ON l.subject_id = s.id
			JOIN subject.sub_lesson sl ON sl.lesson_id = l.id
			JOIN level.level lv ON lv.sub_lesson_id = sl.id
			WHERE 
				sg.id = $1
				%s
		),
		summary AS (
			SELECT
				COALESCE(AVG(passed_level_count::float), 0) AS avg_passed_level_per_student,
				COALESCE(AVG(total_score::float), 0) AS avg_total_score_per_student
			FROM student_scores
		),
		avg_time_used AS (
			SELECT
				AVG(qpl.time_used) AS avg_time_used
			FROM level.level_play_log lpl
			JOIN question.question_play_log qpl ON qpl.level_play_log_id = lpl.id
			JOIN class.study_group_student sgs ON sgs.student_id = lpl.student_id
			JOIN level.level lv ON lv.id = lpl.level_id
			JOIN subject.sub_lesson sl ON sl.id = lv.sub_lesson_id
			WHERE sgs.study_group_id = $1
				AND lpl.level_id IN (SELECT level_id FROM all_levels)
				%s
		),
		avg_tests_taken AS (
			SELECT
				AVG(test_count) AS avg_test_taken
			FROM (
				SELECT
				lpl.student_id,
				COUNT(*) AS test_count  -- count all play logs per student, not distinct levels
				FROM level.level_play_log lpl
				JOIN class.study_group_student sgs ON sgs.student_id = lpl.student_id
				JOIN level.level lv ON lv.id = lpl.level_id
				JOIN subject.sub_lesson sl ON sl.id = lv.sub_lesson_id
				WHERE sgs.study_group_id = $1
				AND lpl.level_id IN (SELECT level_id FROM all_levels)
				%s
				GROUP BY lpl.student_id
			) sub
			)
		SELECT
			sc.total_student AS student_count,
			lc.total_level_in_study_group,
			s.avg_passed_level_per_student,
			s.avg_total_score_per_student,
			COALESCE(atu.avg_time_used, 0) AS avg_time_used,
			COALESCE(att.avg_test_taken, 0) AS avg_test_taken
		FROM student_count sc, level_count lc, summary s, avg_time_used atu, avg_tests_taken att;
		`, lessonFilter, playedAtFilter, lessonFilter, playedAtFilter, playedAtFilter)

	var entity constant.LevelPlayLogsOverviewByStudyGroup
	err = p.Database.Get(&entity, query, args...)
	if err != nil {
		return nil, err
	}
	entities = append(entities, entity)
	return entities, nil
}
