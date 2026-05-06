package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type StudentListResponse struct {
	StatusCode int                             `json:"status_code"`
	Pagination *helper.Pagination              `json:"_pagination"`
	Data       []constant.StudentDataWithOAuth `json:"data"`
	Message    string                          `json:"message"`
}

// ==================== Endpoint ==========================

// @Id StudentList
// @Tags Users
// @Summary List Student
// @Description list รายชื่อของนักเรียน
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param school_id query int false "Id ของโรงเรียน"
// @Param student_id query string false "รหัสนักเรียน"
// @Param status query string false "สถานะ (enabled / disabled / draft)"
// @Param school_code query string false "รหัสย่อโรงเรียน"
// @Param first_name query string false "ชื่อนักเรียน"
// @Success 200 {object} StudentListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /users/v1/student [get]
func (api *APIStruct) StudentList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	studentFilter := constant.StudentFilter{}
	err := context.QueryParser(&studentFilter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studentData, err := api.Service.StudentList(&studentFilter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       studentData,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (serviceStruct *serviceStruct) StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentDataWithOAuth, error) {
	studentData, err := serviceStruct.adminUserAccountStorage.StudentList(filter, pagination)
	if err != nil {
		return nil, err
	}

	return studentData, nil
}
