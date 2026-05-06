package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameResponse, int, error)
	LeaderBoardList(in *LeaderboardListInput) (*LeaderboardListOutput, error)
	ArcadeGameInfo(arcadeGameId int) (*constant.ArcadeGameInfo, error)
	UserInfoGet(studentId string) (*constant.UserResponse, error)
}
