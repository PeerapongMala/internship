package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type TeacherCreateRequest struct {
	ClassRoomId int      `params:"classRoomId" validate:"required"`
	Teachers    []string `json:"teacher_ids" validate:"required,min=1,dive,required"`
}

// ==================== Response ==========================

type TeacherCreateResponse struct {
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A10Create
// @Tags Admin Classroom
// @Summary Create teachers in a classroom
// @Description เพิ่มครูเข้าไปในห้องเรียน
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param request body TeacherCreateRequest true "request"
// @Success 201 {object} TeacherCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/teachers [post]
func (api *APiStruct) TeacherCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.TeacherCreate(&TeacherCreateInput{
		SubjectId:   subjectId,
		ClassRoomId: request.ClassRoomId,
		Teachers:    request.Teachers,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(TeacherCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Teachers added to classroom",
	})
}

// ==================== Service ==========================

type TeacherCreateInput struct {
	SubjectId   string
	ClassRoomId int
	Teachers    []string
}

func (service *serviceStruct) TeacherCreate(in *TeacherCreateInput) error {

	classroom, err := service.storage.ClassGet(in.ClassRoomId)
	if err != nil {
		return err
	}
	if classroom == nil {
		msg := "classroom not found"
		return helper.NewHttpError(http.StatusNotFound, &msg)
	}

	for _, id := range in.Teachers {
		teacher, err := service.storage.TeacherGetByUserIdAndClassroom(nil, classroom.Id, id)
		if err != nil {
			return err
		}
		if teacher != nil {
			msg := fmt.Sprintf("teacher id %s already exists", id)
			return helper.NewHttpError(http.StatusConflict, &msg)
		}
	}

	err = service.storage.TeacherAddToClassroom(nil, classroom.Id, in.Teachers...)
	if err != nil {
		return err
	}

	return nil
}
