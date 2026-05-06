package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Endpoint ==========================
func (api *APIStruct) OverViewHomeworkStatus(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &HomeworkRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.OverViewHomeworkStatus(request)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) OverViewHomeworkStatus(req *HomeworkRequest) ([]*constant.OverViewStatus, error) {
	homeworks, err := service.lineParentStorage.HomeworkList(req.StudentID, req.ClassID, nil)
	if err != nil {
		return nil, err
	}

	mapStatus := map[string]int{
		"Not Finish": 0,
		"On Time":    0,
		"Late":       0,
		"Not Start":  0,
	}
	for _, homework := range homeworks {
		log.Println("HomeworkID: ", homework.HomeworkID)
		userDataPlayHomework, err := service.lineParentStorage.GetHomeworkStatus(homework.HomeworkID, req.StudentID, req.ClassID)
		if err != nil {
			return nil, err
		}

		var levelPlayCount int
		var maxPlayedAt *time.Time
		if userDataPlayHomework != nil {
			levelPlayCount = helper.Deref(userDataPlayHomework.LevelPlayCount)
			maxPlayedAt = userDataPlayHomework.MaxPlayedAt
		} else {
			levelPlayCount = 0
		}

		switch {
		case levelPlayCount == 0:
			mapStatus["Not Start"]++
		case levelPlayCount >= homework.LevelCount && maxPlayedAt.Before(homework.DueAt):
			mapStatus["On Time"]++
		case levelPlayCount >= homework.LevelCount && maxPlayedAt.After(homework.DueAt):
			mapStatus["Late"]++
		case levelPlayCount < homework.LevelCount:
			mapStatus["Not Finish"]++
		}

	}

	overViewStatus := make([]*constant.OverViewStatus, 0, len(mapStatus))
	for status, count := range mapStatus {
		overView := constant.OverViewStatus{
			StatusName: status,
			Count:      count,
			Total:      len(homeworks),
		}
		overViewStatus = append(overViewStatus, &overView)
	}

	return overViewStatus, nil
}
