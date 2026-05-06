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

type ClassroomCloneRequest struct {
	SourceClassRoomId int                   `params:"classRoomId" validate:"required"`
	AcademicYear      int                   `json:"academic_year" validate:"required"` // id ชั้นปี
	Year              string                `json:"year" validate:"required"`          // ปีการศีกษา
	Name              string                `json:"name" validate:"required"`          // ชื่อห้อง
	Status            *constant.ClassStatus `json:"status,omitempty"`
}

// ==================== Response ==========================

type ClassroomCloneResponse struct {
	StatusCode int                    `json:"status_code"`
	Data       []constant.ClassEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A08Create
// @Tags Admin Classroom
// @Summary Clone classroom
// @Description คัดลอกห้องเรียนใหม่จากห้องเรียนเดิม
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param request body ClassroomCloneRequest true "request"
// @Success 201 {object} ClassroomCloneResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/clone [post]
func (api *APiStruct) ClassroomClone(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomCloneRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	output, err := api.Service.ClassroomClone(&ClassroomCloneInput{
		SubjectId:             subjectId,
		ClassroomCloneRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(ClassroomCloneResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.ClassEntity{*output.ClassEntity},
		Message:    "Classroom created",
	})
}

// ==================== Service ==========================

type ClassroomCloneInput struct {
	SubjectId string
	*ClassroomCloneRequest
}

type ClassroomCloneOutput struct {
	*constant.ClassEntity
}

func (service *serviceStruct) ClassroomClone(in *ClassroomCloneInput) (*ClassroomCloneOutput, error) {
	now := time.Now().UTC()

	sourceClassroom, err := service.storage.ClassGet(in.SourceClassRoomId)
	if err != nil {
		msg := fmt.Sprintf("get source classroom failed")
		return nil, helper.NewHttpErrorWithDetail(http.StatusBadRequest, &msg, err)
	}
	if sourceClassroom == nil {
		msg := fmt.Sprintf("source classroom %d not found", in.SourceClassRoomId)
		return nil, helper.NewHttpErrorWithDetail(http.StatusBadRequest, &msg, nil)
	}

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
		SchoolId:     sourceClassroom.SchoolId,
		AcademicYear: in.AcademicYear,
		Year:         in.Year,
		Name:         in.Name,
		Status:       status,
		CreatedAt:    now,
		CreatedBy:    in.SubjectId,
		UpdatedAt:    &now,
		UpdatedBy:    &in.SubjectId,
	}
	classroom, err := service.storage.ClassClone(tx, sourceClassroom.Id, &classEntity)
	if err != nil {
		return nil, err
	}

	err = service.PrefillClass(&PrefillClassInput{
		Tx:       tx,
		SchoolId: sourceClassroom.SchoolId,
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

	return &ClassroomCloneOutput{
		ClassEntity: classroom,
	}, nil
}
