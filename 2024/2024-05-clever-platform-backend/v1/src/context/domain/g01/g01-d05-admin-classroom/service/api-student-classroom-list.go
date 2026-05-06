package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type StudentClassroomListRequest struct {
	ClassRoomId int    `params:"classRoomId" validate:"required"`
	Search      string `query:"search"`
}

type StudentClassroomListResponse struct {
	StatusCode int                               `json:"status_code"`
	Pagination *helper.Pagination                `json:"_pagination"`
	Data       []constant.StudentClassroomEntity `json:"data"`
	Message    string                            `json:"message"`
}

// @Id G01D05A19List
// @Tags Admin Classroom
// @Summary List students in a classroom
// @Description แสดงรายชื่อนักเรียนในห้องเรียนที่ระบุ
// @Security BearerAuth
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param search query string false "search text"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Success 200 {object} StudentClassroomListResponse
// @Failure 400,401,403,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/students [get]
func (api *APiStruct) StudentClassroomList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &StudentClassroomListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.StudentClassroomList(&StudentClassroomListInput{
		ClassRoomId: request.ClassRoomId,
		Search:      request.Search,
		Pagination:  pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentClassroomListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.Students,
		Message:    "Data retrieved",
	})
}

type StudentClassroomListInput struct {
	ClassRoomId int
	Search      string
	Pagination  *helper.Pagination
}

type StudentClassroomListOutput struct {
	Students []constant.StudentClassroomEntity
}

func (service *serviceStruct) StudentClassroomList(in *StudentClassroomListInput) (*StudentClassroomListOutput, error) {
	students, err := service.storage.StudentListByClassroom(in.ClassRoomId, in.Search, in.Pagination)
	if err != nil {
		return nil, err
	}
	return &StudentClassroomListOutput{
		Students: students,
	}, nil
}
