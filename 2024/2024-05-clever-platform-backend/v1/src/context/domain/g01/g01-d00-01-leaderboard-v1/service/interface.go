package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"
)

type ServiceInterface interface {
	LeaderboardGet() ([]constant.LeaderboardGetResponse, error)
	LeaderboardCreate(constant.LeaderboardCreateRequest) error
	LeaderboardDelete(constant.DeleteRequest) error
	LeaderboardUpdate(constant.LeaderboardUpdateRequest) error
}
