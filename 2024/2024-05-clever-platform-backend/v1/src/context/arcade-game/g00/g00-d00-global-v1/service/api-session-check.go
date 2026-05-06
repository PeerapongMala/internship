package service

import (
	"log"
	"net/http"

	arcadehelper "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/arcade-helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetSession(context *fiber.Ctx) error {
	arcadeGameId, err := context.ParamsInt("arcadeGameId")
	if err != nil {
		msg := "Arcade Game Id bad request"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.GetSessionRequest{
		UserId:       subjectId,
		ArcadeGameId: arcadeGameId,
	}
	Session, err := api.Service.GetSession(req)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       Session,
		Message:    "Session checked successfully",
	})
}
func (service *serviceStruct) GetSession(req constant.GetSessionRequest) (*constant.SessionResponse, error) {

	exist, err := service.ArcadeGameStorage.CheckPlayIdSession(constant.CheckPlayIdRequest{
		UserId:       req.UserId,
		ArcadeGameId: req.ArcadeGameId,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	var response *constant.SessionResponse
	if exist {
		PlayId, err := service.ArcadeGameStorage.PlayIdGet(req.ArcadeGameId, req.UserId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		PlayToken, err := arcadehelper.GenerateJwtWithOldPlayId(req.UserId, PlayId, req.ArcadeGameId)
		response = &constant.SessionResponse{
			Session: exist,
			PlayId:  PlayToken,
		}

	} else {
		response = &constant.SessionResponse{
			Session: exist,
			PlayId:  nil,
		}
	}
	return response, nil
}
