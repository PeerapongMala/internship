package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"
)

func (postgresRepository *postgresRepository) LeaderboardUpdate(c constant.LeaderboardUpdateRequest) error {
	query := `
	update "leaderboard"."leaderboard 
	set 
	username=$2,
	password=$3,
	firstname=$4,
	lastname=$5,
	score=$6,
	start_date=$7,
	end_date=$8,
	where id = $1
	
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
