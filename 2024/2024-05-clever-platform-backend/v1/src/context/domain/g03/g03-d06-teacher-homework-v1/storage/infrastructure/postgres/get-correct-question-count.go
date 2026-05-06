package postgres

import "log"

func (postgresRepository *postgresRepository) GetCorrectQuestionCount(levelPlayLogId int) (int, error) {
	query := `
		SELECT
			COUNT(CASE WHEN qpl.is_correct = true THEN 1 END) AS correct_count
		FROM "question"."question_play_log" qpl
		WHERE "qpl"."level_play_log_id" = $1
	`
	correctCount := 0
	err := postgresRepository.Database.QueryRowx(query, levelPlayLogId).Scan(&correctCount)
	if err != nil {
		log.Printf("%+v", err)
		return correctCount, err
	}

	return correctCount, nil
}
