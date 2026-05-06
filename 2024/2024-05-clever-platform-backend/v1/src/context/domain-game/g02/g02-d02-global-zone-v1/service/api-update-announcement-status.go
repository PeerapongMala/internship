package service

import (
	"net/http"
	"slices"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AnnouncementUpdateStatusRequest struct {
	AnnouncementId int `params:"announcementId" validate:"required"`
	UpdateType     string `query:"type" validate:"required"`
	UserId         string
}

type AnnouncementUpdateStatusResponse struct {
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) AnnouncementUpdateStatus(context *fiber.Ctx) error {

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &AnnouncementUpdateStatusRequest{UserId: userId}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	if !slices.Contains([]string{"read", "delete"}, request.UpdateType) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.AnnouncementUpdateStatus(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp := &constant.StatusResponse{
		Message:    "Success",
		StatusCode: http.StatusOK,
	}

	return context.Status(http.StatusOK).JSON(resp)
}

// ==================== Service ==========================
func (service *serviceStruct) AnnouncementUpdateStatus(in *AnnouncementUpdateStatusRequest) (error) {


	var isRead, isDeleted *bool
	
	if in.UpdateType == "read" {
		isRead = BooleanPointer(true)
	}

	if in.UpdateType == "delete" {
		isDeleted = BooleanPointer(true)
	}
	
	entity := &constant.UserAnnouncementEntity{
		UserId: &in.UserId,
		AnnouncementId: &in.AnnouncementId,
		IsRead: isRead,
		IsDeleted: isDeleted,
	}
	
	err := service.globalZoneStorage.InsertUserAnnouncement(entity)
	if err != nil {
		if !strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			return err
		}
		err = service.globalZoneStorage.UpdateUserAnnouncement(entity)
		if err != nil {
			return err
		}
	}

	return nil
}

func BooleanPointer(status bool) *bool {
	return &status
}