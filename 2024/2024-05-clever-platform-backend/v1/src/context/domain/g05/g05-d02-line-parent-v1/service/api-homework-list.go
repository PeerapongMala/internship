package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

type HomeworkRequest struct {
	StudentID string `params:"user_id" validate:"required"`
	ClassID   int    `params:"class_id" validate:"required"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) HomeworkList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &HomeworkRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.HomeworkList(request, pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) HomeworkList(req *HomeworkRequest, pagination *helper.Pagination) ([]*constant.Homework, error) {
	homeworks, err := service.lineParentStorage.HomeworkList(req.StudentID, req.ClassID, pagination)
	if err != nil {
		return nil, err
	}
	log.Println("homeworks: ", homeworks)

	for _, homework := range homeworks {
		userDataPlayHomework, err := service.lineParentStorage.GetHomeworkStatus(homework.HomeworkID, req.StudentID, req.ClassID)
		if err != nil {
			return nil, err
		}

		if userDataPlayHomework == nil {
			homework.Status = "Not Start"
			continue
		}

		status := "Not Start"
		if helper.Deref(userDataPlayHomework.LevelPlayCount) == 0 {
			status = "Not Start"
		} else if helper.Deref(userDataPlayHomework.LevelPlayCount) >= homework.LevelCount && userDataPlayHomework.MaxPlayedAt.Before(homework.DueAt) {
			status = "On Time"
		} else if helper.Deref(userDataPlayHomework.LevelPlayCount) >= homework.LevelCount && userDataPlayHomework.MaxPlayedAt.After(homework.DueAt) {
			status = "Late"
		} else if helper.Deref(userDataPlayHomework.LevelPlayCount) < homework.LevelCount {
			status = "Not Finish"
		}

		homework.Status = status
	}

	return homeworks, nil
}
