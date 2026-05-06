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
type HomeworkTemplateCreateRequest struct {
	*constant.HomeworkTemplateEntity
	UserId string
}

// ==================== Response ==========================
type HomeworkTemplateCreateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkTemplateCreate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkTemplateCreateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	err = api.Service.HomeworkTemplateCreate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkTemplateCreateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkTemplateCreate(in *HomeworkTemplateCreateRequest) error {

	sqlTx, err := service.teacherHomeworkStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	now := time.Now().UTC()
	in.CreatedAt = &now
	in.CreatedBy = &in.UserId
	in.TeacherId = &in.UserId

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

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
