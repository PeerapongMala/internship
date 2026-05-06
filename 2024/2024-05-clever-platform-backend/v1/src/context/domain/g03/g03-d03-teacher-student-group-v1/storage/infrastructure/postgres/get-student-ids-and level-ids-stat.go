package postgres

import (
	"fmt"
	domainutil "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/util"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (p *postgresRepository) GetStatStmByStudentIdAndLevelId(in helper.DateFilterBase, studentIds []string) string {

	tempQuery := ""
	tempQuery = domainutil.ConcatMatchInListSql(tempQuery, "lpl.student_id", studentIds)
	tempQuery = domainutil.ConcatGreaterThanEqualDatetime(tempQuery, "lpl.played_at", in.StartDate)
	tempQuery = domainutil.ConcatLessThanDatetime(tempQuery, "lpl.played_at", in.EndDate)

	statStm := fmt.Sprintf(`
		SELECT
			lpl.student_id,
			lpl.level_id,
			MAX(lpl.star) AS score,
			COUNT(lpl.id) AS total_attempt,
			MAX(lpl.played_at) AS last_played_at,
			AVG(qpl_sum.avg_time_used) AS avg_time_used

		FROM level.level_play_log lpl
		INNER JOIN level.level l ON l.id = lpl.level_id
		LEFT JOIN (
			SELECT
				AVG(qpl.time_used) AS avg_time_used,
				qpl.level_play_log_id
			FROM question.question_play_log qpl
			GROUP BY qpl.level_play_log_id
		) qpl_sum ON qpl_sum.level_play_log_id = lpl.id
		%s
		GROUP BY lpl.level_id, lpl.student_id
	`, tempQuery)

	return statStm
}
