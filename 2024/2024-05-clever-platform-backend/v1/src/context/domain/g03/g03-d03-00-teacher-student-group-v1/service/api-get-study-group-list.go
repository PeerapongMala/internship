package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api apiStruct) GetStudyGroupList(c *fiber.Ctx) error {
	teacherId, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(c, &constant.GetStudentGroupListRequest{}, helper.ParseOptions{
		Params: true,
		Query:  true,
	})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	pagination := helper.PaginationNew(c)

	results, err := api.service.GetStudyGroupList(&constant.GetStudyGroupListFilter{
		TeacherID:      teacherId,
		SchoolID:       request.SchoolIDParams.SchoolID,
		Status:         request.Status,
		Year:           request.Year,
		SubjectID:      request.SubjectID,
		StudyGroupName: request.StudyGroupName,
		AcademicYear:   request.AcademicYear,
		Class:          request.Class,
		ClassId:        request.ClassId,
	}, pagination)
	if err != nil {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	datas := []constant.StudentGroupResult{}
	if len(results) > 0 {
		datas = results
	}

	return c.Status(fiber.StatusOK).JSON(&fiber.Map{
		"_pagination": pagination,
		"status_code": fiber.StatusOK,
		"data":        datas,
	})

}

// ==================== Service ==========================
func (service *serviceStruct) GetStudyGroupList(filter *constant.GetStudyGroupListFilter, pagination *helper.Pagination) ([]constant.StudentGroupResult, error) {
	return service.storage.GetStudyGroupList(filter, pagination)
}
