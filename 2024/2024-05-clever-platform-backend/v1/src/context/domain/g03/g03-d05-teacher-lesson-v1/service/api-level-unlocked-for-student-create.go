package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type LevelUnlockedForStudentCreateRequest struct {
	LevelId      int      `params:"levelId" validate:"required"`
	StudentIds   []string `json:"student_ids" validate:"required"`
	ClassId      int      `json:"class_id" validate:"required"`
	AdminLoginAs *string  `json:"admin_login_as"`
}

// ==================== Response ==========================

type LevelUnlockedForStudentCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelUnlockedForStudentCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelUnlockedForStudentCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LevelUnlockedForStudentCreate(&LevelUnlockedForStudentCreateInput{
		SubjectId:                            subjectId,
		LevelUnlockedForStudentCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(LevelUnlockedForStudentCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Student added",
	})
}

// ==================== Service ==========================

type LevelUnlockedForStudentCreateInput struct {
	SubjectId string
	*LevelUnlockedForStudentCreateRequest
}

func (service *serviceStruct) LevelUnlockedForStudentCreate(in *LevelUnlockedForStudentCreateInput) error {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return err
	}

	levelUnlockedForStudentList := []constant.LevelUnlockedForStudent{}
	for _, studentId := range in.StudentIds {
		levelUnlockedForStudentList = append(levelUnlockedForStudentList, constant.LevelUnlockedForStudent{
			LevelId:      in.LevelId,
			StudentId:    studentId,
			ClassId:      in.ClassId,
			CreatedAt:    time.Now().UTC(),
			CreatedBy:    in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		})
	}
	err = service.teacherLessonStorage.LevelUnlockedForStudentCreate(levelUnlockedForStudentList)
	if err != nil {
		return err
	}

	return nil
}
