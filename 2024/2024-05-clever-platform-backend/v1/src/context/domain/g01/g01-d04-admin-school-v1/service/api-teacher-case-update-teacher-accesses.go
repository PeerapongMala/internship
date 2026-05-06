package service

import (
	"log"
	"net/http"
	"slices"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type TeacherCaseUpdateTeacherAccessesRequest struct {
	TeacherAccesses []int `json:"teacher_accesses" validate:"required"`
}

type TeacherCaseUpdateTeacherAccessesResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCaseUpdateTeacherAccesses(context *fiber.Ctx) error {
	userId := context.Params("userId")

	request, err := helper.ParseAndValidateRequest(context, &TeacherCaseUpdateTeacherAccessesRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherCaseUpdateTeacherAccessesOutput, err := api.Service.TeacherCaseUpdateTeacherAccesses(&TeacherCaseUpdateTeacherAccessesInput{
		UserId:                                  userId,
		TeacherCaseUpdateTeacherAccessesRequest: request,
		SubjectId:                               subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherCaseUpdateTeacherAccessesResponse{
		StatusCode: http.StatusOK,
		Data:       teacherCaseUpdateTeacherAccessesOutput.TeacherAccesses,
		Message:    "Updated",
	})
}

// ==================== Service ==========================

type TeacherCaseUpdateTeacherAccessesInput struct {
	UserId string
	*TeacherCaseUpdateTeacherAccessesRequest
	SubjectId string
}

type TeacherCaseUpdateTeacherAccessesOutput struct {
	TeacherAccesses []int
}

func (service *serviceStruct) TeacherCaseUpdateTeacherAccesses(in *TeacherCaseUpdateTeacherAccessesInput) (*TeacherCaseUpdateTeacherAccessesOutput, error) {
	roles, err := service.adminSchoolStorage.UserCaseGetUserRole(in.UserId)
	if err != nil {
		return nil, err
	}
	if !slices.Contains(roles, int(constant.Teacher)) {
		msg := "User isn't teacher"
		return nil, helper.NewHttpError(http.StatusConflict, &msg)
	}

	now := time.Now().UTC()
	userEntity := constant.UserEntity{
		Id:        in.UserId,
		UpdatedAt: &now,
		UpdatedBy: &in.SubjectId,
	}

	tx, err := service.adminSchoolStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	_, err = service.adminSchoolStorage.UserUpdate(tx, &userEntity)
	if err != nil {
		return nil, err
	}

	err = service.adminSchoolStorage.TeacherCaseUpdateTeacherAccesses(tx, in.UserId, in.TeacherAccesses)
	if err != nil {
		return nil, err
	}
	if in.TeacherAccesses == nil {
		in.TeacherAccesses = []int{}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &TeacherCaseUpdateTeacherAccessesOutput{TeacherAccesses: in.TeacherAccesses}, nil
}
