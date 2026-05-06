package storageRepository

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"

type ArcadeGameRepository interface {
	//GET TOKEN Section
	GetStudentArcadeCoinById(studentId string) (int, error)
	GetArcadeCoinCost(ArcadeGameId int) (int, error)
	UpdateStudentCoin(studentId string, coin int) error

	//GET DATA Section
	GetUserModelByUserId(studentId string) (*constant.AvatarResponse, error)
	GetArcadeGameConfigId(ArcadeGameId int) (*constant.ArcadeGameConfig, error)

	PlayLogCreate(req constant.ScoreRequest) error
	CreatePlayId(req constant.CreatePlayIdRequest) error
	GetClassByStudentId(studentId string) (int, error)
	DeletePlayId(PlayId string) error
	CheckPlayId(req constant.CheckPlayIdRequest) (bool, error)
	PlayIdGet(ArcadeGameId int, UserId string) (string, error)
	DeletePlayIdByArcadeGameId(ArcadeGameId int, UserId string) error
	CheckAvatarExist(inventoryId int) (bool, error)
	GetInventoryId(UserId string) (int, error)
	CheckPlayIdSession(req constant.CheckPlayIdRequest) (bool, error)
	IncreaseCoin(req constant.IncreaseCoinRequest) error
	GetAssetByModelId(modelId string) (*string, error)
	GetModelByInventoryId(inventoryId int) (string, error)
	CreateModelAsset(modelId string, asset *string) error
}
