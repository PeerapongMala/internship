package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
)

type ServiceInterface interface {
	GetLevelDetail(in *GetLevelDetailInput) ([]constant.GameLevelResponse, error)
	GetGoldCoin(id string) (*constant.InventoryEntity, error)
	GetHomeWork(in *GetHomeWorkInput) ([]constant.HomeWorkDTO, error)
	GetAchivement(in *GetAchivementInput) ([]constant.AchivementDTO, error)
	GetLeaderBoardByLevelId(in *GetLeaderBoardByLevelIdInput) ([]constant.LeaderBoardDataEntity, error)
	GetLeaderBoardBySubLessonId(in *GetLeaderBoardBySubLessonIdInput) ([]constant.LeaderBoardDataEntity, error)
	GetLeaderBoardBySubjectId(in *GetLeaderBoardBySubjectIdInput) ([]constant.LeaderBoardDataEntity, error)
	LevelCaseGetLastPlay(in *LevelCaseGetLastPlayInput) (*LevelCaseGetLastPlayOutput, error)
}
