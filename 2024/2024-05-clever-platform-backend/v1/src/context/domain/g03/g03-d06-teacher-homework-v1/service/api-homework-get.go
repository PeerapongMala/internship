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
type HomeworkGetRequest struct {
	HomeworkId int `params:"homeworkId" validate:"required"`
}

// ==================== Response ==========================
type HomeworkGetResponse struct {
	Data *constant.HomeworkEntity `json:"data"`
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkGet(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkGetRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.HomeworkGet(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkGetResponse{
		Data: resp,
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkGet(in *HomeworkGetRequest) (*constant.HomeworkEntity, error) {

	resp, err := service.teacherHomeworkStorage.GetHomeworkById(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	assignedResp, err := service.teacherHomeworkStorage.GetHomeworkAssignedData(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	resp.StartedAt = helper.ConvertTimeToStringTime(resp.StartedAtTime)
	resp.DueAt = helper.ConvertTimeToStringTime(resp.DueAtTime)
	resp.ClosedAt = helper.ConvertTimeToStringTime(resp.ClosedAtTime)
	resp.AssignedTo = assignedResp

	template, err := service.teacherHomeworkStorage.GetHomeworkTemplateById(helper.Deref(resp.HomeworkTemplateId))
	if err != nil {
		return nil, err
	}
	resp.HomeworkTemplate = template

	return resp, nil
}
