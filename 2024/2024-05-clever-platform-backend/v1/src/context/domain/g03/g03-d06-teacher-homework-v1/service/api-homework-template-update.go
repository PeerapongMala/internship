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
type HomeworkTemplateUpdateRequest struct {
	HomeWorkTemplateId int `params:"homeworkTemplateId" validate:"required"`
	*constant.HomeworkTemplateEntity
	UserId string
}

// ==================== Response ==========================
type HomeworkTemplateUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkTemplateUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkTemplateUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserId = userId
	request.Id = &request.HomeWorkTemplateId
	err = api.Service.HomeworkTemplateUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkTemplateUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkTemplateUpdate(in *HomeworkTemplateUpdateRequest) error {

	sqlTx, err := service.teacherHomeworkStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	now := time.Now().UTC()
	in.UpdatedAt = &now
	in.UpdatedBy = &in.UserId
	in.TeacherId = &in.UserId

	err = service.teacherHomeworkStorage.UpdateHomeworkTemplate(sqlTx, in.HomeworkTemplateEntity)
	if err != nil {
		return err
	}

	//delete templateLevels before insert
	err = service.teacherHomeworkStorage.DeleteAllHomeworkTemplateLevel(sqlTx, in.HomeWorkTemplateId)
	if err != nil {
		return err
	}

	//add levelIds
	for _, levelId := range in.LevelIds {
		err = service.teacherHomeworkStorage.InsertHomeworkTemplateLevel(sqlTx, in.HomeWorkTemplateId, levelId)
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
