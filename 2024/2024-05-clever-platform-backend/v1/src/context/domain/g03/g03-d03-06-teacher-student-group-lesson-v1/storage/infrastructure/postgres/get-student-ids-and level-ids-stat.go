package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-06-teacher-student-group-lesson-v1/constant"
)

func (p *postgresRepository) GetStatStmByStudentIdAndLevelId(in *constant.GetLessonLevelStatListAndCsvParams, args *[]any, argsIndex *int) string {
	tempQuery := fmt.Sprintf("WHERE sgs.study_group_id = $%d", *argsIndex)

	*args = append(*args, in.StudyGroupId)
	*argsIndex++
	// tempQuery = concatMatchInListSql(tempQuery, "lpl.student_id", studentIds)
	tempQuery = concatGreaterThanEqualDatetime(tempQuery, "lpl.played_at", in.DateFilterBase.StartDate)
	tempQuery = concatLessThanDatetime(tempQuery, "lpl.played_at", in.EndDate)

	statStm := fmt.Sprintf(`
		SELECT
			lpl.student_id,
			lpl.level_id,
			MAX(lpl.star) AS score,
			COUNT(lpl.id) AS total_attempt,
			MAX(lpl.played_at) AS last_played_at,
			AVG(qpl_sum.avg_time_used) AS avg_time_used,
			lesson.name as lesson_name,
			sl.name as sub_lesson_name

		FROM level.level_play_log lpl
		LEFT JOIN level.level l ON l.id = lpl.level_id
		LEFT JOIN (
			SELECT
				AVG(qpl.time_used) AS avg_time_used,
				qpl.level_play_log_id
			FROM question.question_play_log qpl
			GROUP BY qpl.level_play_log_id
		) qpl_sum ON qpl_sum.level_play_log_id = lpl.id
		LEFT JOIN 
			subject.sub_lesson sl
			ON sl.id = l.sub_lesson_id
		LEFT JOIN 
			subject.lesson lesson
			ON lesson.id = sl.lesson_id
		LEFT JOIN 
			class.study_group sg
			ON sg.subject_id = lesson.subject_id
		LEFT JOIN class.study_group_student sgs 
			ON sgs.study_group_id = sg.id
		%s
		GROUP BY lpl.level_id, lpl.student_id, lesson.id, sl.id
	`, tempQuery)

	// fmt.Println(statStm)

	return statStm

}
