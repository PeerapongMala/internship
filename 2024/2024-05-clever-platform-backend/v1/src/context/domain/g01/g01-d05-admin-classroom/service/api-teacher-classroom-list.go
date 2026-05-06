package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherClassroomListRequest struct {
	ClassRoomId int    `params:"classRoomId" validate:"required"`
	Search      string `query:"search"`
}

type TeacherClassroomListResponse struct {
	StatusCode int                               `json:"status_code"`
	Pagination *helper.Pagination                `json:"_pagination"`
	Data       []constant.TeacherClassroomEntity `json:"data"`
	Message    string                            `json:"message"`
}

// @Id G01D05A12List
// @Tags Admin Classroom
// @Summary List teachers in a classroom
// @Description แสดงรายการครูในห้องเรียนที่กำหนด
// @Security BearerAuth
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param search query string false "search text"
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Success 200 {object} TeacherClassroomListResponse
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/teachers [get]
func (api *APiStruct) TeacherClassroomList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request := TeacherClassroomListRequest{}
	_, err := helper.ParseAndValidateRequest(context, &request, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.TeacherClassroomList(&TeacherClassroomListInput{
		ClassRoomId: request.ClassRoomId,
		Search:      request.Search,
		Pagination:  pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherClassroomListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       output.Teachers,
		Message:    "Data retrieved",
	})
}

type TeacherClassroomListInput struct {
	ClassRoomId int
	Search      string
	Pagination  *helper.Pagination
}

type TeacherClassroomListOutput struct {
	Teachers []constant.TeacherClassroomEntity
}

func (service *serviceStruct) TeacherClassroomList(in *TeacherClassroomListInput) (*TeacherClassroomListOutput, error) {
	teachers, err := service.storage.TeacherListByClassroom(in.ClassRoomId, in.Search, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &TeacherClassroomListOutput{
		Teachers: teachers,
	}, nil
}
