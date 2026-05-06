package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
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

func (api *APIStruct) AnnouncerList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	announcerFilter := constant.AnnouncerFilter{}
	err := context.QueryParser(&announcerFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	announcerListOutput, err := api.Service.AnnouncerList(&AnnouncerListInput{
		Filter:     &announcerFilter,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(AnnouncerListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       announcerListOutput.Announcers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type AnnouncerListInput struct {
	Filter     *constant.AnnouncerFilter
	Pagination *helper.Pagination
}

type AnnouncerListOutput struct {
	Announcers []constant.UserEntity
}

func (service *serviceStruct) AnnouncerList(in *AnnouncerListInput) (*AnnouncerListOutput, error) {
	announcers, err := service.adminSchoolStorage.AnnouncerList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, announcer := range announcers {
		if announcer.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*announcer.ImageUrl)
			if err != nil {
				return nil, err
			}
			announcers[i].ImageUrl = url
		}
	}

	return &AnnouncerListOutput{
		Announcers: announcers,
	}, nil
}
