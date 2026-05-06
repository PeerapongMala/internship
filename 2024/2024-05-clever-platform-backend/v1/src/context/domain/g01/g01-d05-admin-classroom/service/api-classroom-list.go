package service

import (
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassroomListRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
	constant.ClassroomListFilter
}

// ==================== Response ==========================

type ClassroomListResponse struct {
	StatusCode int                    `json:"status_code"`
	Pagination *helper.Pagination     `json:"_pagination"`
	Data       []constant.ClassEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A03List
// @Tags Admin Classroom
// @Summary List classrooms by school
// @Description แสดงรายการห้องเรียนในโรงเรียนที่กำหนด
// @Security BearerAuth
// @Produce json
// @Param schoolId path int true "schoolId"
// @Param status query string false "filter by status"
// @Param year query string false "filter by year"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param sort_by query int false "sort by field"
// @Param sort_order query int false "ASC or DESC"
// @Success 200 {object} ClassroomListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/classrooms [get]
func (api *APiStruct) ClassroomList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &ClassroomListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	if len(request.StartUpdatedAtStr) > 0 {
		request.StartUpdatedAt, err = time.Parse("2006-01-02", request.StartUpdatedAtStr)
		if err != nil {
			return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
		}
	}
	if len(request.EndUpdatedAtStr) > 0 {
		request.EndUpdatedAt, err = time.Parse("2006-01-02", request.EndUpdatedAtStr)
		if err != nil {
			return helper.RespondHttpError(context, helper.NewHttpErrorWithDetail(http.StatusBadRequest, nil, err))
		}
		request.EndUpdatedAt = request.EndUpdatedAt.AddDate(0, 0, 1)
	}

	output, err := api.Service.ClassroomList(&ClassroomListInput{
		Pagination: pagination,
		SchoolId:   request.SchoolId,
		Filter:     request.ClassroomListFilter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.Classrooms,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassroomListInput struct {
	SchoolId   int
	Filter     constant.ClassroomListFilter
	Pagination *helper.Pagination
}

type ClassroomListOutput struct {
	Classrooms []constant.ClassEntity
}

func (service *serviceStruct) ClassroomList(in *ClassroomListInput) (*ClassroomListOutput, error) {
	classrooms, err := service.storage.ClassList(in.SchoolId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ClassroomListOutput{
		Classrooms: classrooms,
	}, nil
}
