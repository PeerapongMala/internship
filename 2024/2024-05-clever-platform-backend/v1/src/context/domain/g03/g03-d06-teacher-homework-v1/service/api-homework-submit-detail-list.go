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
type HomeworkSubmitDetailListRequest struct {
	HomeworkId int `params:"homeworkId" validate:"required"`
	*constant.HomeworkSubmitDetailListFilter
}

// ==================== Response ==========================
type HomeworkSubmitDetailListResponse struct {
	Data []constant.HomeworkSubmitDetailResponse `json:"data"`
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkSubmitDetailList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &HomeworkSubmitDetailListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.HomeworkSubmitDetailList(&HomeworkSubmitDetailListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkSubmitDetailListResponse{
		Data: resp.HomeworkSubmitDetails,
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

type HomeworkSubmitDetailListInput struct {
	*HomeworkSubmitDetailListRequest
}

type HomeworkSubmitDetailListOutput struct {
	HomeworkSubmitDetails []constant.HomeworkSubmitDetailResponse
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkSubmitDetailList(in *HomeworkSubmitDetailListInput) (*HomeworkSubmitDetailListOutput, error) {

	homeworkData, err := service.teacherHomeworkStorage.GetHomeworkById(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	levelIds, err := service.teacherHomeworkStorage.GetLevelsByHomeworkId(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	assignedResp, err := service.teacherHomeworkStorage.GetHomeworkAssignedData(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	studentIds, err := service.teacherHomeworkStorage.GetAllStudentIds(assignedResp.SeedYearIds, assignedResp.StudyGroupIds, assignedResp.ClassIds, in.SchoolId)
	if err != nil {
		return nil, err
	}

	userDataPlayHomeworks, err := service.teacherHomeworkStorage.GetUserDataAndPlayWithHomeworkIdAndStudentIds(in.HomeworkId, studentIds, in.HomeworkSubmitDetailListFilter)
	if err != nil {
		return nil, err
	}

	levelCount := len(levelIds)
	dueAt := helper.Deref(homeworkData.DueAtTime)
	resp := []constant.HomeworkSubmitDetailResponse{}
	for _, userDataPlayHomework := range userDataPlayHomeworks {

		starCount, err := service.teacherHomeworkStorage.GetStarCountByLevelIdsAndHomeworkId(in.HomeworkId, levelIds, helper.Deref(userDataPlayHomework.UserId))
		if err != nil {
			return nil, err
		}

		status := "Not Start"
		if helper.Deref(userDataPlayHomework.LevelPlayCount) >= levelCount && userDataPlayHomework.MaxPlayedAt != nil && userDataPlayHomework.MaxPlayedAt.Before(dueAt) {
			status = "On Time"
		} else if helper.Deref(userDataPlayHomework.LevelPlayCount) >= levelCount && userDataPlayHomework.MaxPlayedAt != nil && userDataPlayHomework.MaxPlayedAt.After(dueAt) {
			status = "Late"
		} else if helper.Deref(userDataPlayHomework.LevelPlayCount) < levelCount && helper.Deref(userDataPlayHomework.LevelPlayCount) != 0 {
			status = "Not Finish"
		} else if helper.Deref(userDataPlayHomework.LevelPlayCount) == 0 {
			status = "Not Start"
		}

		//filter status logic
		if in.Status != "" && in.Status != status {
			continue
		}

		resp = append(resp, constant.HomeworkSubmitDetailResponse{
			UserId:       userDataPlayHomework.UserId,
			StudentNo:    userDataPlayHomework.StudentNo,
			Title:        userDataPlayHomework.Title,
			FirstName:    userDataPlayHomework.FirstName,
			StarCount:    starCount,
			MaxStarCount: 3 * levelCount,
			LastName:     userDataPlayHomework.LastName,
			SubmittedAt:  userDataPlayHomework.MaxPlayedAt,
			Status:       &status,
		})
	}

	return &HomeworkSubmitDetailListOutput{
		HomeworkSubmitDetails: resp,
	}, nil
}
