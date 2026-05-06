package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"
)

func (postgresRepository *postgresRepository) LeaderboardCreate(c constant.LeaderboardCreateRequest) error {
	query := `
	INSERT INTO "leaderboard"."leaderboard" (
	"id",
	"username",
	"password",
	"firstname",
	"lastname",
	"score",
	"start_date",
	"end_date"
	)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
	`

	_, err := postgresRepository.Database.Exec(
		query,
		c.Id,
		c.UserName,
		c.PassWord,
		c.FirstName,
		c.LastName,
		c.Score,
		c.StartDate,
		c.EndDate,
	)
	if err != nil {
		return err
	}
	return nil
}
