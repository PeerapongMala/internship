package service

import (
	"database/sql"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
)

type StudentCreateRequest struct {
	ClassRoomId int      `params:"classRoomId" validate:"required"`
	StudentIds  []string `json:"student_ids" validate:"required,min=1,dive,required"`
}

type StudentCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// @Id G01D05A18Create
// @Tags Admin Classroom
// @Summary Add students to a classroom
// @Description เพิ่มนักเรียนหลายคนในห้องเรียนที่ระบุ
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param classRoomId path int true "classRoomId"
// @Param request body StudentCreateRequest true "request"
// @Success 201 {object} StudentCreateResponse
// @Failure 400,401,403,409,500 {object} helper.HttpErrorResponse
// @Router /admin-classroom/v1/classrooms/{classRoomId}/students [post]
func (api *APiStruct) StudentCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.StudentCreate(&StudentCreateInput{
		ClassRoomId: request.ClassRoomId,
		StudentIds:  request.StudentIds,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(StudentCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Students added successfully",
	})
}

type StudentCreateInput struct {
	ClassRoomId int
	StudentIds  []string
}

func (service *serviceStruct) StudentCreate(in *StudentCreateInput) error {
	classroom, err := service.storage.ClassGet(in.ClassRoomId)
	if err != nil {
		return err
	}
	if classroom == nil {
		msg := "classroom not found"
		return helper.NewHttpError(http.StatusNotFound, &msg)
	}

	tx, err := service.storage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	for _, id := range in.StudentIds {
		teacher, err := service.storage.StudentGetByUserIdAndClassroom(tx, classroom.Id, id)
		if err != nil {
			return err
		}
		if teacher != nil {
			msg := fmt.Sprintf("student id %s already exists", id)
			return helper.NewHttpError(http.StatusConflict, &msg)
		}

		classId, err := service.storage.StudentClassCheck(id, classroom.AcademicYear)
		if err != nil && !errors.Is(err, sql.ErrNoRows) {
			return err
		}
		if classId != nil {
			msg := fmt.Sprintf("student id %s already exist in class id %d", id, *classId)
			return helper.NewHttpError(http.StatusConflict, &msg)
		}

		err = service.storage.StudentAddToClassroom(tx, in.ClassRoomId, id)
		if err != nil {
			return errors.Wrap(err, fmt.Sprintf("Student id %s add to class room id %d failed", id, in.ClassRoomId))
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
