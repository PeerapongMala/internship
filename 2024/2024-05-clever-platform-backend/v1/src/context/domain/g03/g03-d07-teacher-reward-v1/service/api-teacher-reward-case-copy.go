package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type TeacherRewardCaseCopyRequest struct {
	Id int `params:"teacherRewardId" validate:"required"`
}

type TeacherRewardCaseCopyResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.TeacherReward `json:"data"`
	Message    string                   `json:"message"`
}

func (api *APIStruct) TeacherRewardCaseCopy(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherRewardCaseCopyRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherRewardCaseCopyOutput, err := api.Service.TeacherRewardCaseCopy(&TeacherRewardCaseCopyInput{
		TeacherId:                    subjectId,
		TeacherRewardCaseCopyRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusCreated).JSON(TeacherRewardCaseCopyResponse{
		StatusCode: fiber.StatusCreated,
		Data:       []constant.TeacherReward{*teacherRewardCaseCopyOutput.TeacherReward},
		Message:    "Data retrieved",
	})
}

type TeacherRewardCaseCopyInput struct {
	TeacherId string
	*TeacherRewardCaseCopyRequest
}

type TeacherRewardCaseCopyOutput struct {
	*constant.TeacherReward
}

func (service *serviceStruct) TeacherRewardCaseCopy(in *TeacherRewardCaseCopyInput) (*TeacherRewardCaseCopyOutput, error) {
	teacherReward, err := service.teacherRewardStorage.TeacherRewardGet(in.Id)
	if err != nil {
		return nil, err
	}

	if teacherReward.RewardImage != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*teacherReward.RewardImage)
		if err != nil {
			return nil, err
		}
		teacherReward.RewardImage = url
	}
	return &TeacherRewardCaseCopyOutput{
		TeacherReward: teacherReward,
	}, nil
}
