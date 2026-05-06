package service

import (
	"fmt"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

type ClassroomCreateRequest struct {
	SchoolId     int                   `json:"school_id" validate:"required"`     // id โรงเรียน
	AcademicYear int                   `json:"academic_year" validate:"required"` // id ชั้นปี
	Year         string                `json:"year" validate:"required"`          // ปีการศีกษา
	Name         string                `json:"name" validate:"required"`          // ชื่อห้อง
	Status       *constant.ClassStatus `json:"status,omitempty"`
}

// ==================== Response ==========================

type ClassroomCreateResponse struct {
	StatusCode int                    `json:"status_code"`
	Data       []constant.ClassEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A01Create
// @Tags Admin Classroom
// @Summary Create classroom
// @Description สร้างห้องเรียนใหม่
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body ClassroomCreateRequest true "request"
// @Success 201 {object} ClassroomCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms [post]
func (api *APiStruct) ClassroomCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	output, err := api.Service.ClassroomCreate(&ClassroomCreateInput{
		SubjectId:              subjectId,
		ClassroomCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(ClassroomCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.ClassEntity{*output.ClassEntity},
		Message:    "Classroom created",
	})
}

// ==================== Service ==========================

type ClassroomCreateInput struct {
	SubjectId string
	*ClassroomCreateRequest
}

type ClassroomCreateOutput struct {
	*constant.ClassEntity
}

func (service *serviceStruct) ClassroomCreate(in *ClassroomCreateInput) (*ClassroomCreateOutput, error) {
	now := time.Now().UTC()

	status := constant.Draft
	if in.Status != nil {
		if !in.Status.IsValid() {
			msg := fmt.Sprintf("Invalid status %s", *in.Status)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		status = *in.Status
	}

	tx, err := service.storage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	classEntity := constant.ClassEntity{
		SchoolId:     in.SchoolId,
		AcademicYear: in.AcademicYear,
		Year:         in.Year,
		Name:         in.Name,
		Status:       status,
		CreatedAt:    now,
		CreatedBy:    in.SubjectId,
		UpdatedAt:    &now,
		UpdatedBy:    &in.SubjectId,
	}
	classroom, err := service.storage.ClassCreate(tx, &classEntity)
	if err != nil {
		return nil, err
	}

	err = service.PrefillClass(&PrefillClassInput{
		Tx:       tx,
		SchoolId: in.SchoolId,
		ClassId:  classroom.Id,
	})
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ClassroomCreateOutput{
		ClassEntity: classroom,
	}, nil
}
