package service

import (
	"errors"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================

func (api *APIStruct) LessonProgress(context *fiber.Ctx) (err error) {
	pagination := helper.PaginationNew(context)

	filter, err := helper.ParseAndValidateRequest(context, &constant.OverViewStatusFilter{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	result, err := api.Service.LessonProgress(filter, pagination)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (service serviceStruct) LessonProgress(in *constant.OverViewStatusFilter, pagination *helper.Pagination) ([]*constant.LessonScore, error) {
	if in.EndedAt < in.StartedAt || (in.StartedAt == "" && in.EndedAt != "") {
		return nil, errors.New("Date incorrect")
	}

	data_start, err := service.lineParentStorage.TotalScoreOfLessonByDate(in, "start", pagination)
	if err != nil {
		return nil, err
	}

	data_end, err := service.lineParentStorage.TotalScoreOfLessonByDate(in, "end", pagination)
	if err != nil {
		return nil, err
	}

	var data []*constant.LessonScore
	for i := 0; i < len(data_start); i++ {
		var progress int
		if data_start[i].Score == 0 && data_end[i].Score == 0 {
			progress = 0
		} else if data_start[i].Score == 0 && data_end[i].Score != 0 {
			progress = 100
		} else {
			progress = ((data_end[i].Score - data_start[i].Score) * 100) / data_start[i].Score
		}

		data = append(data, &constant.LessonScore{
			LessonID:   data_start[i].LessonID,
			LessonName: data_start[i].LessonName,
			Score:      progress,
		})
	}

	return data, nil
}
