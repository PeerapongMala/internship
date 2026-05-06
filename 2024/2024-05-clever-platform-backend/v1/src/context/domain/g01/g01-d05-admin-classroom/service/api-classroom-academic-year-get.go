package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassroomAcademicYearGetRequest struct {
	SchoolId int `params:"schoolId" validate:"required"`
}

// ==================== Response ==========================

type ClassroomAcademicYearGetResponse struct {
	StatusCode int                                   `json:"status_code"`
	Data       *ClassroomAcademicYearGetResponseData `json:"data"`
	Message    string                                `json:"message"`
}

type ClassroomAcademicYearGetResponseData struct {
	AcademicYear []string `json:"academic_year"`
}

// ==================== Endpoint ==========================

// @Id G01D05A25Get
// @Tags Admin Classroom
// @Summary Get classroom academic year
// @Description ดึงข้อมูล academic year ของ classroom สำหรับโรงเรียนนั้นๆ
// @Security BearerAuth
// @Produce json
// @Param schoolId path int true "schoolId"
// @Success 200 {object} ClassroomAcademicYearGetResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/classrooms/academic-year [get]
func (api *APiStruct) ClassroomAcademicYearGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomAcademicYearGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.ClassroomAcademicYearGet(&ClassroomAcademicYearGetInput{
		SchoolId: request.SchoolId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomAcademicYearGetResponse{
		StatusCode: http.StatusOK,
		Data:       &ClassroomAcademicYearGetResponseData{AcademicYear: output.AcademicYear},
		Message:    "Classroom retrieved",
	})
}

// ==================== Service ==========================

type ClassroomAcademicYearGetInput struct {
	SchoolId int
}

type ClassroomAcademicYearGetOutput struct {
	AcademicYear []string
}

func (service *serviceStruct) ClassroomAcademicYearGet(in *ClassroomAcademicYearGetInput) (*ClassroomAcademicYearGetOutput, error) {
	academicYear, err := service.storage.ClassroomAcademicYearGet(in.SchoolId)
	if err != nil {
		return nil, err
	}
	return &ClassroomAcademicYearGetOutput{
		AcademicYear: academicYear,
	}, nil
}
