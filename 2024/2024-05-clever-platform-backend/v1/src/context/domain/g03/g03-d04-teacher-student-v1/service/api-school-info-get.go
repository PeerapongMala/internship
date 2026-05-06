package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

type SchoolInfoResponse struct {
	StatusCode int                 `json:"status_code"`
	Message    string              `json:"message"`
	Pagination *helper.Pagination  `json:"_pagination"`
	Data       constant.SchoolInfo `json:"data"`
}

func (api *APIStruct) SchoolInfoGet(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	data, err := api.Service.SchoolInfoGet(teacherId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(SchoolInfoResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       *data,
	})
}

func (service *serviceStruct) SchoolInfoGet(teacherId string) (*constant.SchoolInfo, error) {
	ent, err := service.repositoryTeacherStudent.SchoolInfoGetByTeacherId(teacherId)
	if err != nil {
		return nil, err
	}
	return &constant.SchoolInfo{
		SchoolId:    ent.SchoolId,
		SchoolName:  ent.SchoolName,
		SchoolCode:  ent.SchoolCode,
		SchoolImage: ent.SchoolImage,
	}, nil
}
