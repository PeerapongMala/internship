package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateQuestionPlayLog(tx *sqlx.Tx, entity *constant.QuestionPlayLogEntity) (err error) {
	query := `
		INSERT INTO "question"."question_play_log" (
			level_play_log_id,
			question_id,
			is_correct,
			time_used
		) 
		VALUES (
			$1, 
			$2, 
			$3, 
			$4
		)
		RETURNING *
	`
	return tx.QueryRowx(
		query,
		entity.LevelPlayLogId,
		entity.QuestionId,
		entity.IsCorrect,
		entity.TimeUsed,
	).StructScan(entity)
}
