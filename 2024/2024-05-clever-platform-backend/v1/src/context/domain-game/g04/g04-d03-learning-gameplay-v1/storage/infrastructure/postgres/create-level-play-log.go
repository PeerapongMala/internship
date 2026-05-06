package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) CreateLevelPlayLog(tx *sqlx.Tx, entity *constant.LevelPlayLogEntity) (err error) {
	query := `
		INSERT INTO "level"."level_play_log" (
			class_id, 
			student_id, 
			level_id, 
			homework_id, 
			played_at,
			star,
			time_used,
			admin_login_as
		) 
		VALUES (
			$1, 
			$2, 
			$3, 
			$4, 
			$5, 
			$6, 
			$7, 
			$8
		)
		RETURNING *
	`
	return postgresRepository.Database.QueryRowx(
		query,
		entity.ClassId,
		entity.StudentId,
		entity.LevelId,
		entity.HomeworkId,
		entity.PlayedAt,
		entity.Star,
		entity.TimeUsed,
		entity.AdminLoginAs,
	).StructScan(entity)
}
