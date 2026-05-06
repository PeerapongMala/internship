package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassroomGetRequest struct {
	ClassRoomId int `params:"classRoomId" validate:"required"`
}

// ==================== Response ==========================

type ClassroomGetResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       *constant.ClassEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A07Get
// @Tags Admin Classroom
// @Summary Get classroom
// @Description ดึงข้อมูลห้องเรียนตาม classRoomId
// @Security BearerAuth
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Success 200 {object} ClassroomGetResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId} [get]
func (api *APiStruct) ClassroomGet(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	output, err := api.Service.ClassroomGet(&ClassroomGetInput{
		ClassRoomId: request.ClassRoomId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomGetResponse{
		StatusCode: http.StatusOK,
		Data:       output.Classroom,
		Message:    "Classroom retrieved",
	})
}

// ==================== Service ==========================

type ClassroomGetInput struct {
	ClassRoomId int
}

type ClassroomGetOutput struct {
	Classroom *constant.ClassEntity
}

func (service *serviceStruct) ClassroomGet(in *ClassroomGetInput) (*ClassroomGetOutput, error) {
	classroom, err := service.storage.ClassGet(in.ClassRoomId)
	if err != nil {
		return nil, err
	}
	return &ClassroomGetOutput{
		Classroom: classroom,
	}, nil
}
