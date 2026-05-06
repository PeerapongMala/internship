package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type HomeworkUpdateRequest struct {
	HomeworkId int `params:"homeworkId" validate:"required"`
	*constant.HomeworkEntity
	*constant.HomeworkTemplateEntity
	UserId string
}

// ==================== Response ==========================
type HomeworkUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	err = api.Service.HomeworkUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkUpdate(in *HomeworkUpdateRequest) error {
	homework, err := service.teacherHomeworkStorage.GetHomeworkById(in.HomeworkId)
	if err != nil {
		return err
	}

	sqlTx, err := service.teacherHomeworkStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	in.HomeworkEntity.Id = &in.HomeworkId
	err = service.teacherHomeworkStorage.UpdateHomework(sqlTx, in.HomeworkEntity)
	if err != nil {
		return err
	}

	in.HomeworkTemplateEntity.Id = homework.HomeworkTemplateId
	err = service.teacherHomeworkStorage.UpdateHomeworkTemplate(sqlTx, in.HomeworkTemplateEntity)
	if err != nil {
		return err
	}

	err = service.teacherHomeworkStorage.DeleteAllHomeworkTemplateLevel(sqlTx, *homework.HomeworkTemplateId)
	if err != nil {
		return err
	}

	//add levelIds
	for _, levelId := range in.LevelIds {
		err = service.teacherHomeworkStorage.InsertHomeworkTemplateLevel(sqlTx, *homework.HomeworkTemplateId, levelId)
		if err != nil {
			return err
		}
	}

	if in.AssignedTo != nil {
		err = service.teacherHomeworkStorage.DeleteAllHomeworkAssigned(sqlTx, in.HomeworkId)
		if err != nil {
			return err
		}

		for _, classId := range in.AssignedTo.ClassIds {
			err = service.teacherHomeworkStorage.InsertHomeworkAssignedToClass(sqlTx, in.HomeworkId, classId)
			if err != nil {
				return err
			}
		}

		for _, studyGroupIds := range in.AssignedTo.StudyGroupIds {
			err = service.teacherHomeworkStorage.InsertHomeworkAssignedToStudyGroup(sqlTx, in.HomeworkId, studyGroupIds)
			if err != nil {
				return err
			}
		}

		for _, seedYearIds := range in.AssignedTo.SeedYearIds {
			err = service.teacherHomeworkStorage.InsertHomeworkAssignedToYear(sqlTx, in.HomeworkId, seedYearIds)
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
