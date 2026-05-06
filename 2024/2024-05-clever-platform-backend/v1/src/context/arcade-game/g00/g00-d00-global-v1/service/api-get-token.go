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

func (api *APIStruct) GetToken(context *fiber.Ctx) error {

	arcadeGameId, err := context.ParamsInt("arcadeGameId")
	if err != nil {
		msg := "Arcade Game Id bad request"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	req := constant.GetTokenRequest{
		UserId:       subjectId,
		ArcadeGameId: arcadeGameId,
	}
	Token, err := api.Service.GetToken(req)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       Token,
		Message:    "Token generated successfully",
	})
}
func (service *serviceStruct) GetToken(req constant.GetTokenRequest) (*constant.TokenResponse, error) {

	err := service.UpdateCoin(req.ArcadeGameId, req.UserId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	Token, err := arcadehelper.GenerateJwtArcadeGame(req.UserId, req.ArcadeGameId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	Claims, err := arcadehelper.ValidateJwtArcadeGame(*Token)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	request := constant.CreatePlayIdRequest{
		PlayId:       Claims.PlayId,
		UserId:       req.UserId,
		ArcadeGameId: req.ArcadeGameId,
	}
	err = service.ArcadeGameStorage.CreatePlayId(request)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	response := constant.TokenResponse{
		PlayToken: Token,
	}
	return &response, nil

}
