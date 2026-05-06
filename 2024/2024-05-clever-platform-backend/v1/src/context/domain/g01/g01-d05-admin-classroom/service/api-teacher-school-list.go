package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type TeacherSchoolListRequest struct {
	SchoolId           int    `params:"schoolId" validate:"required"`
	Search             string `query:"search"`
	ExcludeClassroomId int    `query:"excludeClassroom"`
}

// ==================== Response ==========================

type TeacherSchoolListResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.TeacherEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A09List
// @Tags Admin Classroom
// @Summary List teachers by school
// @Description แสดงรายการครูของโรงเรียนที่ระบุ
// @Security BearerAuth
// @Produce json
// @Param schoolId path int true "schoolId"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Success 200 {object} TeacherSchoolListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/teachers [get]
func (api *APiStruct) TeacherSchoolList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &TeacherSchoolListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.TeacherSchoolList(&TeacherListInput{
		SchoolId:           request.SchoolId,
		Search:             request.Search,
		ExcludeClassroomId: request.ExcludeClassroomId,
		Pagination:         pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherSchoolListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.Teachers,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type TeacherListInput struct {
	SchoolId           int
	Search             string
	ExcludeClassroomId int
	Pagination         *helper.Pagination
}

type TeacherListOutput struct {
	Teachers []constant.TeacherEntity
}

func (service *serviceStruct) TeacherSchoolList(in *TeacherListInput) (*TeacherListOutput, error) {
	teachers, err := service.storage.TeacherListBySchool(in.SchoolId, in.Search, in.ExcludeClassroomId, in.Pagination)
	if err != nil {
		return nil, err
	}
	return &TeacherListOutput{
		Teachers: teachers,
	}, nil
}
