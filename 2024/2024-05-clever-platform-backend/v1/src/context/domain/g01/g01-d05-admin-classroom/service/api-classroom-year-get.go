package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassroomYearGetRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
}

// ==================== Response ==========================

type ClassroomYearGetResponse struct {
	StatusCode int                           `json:"status_code"`
	Data       *ClassroomYearGetResponseData `json:"data"`
	Message    string                        `json:"message"`
}

type ClassroomYearGetResponseData struct {
	Year []string `json:"year"`
}

// ==================== Endpoint ==========================

// @Id G01D05A25Get
// @Tags Admin Classroom
// @Summary Get classroom year
// @Description ดึงข้อมูล year ของ classroom สำหรับโรงเรียนนั้นๆ
// @Security BearerAuth
// @Produce json
// @Param schoolId path int true "schoolId"
// @Success 200 {object} ClassroomYearGetResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/classrooms/year [get]
func (api *APiStruct) ClassroomYearGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomYearGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.ClassroomYearGet(&ClassroomYearGetInput{
		SchoolId: request.SchoolId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomYearGetResponse{
		StatusCode: http.StatusOK,
		Data:       &ClassroomYearGetResponseData{Year: output.Year},
		Message:    "Classroom retrieved",
	})
}

// ==================== Service ==========================

type ClassroomYearGetInput struct {
	SchoolId int
}

type ClassroomYearGetOutput struct {
	Year []string
}

func (service *serviceStruct) ClassroomYearGet(in *ClassroomYearGetInput) (*ClassroomYearGetOutput, error) {
	year, err := service.storage.ClassYearGet(in.SchoolId)
	if err != nil {
		return nil, err
	}
	return &ClassroomYearGetOutput{
		Year: year,
	}, nil
}
