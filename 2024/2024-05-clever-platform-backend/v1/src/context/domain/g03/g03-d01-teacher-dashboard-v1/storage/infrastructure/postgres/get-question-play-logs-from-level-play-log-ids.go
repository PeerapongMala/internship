package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"

func (postgresRepository postgresRepository) GetQuestionPlayLogsFromLevelPlayLogIds(levelPlayLogIds []int) (entities []constant.QuestionPlayLogEntity, err error) {
	entities = []constant.QuestionPlayLogEntity{}

	query := `
		SELECT
			qpl.id,
			qpl.level_play_log_id,
			qpl.question_id,
			qpl.is_correct,
			qpl.time_used,
			lpl.student_id
		FROM
			"question"."question_play_log" qpl
		LEFT JOIN
			level.level_play_log lpl ON lpl.id = qpl.level_play_log_id
		WHERE
			"level_play_log_id" = ANY($1)
	`
	args := []interface{}{levelPlayLogIds}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.QuestionPlayLogEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
