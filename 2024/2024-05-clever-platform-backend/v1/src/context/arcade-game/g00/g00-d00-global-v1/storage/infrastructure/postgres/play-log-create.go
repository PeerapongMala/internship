package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
)

func (postgresRepository *postgresRepository) PlayLogCreate(req constant.ScoreRequest) error {
	query :=
		`
	INSERT INTO "arcade"."arcade_play_log"(
	class_id,
	student_id,
	arcade_game_id,
	score,
	played_at,
	time_used,
	wave

	) VALUES ($1, $2, $3, $4, $5, $6 , $7)
	`
	_, err := postgresRepository.Database.Exec(query,
		req.ClassId,
		req.StudentId,
		req.ArcadeGameId,
		req.Score,
		time.Now().UTC(),
		req.TimeUse,
		req.Wave,
	)
	if err != nil {
		return err
	}
	return nil
}
