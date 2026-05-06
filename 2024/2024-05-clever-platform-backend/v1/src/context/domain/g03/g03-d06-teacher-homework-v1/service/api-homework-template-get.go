package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type HomeworkTemplateGetRequest struct {
	HomeWorkTemplateId int `params:"homeworkTemplateId" validate:"required"`
}

// ==================== Response ==========================
type HomeworkTemplateGetResponse struct {
	Data *constant.HomeworkTemplateEntity `json:"data"`
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkTemplateGet(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkTemplateGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.HomeworkTemplateGet(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkTemplateGetResponse{
		Data: resp,
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkTemplateGet(in *HomeworkTemplateGetRequest) (*constant.HomeworkTemplateEntity, error) {

	resp, err := service.teacherHomeworkStorage.GetHomeworkTemplateById(in.HomeWorkTemplateId)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
