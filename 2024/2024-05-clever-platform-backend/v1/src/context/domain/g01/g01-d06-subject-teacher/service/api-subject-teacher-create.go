package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type SubjectTeacherCreateRequest struct {
	SubjectId    int      `params:"subjectId" validate:"required"`
	TeacherIds   []string `json:"teacher_ids" validate:"required"`
	AcademicYear int      `json:"academic_year" validate:"required"`
}

// ==================== Response ==========================

type SubjectTeacherCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectTeacherCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectTeacherCreateRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.SubjectTeacherCreate(&SubjectTeacherCreateInput{
		SubjectTeacherCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubjectTeacherCreateResponse{
		StatusCode: http.StatusOK,
		Message:    "Teachers added",
	})
}

// ==================== Service ==========================

type SubjectTeacherCreateInput struct {
	*SubjectTeacherCreateRequest
}

func (service *serviceStruct) SubjectTeacherCreate(in *SubjectTeacherCreateInput) error {
	tx, err := service.subjectTeacherStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.subjectTeacherStorage.SubjectTeacherCreate(tx, in.SubjectId, in.TeacherIds, in.AcademicYear)
	if err != nil {
		return err
	}

	teacherItemGroups := []constant.TeacherItemGroupEntity{}
	for _, teacherId := range in.TeacherIds {
		teacherItemGroups = append(teacherItemGroups, constant.TeacherItemGroupEntity{
			SubjectId: &in.SubjectId,
			TeacherId: &teacherId,
		})
	}

	err = service.subjectTeacherStorage.TeacherItemGroupCreate(tx, teacherItemGroups)
	if err != nil {
		return err
	}

	err = service.subjectTeacherStorage.TeacherShopCreate(tx, teacherItemGroups)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
