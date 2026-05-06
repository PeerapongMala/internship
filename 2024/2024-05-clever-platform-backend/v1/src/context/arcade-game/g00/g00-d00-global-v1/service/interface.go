package service

import (
	"mime/multipart"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
)

type ServiceInterface interface {
	GetToken(req constant.GetTokenRequest) (*constant.TokenResponse, error)
	GetGameData(req constant.GetGameDataRequest) (*constant.GameDataResponse, error)
	PlayLogCreate(req constant.StatRequest, studentId string, arcadeGameId int) error
	UpdateCoin(ArcadeGameId int, userId string) error
	GetSession(req constant.GetSessionRequest) (*constant.SessionResponse, error)
	IncreaseCoin(req constant.IncreaseCoinRequest) error
	GetAssetByModelId(playToken string) ([]byte, string, error)
	CreateModelAsset(modelId string, asset *multipart.FileHeader) error
}
