package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateHomeworkSubmission(tx *sqlx.Tx, entity *constant.HomeworkSubmission) (err error) {
	query := `
		INSERT INTO "homework"."homework_submission" (
			"level_play_log_id",
    		"index"
		) 
		VALUES (
			$1, 
			$2
		)
		RETURNING *
	`
	return tx.QueryRowx(
		query,
		entity.LevelPlayLogId,
		entity.Index,
	).StructScan(entity)
}
