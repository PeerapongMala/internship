package domainutil

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func GetStatStmByStudentIdAndLevelId(in helper.DateFilterBase, args []any) (string, []interface{}) {
	argIndex := len(args)

	statStm := `
		SELECT
			lpl.student_id,
			lpl.level_id,
			MAX(lpl.star) AS score,
			COUNT(lpl.id) AS total_attempt,
			MAX(lpl.played_at) AS last_played_at,
			AVG(qpl_sum.avg_time_used) AS avg_time_used

		FROM level.level_play_log AS lpl
		INNER JOIN level.level l ON l.id = lpl.level_id
		LEFT JOIN (
			SELECT
				AVG(qpl.time_used) AS avg_time_used,
				qpl.level_play_log_id
			FROM question.question_play_log qpl
			GROUP BY qpl.level_play_log_id
		) qpl_sum ON qpl_sum.level_play_log_id = lpl.id
		WHERE lpl.student_id IN (%s)
	`
	if in.StartDate != nil {
		argIndex++
		args = append(args, in.StartDate)
		statStm += fmt.Sprintf(" AND lpl.played_at >= $%d", argIndex)
	}

	if in.EndDate != nil {
		argIndex++
		args = append(args, in.EndDate)
		statStm += fmt.Sprintf(" AND lpl.played_at <= $%d", argIndex)
	}

	statStm += " GROUP BY lpl.level_id, lpl.student_id"
	return statStm, args
}
