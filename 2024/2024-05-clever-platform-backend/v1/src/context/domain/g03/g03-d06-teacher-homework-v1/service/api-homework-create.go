package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type HomeworkCreateRequest struct {
	*constant.HomeworkEntity
	*constant.HomeworkTemplateEntity
	UserId string
}

// ==================== Response ==========================
type HomeworkCreateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkCreateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	startedAtTime, err := helper.ConvertTimeStringToTime(request.HomeworkEntity.StartedAt)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	dueAtTime, err := helper.ConvertTimeStringToTime(request.HomeworkEntity.DueAt)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	closedAtTime, err := helper.ConvertTimeStringToTime(request.HomeworkEntity.ClosedAt)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.UserId = userId
	request.StartedAtTime = startedAtTime
	request.ClosedAtTime = closedAtTime
	request.DueAtTime = dueAtTime
	err = api.Service.HomeworkCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkCreate(in *HomeworkCreateRequest) error {

	sqlTx, err := service.teacherHomeworkStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	now := time.Now().UTC()
	in.HomeworkEntity.CreatedAt = &now
	in.HomeworkEntity.CreatedBy = &in.UserId

	in.HomeworkTemplateEntity.TeacherId = &in.UserId
	in.HomeworkTemplateEntity.CreatedAt = &now
	in.HomeworkTemplateEntity.CreatedBy = &in.UserId
	insertedId, err := service.teacherHomeworkStorage.InsertHomeworkTemplate(sqlTx, in.HomeworkTemplateEntity)
	if err != nil {
		return err
	}

	//add levelIds
	for _, levelId := range in.LevelIds {
		err = service.teacherHomeworkStorage.InsertHomeworkTemplateLevel(sqlTx, insertedId, levelId)
		if err != nil {
			return err
		}
	}

	in.HomeworkEntity.HomeworkTemplateId = &insertedId
	insertedId, err = service.teacherHomeworkStorage.InsertHomework(sqlTx, in.HomeworkEntity)
	if err != nil {
		return err
	}

	if in.AssignedTo != nil {
		for _, classId := range in.AssignedTo.ClassIds {
			err = service.teacherHomeworkStorage.InsertHomeworkAssignedToClass(sqlTx, insertedId, classId)
			if err != nil {
				return err
			}
		}

		for _, studyGroupIds := range in.AssignedTo.StudyGroupIds {
			err = service.teacherHomeworkStorage.InsertHomeworkAssignedToStudyGroup(sqlTx, insertedId, studyGroupIds)
			if err != nil {
				return err
			}
		}

		for _, seedYearIds := range in.AssignedTo.SeedYearIds {
			err = service.teacherHomeworkStorage.InsertHomeworkAssignedToYear(sqlTx, insertedId, seedYearIds)
			if err != nil {
				return err
			}
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
