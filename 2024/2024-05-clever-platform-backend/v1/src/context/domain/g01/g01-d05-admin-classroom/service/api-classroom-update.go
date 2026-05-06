package service

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassroomUpdateRequest struct {
	ClassRoomId  int                   `params:"classroomId" validate:"required"`
	AcademicYear *int                  `json:"academic_year,omitempty"`
	Year         *string               `json:"year,omitempty"`
	Name         *string               `json:"name,omitempty"`
	Status       *constant.ClassStatus `json:"status,omitempty"`
}

// ==================== Response ==========================

type ClassroomUpdateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       *constant.ClassEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A02Update
// @Tags Admin Classroom
// @Summary Update classroom
// @Description อัพเดทข้อมูลห้องเรียนบางส่วน
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param request body ClassroomUpdateRequest true "request"
// @Success 200 {object} ClassroomUpdateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId} [patch]
func (api *APiStruct) ClassroomUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	output, err := api.Service.ClassroomUpdate(&ClassroomUpdateInput{
		SubjectId:              subjectId,
		ClassroomUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       output.ClassEntity,
		Message:    "Classroom updated",
	})
}

// ==================== Service ==========================

type ClassroomUpdateInput struct {
	SubjectId string
	*ClassroomUpdateRequest
}

type ClassroomUpdateOutput struct {
	*constant.ClassEntity
}

func (service *serviceStruct) ClassroomUpdate(in *ClassroomUpdateInput) (*ClassroomUpdateOutput, error) {
	classroom, err := service.storage.ClassGet(in.ClassRoomId)
	if err != nil {
		return nil, err
	}

	if in.AcademicYear != nil {
		classroom.AcademicYear = *in.AcademicYear
	}
	if in.Year != nil {
		classroom.Year = *in.Year
	}
	if in.Name != nil {
		classroom.Name = *in.Name
	}
	if in.Status != nil {
		if !constant.ValidateClassStatus(classroom.Status, *in.Status) {
			msg := fmt.Sprintf("Cannot change status from %s to %s", classroom.Status, *in.Status)
			return nil, helper.NewHttpError(http.StatusConflict, &msg)
		}
		classroom.Status = *in.Status
	}

	now := time.Now().UTC()
	classroom.UpdatedAt = &now
	classroom.UpdatedBy = &in.SubjectId

	classroom, err = service.storage.ClassUpdate(nil, classroom)
	if err != nil {
		return nil, err
	}

	return &ClassroomUpdateOutput{
		ClassEntity: classroom,
	}, nil
}
