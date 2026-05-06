package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type AnnouncerListResponse struct {
	StatusCode int                   `json:"status_code"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

// @Id AnnouncerList
// @Tags Users
// @Summary List Announcer
// @Description list รายชื่อของฝ่ายประชาสัมพันธ์
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param status query string false "status (enabled / disabled / draft)"
// @Success 200 {object} AnnouncerListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /users/v1/announcer [get]
func (api *APIStruct) AnnouncerList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	announcerFilter := constant.AnnouncerFilter{}
	err := context.QueryParser(&announcerFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	announcers, err := api.Service.AnnouncerList(&announcerFilter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(AnnouncerListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       announcers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) AnnouncerList(filter *constant.AnnouncerFilter, pagination *helper.Pagination) ([]constant.UserEntity, error) {
	announcers, err := service.adminUserAccountStorage.AnnouncerList(filter, pagination)
	if err != nil {
		return nil, err
	}

	return announcers, nil
}
