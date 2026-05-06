package service

import (
	"log"
	"net/http"
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type HomeworkStudentListListRequest struct {
	HomeworkId int    `params:"homeworkId" validate:"required"`
	StudentId  string `params:"studentId" validate:"required"`
}

// ==================== Response ==========================
type HomeworkStudentListListResponse struct {
	Data []constant.HomeworkStudentListResponse `json:"data"`
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkStudentListList(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkStudentListListRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.HomeworkStudentListList(&HomeworkStudentListListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkStudentListListResponse{
		Data: resp.HomeworkStudentLists,
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

type HomeworkStudentListListInput struct {
	*HomeworkStudentListListRequest
}

type HomeworkStudentListListOutput struct {
	HomeworkStudentLists []constant.HomeworkStudentListResponse
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkStudentListList(in *HomeworkStudentListListInput) (*HomeworkStudentListListOutput, error) {

	indexLevelPlay, err := service.teacherHomeworkStorage.GetHomeworkWithIndexByStudentId(in.HomeworkId, in.StudentId)
	if err != nil {
		return nil, err
	}

	totalLevel, err := service.teacherHomeworkStorage.GetLevelTotalByHomeworkId(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	mappingIndexSumStar := map[int]int{}
	mappingIndexSumTimeUsed := map[int]float64{}
	mappingIndexSumCount := map[int]int{}
	mappingIndexDetailLevel := map[int][]constant.DetailLevel{}
	indexs := []int{}
	for _, indexLevel := range indexLevelPlay {
		correctCount := 0
		if indexLevel.LevelPlayLogId != nil {
			correctCount, err = service.teacherHomeworkStorage.GetCorrectQuestionCount(*indexLevel.LevelPlayLogId)
			if err != nil {
				return nil, err
			}
		}
		indexs = append(indexs, helper.Deref(indexLevel.Index))
		mappingIndexSumStar[helper.Deref(indexLevel.Index)] += helper.Deref(indexLevel.MaxStar)
		mappingIndexSumTimeUsed[helper.Deref(indexLevel.Index)] += helper.Deref(indexLevel.AvgTimeUsed)
		mappingIndexSumCount[helper.Deref(indexLevel.Index)] += 1
		mappingIndexDetailLevel[helper.Deref(indexLevel.Index)] = append(mappingIndexDetailLevel[helper.Deref(indexLevel.Index)], constant.DetailLevel{
			LevelId:            helper.Deref(indexLevel.LevelId),
			LevelIndex:         helper.Deref(indexLevel.LevelIndex),
			TotalStar:          helper.Deref(indexLevel.MaxStar),
			TotalQuestion:      helper.Deref(indexLevel.TotalQuestionCount),
			LevelPlayLogId:     helper.Deref(indexLevel.LevelPlayLogId),
			CorrectAnswerCount: correctCount,
		})
	}
	indexs = helper.RemoveDuplicate(indexs)
	sort.IntSlice(indexs).Sort()
	resp := []constant.HomeworkStudentListResponse{}
	for _, index := range indexs {
		status := "done"
		if mappingIndexSumCount[index] < totalLevel {
			status = "doing"
		}

		resp = append(resp, constant.HomeworkStudentListResponse{
			HomeworkSubmissionIndex: index,
			TotalStarCount:          mappingIndexSumStar[index],
			MaxStarCount:            3 * totalLevel,
			AvgTimeUsed:             mappingIndexSumTimeUsed[index] / float64(mappingIndexSumCount[index]),
			DetailLevel:             mappingIndexDetailLevel[index],
			Status:                  status,
		})
	}

	return &HomeworkStudentListListOutput{
		HomeworkStudentLists: resp,
	}, nil
}
