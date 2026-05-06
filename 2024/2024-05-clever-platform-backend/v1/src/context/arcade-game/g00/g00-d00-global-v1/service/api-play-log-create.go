package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	arcadehelper "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/arcade-helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/arcade-game/g00/g00-d00-global-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) PlayLogCreate(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	token := context.Get("Authorization")
	BodyReq := constant.StatRequest{}
	err := context.BodyParser(&BodyReq)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	req := constant.StatRequest{
		Score:     BodyReq.Score,
		TimeUse:   BodyReq.TimeUse,
		PlayToken: token,
		Wave:      BodyReq.Wave,
	}
	err = api.Service.PlayLogCreate(req, subjectId, 0)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Play log created successfully",
	})
}
func (service *serviceStruct) PlayLogCreate(req constant.StatRequest, studentId string, arcadeGameId int) error {
	PlayTokenClaims, err := arcadehelper.ValidateJwtArcadeGameBaerer(req.PlayToken)
	if err != nil {
		return err
	}
	arcadeGameId = PlayTokenClaims.ArcadeGameId

	var msg string

	if time.Now().After(PlayTokenClaims.ExpiresAt.Time) {
		msg = "Play Token expired"
	}
	if msg != "" {
		err := service.ArcadeGameStorage.DeletePlayId(PlayTokenClaims.PlayId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		return helper.NewHttpError(http.StatusUnauthorized, &msg)
	}

	class, err := service.ArcadeGameStorage.GetClassByStudentId(studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	ReqPlayId := constant.CheckPlayIdRequest{
		PlayId:       PlayTokenClaims.PlayId,
		UserId:       studentId,
		ArcadeGameId: arcadeGameId,
	}
	result, err := service.ArcadeGameStorage.CheckPlayId(ReqPlayId)
	if err != nil {
		return err
	}
	if !result {
		msg := fmt.Sprintf("Play Id not Exist: %s", PlayTokenClaims.PlayId)
		return helper.NewHttpError(http.StatusUnauthorized, &msg)
	}
	request := constant.ScoreRequest{
		ClassId:      class,
		StudentId:    studentId,
		ArcadeGameId: arcadeGameId,
		Score:        req.Score,
		TimeUse:      req.TimeUse,
		Wave:         req.Wave,
	}
	err = service.ArcadeGameStorage.PlayLogCreate(request)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	err = service.ArcadeGameStorage.DeletePlayId(PlayTokenClaims.PlayId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
