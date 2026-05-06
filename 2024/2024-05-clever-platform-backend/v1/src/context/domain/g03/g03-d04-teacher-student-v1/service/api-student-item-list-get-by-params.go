package service

import (
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudentRewardResponse struct {
	StatusCode int                 `json:"status_code"`
	Message    string              `json:"message"`
	Data       []constant.ItemInfo `json:"data"`
}

func (api *APIStruct) StudentItemListGetByParams(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYearStr := context.Params("academicYear")
	if academicYearStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYear, err := strconv.Atoi(academicYearStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	filter := constant.ItemFilter{
		Student: constant.StudentParam{
			StudentId: studentId,
		},
		AcademicYear: academicYear,
	}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if err := filter.DateFilterBase.ParseDateTimeFilter(constant.DATE_FORMAT); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.StudentItemListGetByParams(filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentRewardResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) StudentItemListGetByParams(filter constant.ItemFilter) ([]constant.ItemInfo, error) {
	filter.Student.UserId = filter.Student.StudentId
	ents, err := service.repositoryTeacherStudent.StudentItemListGetByParams(filter)
	if err != nil {
		return nil, err
	}

	resp := make([]constant.ItemInfo, len(ents))
	for i, ent := range ents {

		var usedAt *time.Time
		status := constant.ItemStatusEnum(ent.Status)
		if status.IsValid() && status == constant.ItemStatusEnum_RECEIVED {
			usedAt = ent.UpdatedAt
		}
		if ent.ItemImageUrl != "" {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(ent.ItemImageUrl)
			if err != nil {
				return nil, err
			}
			ent.ItemImageUrl = *url
		}

		resp[i] = constant.ItemInfo{
			RewardId:     ent.RewardTransactionId,
			ItemId:       ent.ItemId,
			ItemType:     ent.ItemType,
			ItemImageUrl: ent.ItemImageUrl,
			ItemName:     ent.ItemName,
			Description:  ent.Description,
			Amount:       ent.Amount,
			GivedBy:      ent.CreatedBy,
			ReceivedAt:   ent.CreatedAt,
			UsedAt:       usedAt,
		}

	}

	return resp, nil
}
