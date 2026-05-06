package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

var MINIMUM_YEAR_DETAIL_INFO = 2567

type StudentLevelClassListGetByStudentIdData struct {
	*constant.LevelClass
	IsEnableDetail bool `json:"is_enable_detail"`
}

type StudentLevelClassListGetByStudentIdResponse struct {
	StatusCode int                                       `json:"status_code"`
	Message    string                                    `json:"message"`
	Pagination *helper.Pagination                        `json:"_pagination"`
	Data       []StudentLevelClassListGetByStudentIdData `json:"data"`
}

func (api *APIStruct) StudentLevelClassListGetByStudentId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")

	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)

	levelClassList, err := api.Service.StudentLevelClassListGetByStudentId(studentId, teacherId, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	var data = make([]StudentLevelClassListGetByStudentIdData, 0)
	for _, levelClass := range levelClassList {
		data = append(data, StudentLevelClassListGetByStudentIdData{
			LevelClass:     &levelClass,
			IsEnableDetail: levelClass.AcademicYear >= MINIMUM_YEAR_DETAIL_INFO,
		})
	}

	return context.Status(http.StatusOK).JSON(StudentLevelClassListGetByStudentIdResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Pagination: pagination,
		Data:       data,
	})
}

func (service *serviceStruct) StudentLevelClassListGetByStudentId(studentId, teacherId string, pagination *helper.Pagination) ([]constant.LevelClass, error) {
	student, err := service.repositoryTeacherStudent.StudentByStudentId(studentId)
	if err != nil {
		return nil, err
	}

	return service.repositoryTeacherStudent.LevelClassListByStudentId(student.Id, teacherId, pagination)
}
