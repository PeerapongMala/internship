package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"
)

func (postgresRepository *postgresRepository) LeaderboardGet() ([]constant.LeaderboardGetResponse, error) {
	query := `SELECT 
	*
	FROM "leaderboard"."leaderboard";`

	leaderboard := []constant.LeaderboardGetResponse{}

	err := postgresRepository.Database.Select(&leaderboard, query)
	if err != nil {
		return nil, err
	}

	return leaderboard, nil
}
