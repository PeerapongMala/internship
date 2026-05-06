package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"

func (postgresRepository *postgresRepository) GetHomeworkSubmissions(studentId string, homeworkId int) (entities []constant.HomeworkSubmissionJoinLevelPlayLog, err error) {
	// TODO: continue here
	query := `
		SELECT 
			"hs".*,
			"lp".*
		FROM 
			"homework"."homework_submission" hs
			LEFT JOIN "level"."level_play_log" lp ON "hs"."level_play_log_id" = "lp"."id"
		WHERE
			"lp"."student_id" = $1
			AND "lp"."homework_id" = $2
			AND "hs"."index" = (
			    SELECT MAX(index)
					FROM "homework"."homework_submission" hs
					LEFT JOIN "level"."level_play_log" lp ON "hs"."level_play_log_id" = "lp"."id"
				WHERE
					"lp"."student_id" = $1
					AND "lp"."homework_id" = $2
			)	
	`

	args := []interface{}{studentId, homeworkId}
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.HomeworkSubmissionJoinLevelPlayLog{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
