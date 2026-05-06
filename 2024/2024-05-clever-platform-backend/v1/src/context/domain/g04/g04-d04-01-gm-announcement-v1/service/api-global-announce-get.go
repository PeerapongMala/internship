package service

import (
	"fmt"
	"log"
	"net/http"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) GetGlobalAnnounceById(context *fiber.Ctx) error {
	Id, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	response, err := api.Service.GetGlobalAnnounceById(Id, RolesCheck)
	if err != nil {
		if err.Error() == "not found" {
			msg := fmt.Sprintf("Announcement Id %d data not found/match", Id)
			return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusNotFound, &msg))
		}
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(constant.DataResponse{
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "Data retrived",
	})

}
func (service *serviceStruct) GetGlobalAnnounceById(AnnounceId int, Role constant.CheckRoleRequest) (*constant.GlobalAnnounceResponse, error) {
	check := false
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) || role == int(userConstant.GameMaster) {
			check = true
			break
		}
	}
	if !check {
		return nil, errors.Errorf("User is not allowed")
	}
	response, err := service.GmannounceStorage.GetGlobalAnnounceById(AnnounceId)
	if err != nil {
		if err.Error() == "not found" {
			return nil, fmt.Errorf("not found")
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	if response.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*response.ImageUrl)
		response.ImageUrl = url
		if err != nil {
			return nil, err
		}

	}
	return response, err
}
