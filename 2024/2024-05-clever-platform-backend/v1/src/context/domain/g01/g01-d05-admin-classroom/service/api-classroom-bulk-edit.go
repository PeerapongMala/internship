package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type ClassroomBulkUpdateItem struct {
	ClassRoomId  int                   `json:"class_room_id" validate:"required"`
	AcademicYear *int                  `json:"academic_year,omitempty"`
	Year         *string               `json:"year,omitempty"`
	Name         *string               `json:"name,omitempty"`
	Status       *constant.ClassStatus `json:"status,omitempty"`
}

type ClassroomBulkUpdateRequest struct {
	SchoolId int                       `params:"schoolId" validate:"required"`
	Items    []ClassroomBulkUpdateItem `json:"items" validate:"required,dive,required"`
}

// ==================== Response ==========================

type ClassroomBulkUpdateResponse struct {
	StatusCode int                    `json:"status_code"`
	Data       []constant.ClassEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

// @Id G01D05A04Update
// @Tags Admin Classroom
// @Summary Bulk update classrooms by school
// @Description อัพเดทห้องเรียนหลายห้องพร้อมกัน
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param schoolId path int true "schoolId"
// @Param request body ClassroomBulkUpdateRequest true "request"
// @Success 200 {object} ClassroomBulkUpdateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/schools/{schoolId}/classrooms/bulk-edit [patch]
func (api *APiStruct) ClassroomBulkUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomBulkUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		msg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	output, err := api.Service.ClassroomBulkUpdate(&ClassroomBulkUpdateInput{
		SubjectId: subjectId,
		SchoolId:  request.SchoolId,
		Items:     request.Items,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomBulkUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       output.Classrooms,
		Message:    "Classrooms bulk updated",
	})
}

// ==================== Service ==========================

type ClassroomBulkUpdateInput struct {
	SubjectId string
	SchoolId  int
	Items     []ClassroomBulkUpdateItem
}

type ClassroomBulkUpdateOutput struct {
	Classrooms []constant.ClassEntity
}

func (service *serviceStruct) ClassroomBulkUpdate(in *ClassroomBulkUpdateInput) (*ClassroomBulkUpdateOutput, error) {
	var updatedClasses []constant.ClassEntity

	tx, err := service.storage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	for i, item := range in.Items {
		classroom, err := service.storage.ClassGet(item.ClassRoomId)
		if err != nil {
			return nil, err
		}
		if classroom.SchoolId != in.SchoolId {
			msg := fmt.Sprintf("Classroom %d at index %d does not belong to school %d", item.ClassRoomId, i, in.SchoolId)
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		// update fields
		if item.AcademicYear != nil {
			classroom.AcademicYear = *item.AcademicYear
		}
		if item.Year != nil {
			classroom.Year = *item.Year
		}
		if item.Name != nil {
			classroom.Name = *item.Name
		}
		if item.Status != nil {
			if !constant.ValidateClassStatus(classroom.Status, *item.Status) {
				msg := fmt.Sprintf("Classroom %d at index %d cannot change status from %s to %s", item.ClassRoomId, i, classroom.Status, *item.Status)
				return nil, helper.NewHttpError(http.StatusConflict, &msg)
			}
			classroom.Status = *item.Status
		}

		now := time.Now().UTC()
		classroom.UpdatedAt = &now
		classroom.UpdatedBy = &in.SubjectId

		updatedClass, err := service.storage.ClassUpdate(tx, classroom)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		updatedClasses = append(updatedClasses, *updatedClass)
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return &ClassroomBulkUpdateOutput{
		Classrooms: updatedClasses,
	}, nil
}
