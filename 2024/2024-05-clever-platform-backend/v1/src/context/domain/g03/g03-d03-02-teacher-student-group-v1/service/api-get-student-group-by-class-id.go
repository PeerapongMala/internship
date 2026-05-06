package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api apiStruct) GetStudyGroupByClassID(c *fiber.Ctx) error {
	//teacherID, ok := c.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	//if !ok {
	//	return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	//}
	//
	var params constant.GetStudentGroupMembersParams
	err := c.ParamsParser(&params)
	if err != nil {
		errMsg := "class_id and student_group_id must be numeric"
		return helper.RespondHttpError(c, helper.NewHttpErrorWithDetail(fiber.StatusBadRequest, &errMsg, err))
	}

	query, err := helper.ParseAndValidateRequest(c, &constant.GetStudentGroupMembersSearchOption{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	pagination := helper.PaginationNew(c)

	//isExist, err := api.service01.CheckStudentGroupExist(*params.StudentGroupID)
	//if err != nil {
	//	errMsg := "error check is student-group exist"
	//	return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, &errMsg))
	//}
	//if !isExist {
	//	errMsg := "student group does not exist"
	//	return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusNotFound, &errMsg))
	//
	//}

	//isAccess, err := api.service01.CheckStudentGroupAccess(*params.StudentGroupID, teacherID)
	//if err != nil {
	//	errMsg := "error check is student-group exist"
	//	return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, &errMsg))
	//}
	//if !isAccess {
	//	return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusForbidden, nil))
	//}

	result, err := api.service.GetStudentGroupMembersByStudentGroupID(
		*params.StudentGroupID,
		*query,
		pagination)
	if err != nil {
		return helper.RespondHttpError(c, helper.NewHttpError(fiber.StatusInternalServerError, nil))
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"_pagination": fiber.Map{
			"page":        pagination.Page,
			"limit":       pagination.LimitResponse,
			"total_count": pagination.TotalCount,
		},
		"status_code": fiber.StatusOK,
		"data":        result,
	})
}

// ==================== Service ==========================
func (service serviceStruct) GetStudentGroupMembersByStudentGroupID(studentGroupID int, option constant.GetStudentGroupMembersSearchOption, pagination *helper.Pagination) ([]constant.StudentGroupMember, error) {
	studyGroup, err := service.storage.StudyGroupGet(studentGroupID)
	if err != nil {
		return nil, err
	}
	return service.storage.GetStudentGroupMembersByStudentGroupID(*studyGroup, &option, pagination)
}
