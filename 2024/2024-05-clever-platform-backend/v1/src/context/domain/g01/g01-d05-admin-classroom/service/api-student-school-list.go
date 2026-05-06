package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentSchoolListRequest struct {
	SchoolId           int    `params:"schoolId" validate:"required"`
	Search             string `query:"search"`
	ExcludeClassroomId int    `query:"excludeClassroom"`
}

type StudentSchoolListResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.StudentSearchEntity `json:"data"`
	Message    string                         `json:"message"`
}

// @Id G01D05A16List
// @Tags Admin Classroom
// @Summary List students in a school
// @Description แสดงรายชื่อนักเรียนทั้งหมดในโรงเรียนที่ระบุ
// @Security BearerAuth
// @Produce json
// @Param schoolId path int true "schoolId"
// @Param search query string false "search text"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Success 200 {object} StudentSchoolListResponse
// @Failure 400,401,403,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/students [get]
func (api *APiStruct) StudentSchoolList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &StudentSchoolListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.StudentSchoolList(&StudentListInput{
		SchoolId:           request.SchoolId,
		Search:             request.Search,
		ExcludeClassroomId: request.ExcludeClassroomId,
		Pagination:         pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentSchoolListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.Students,
		Message:    "Data retrieved",
	})
}

type StudentListInput struct {
	SchoolId           int
	Search             string
	ExcludeClassroomId int
	Pagination         *helper.Pagination
}

type StudentListOutput struct {
	Students []constant.StudentSearchEntity
}

func (service *serviceStruct) StudentSchoolList(in *StudentListInput) (*StudentListOutput, error) {
	students, err := service.storage.StudentListBySchool(in.SchoolId, in.Search, in.ExcludeClassroomId, in.Pagination)
	if err != nil {
		return nil, err
	}
	return &StudentListOutput{
		Students: students,
	}, nil
}
