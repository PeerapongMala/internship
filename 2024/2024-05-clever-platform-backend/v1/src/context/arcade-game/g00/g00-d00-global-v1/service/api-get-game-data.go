package service

import (
	"log"
	"net/http"
	"time"

	arcadehelper "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/arcade-helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetGameData(context *fiber.Ctx) error {

	Token := context.Get("Authorization")
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	req := constant.GetGameDataRequest{
		UserId: subjectId,
		Token:  Token,
	}
	GameData, err := api.Service.GetGameData(req)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       GameData,
		Message:    "Game data fetched successfully",
	})
}
func (service *serviceStruct) GetGameData(req constant.GetGameDataRequest) (*constant.GameDataResponse, error) {
	claims, err := arcadehelper.ValidateJwtArcadeGameBaerer(req.Token)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	req.ArcadeGameId = claims.ArcadeGameId
	if claims.PlayId == "" {
		msg := "Play id is not exist token unauthorized"
		return nil, helper.NewHttpError(http.StatusUnauthorized, &msg)
	}
	if time.Now().After(claims.ExpiresAt.Time) {
		msg := "Play Token expired"
		return nil, helper.NewHttpError(http.StatusUnauthorized, &msg)
	}
	inventoryId, err := service.ArcadeGameStorage.GetInventoryId(req.UserId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	exist, err := service.ArcadeGameStorage.CheckAvatarExist(inventoryId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	var Model *constant.AvatarResponse
	if exist {
		Model, err = service.ArcadeGameStorage.GetUserModelByUserId(req.UserId)
		if err != nil {

			log.Printf("%+v", errors.WithStack(err))
			return nil, err

		}

	} else {
		Model = nil
	}

	Config, err := service.ArcadeGameStorage.GetArcadeGameConfigId(req.ArcadeGameId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	response := constant.GameDataResponse{

		StudentId:     req.UserId,
		ModelData:     Model,
		ArcadeGameId:  Config.ArcadeGameId,
		ArcadeGameUrl: Config.ArcadeGameUrl,
		ConfigId:      Config.ConfigId,
	}
	return &response, nil
}
