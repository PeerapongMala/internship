package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetUserInfo(context *fiber.Ctx) error {
	log.Print(1)
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, err := api.Service.UserInfoGet(subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "data received",
	})
}
func (service *serviceStruct) UserInfoGet(studentId string) (*constant.UserResponse, error) {
	response, err := service.arcadeGameStorage.UserInfoGet(studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if response.UserImage != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*response.UserImage)
		if err != nil {
			return nil, err
		}
		response.UserImage = url
	}
	return response, nil
}
