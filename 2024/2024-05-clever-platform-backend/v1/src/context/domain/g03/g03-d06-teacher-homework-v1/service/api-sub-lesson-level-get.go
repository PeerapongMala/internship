package service

import (
	"net/http"
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type SubLessonLevelGetRequest struct {
	LessonId int `params:"lessonId"`
}

// ==================== Response ==========================

type SubLessonLevelGetResponse struct {
	StatusCode int                                   `json:"status_code"`
	Data       []constant.SubLessonWithLevelResponse `json:"data"`
	Message    string                                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonLevelGet(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &SubLessonLevelGetRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.SubLessonLevelGet(&SubLessonLevelGetInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonLevelGetResponse{
		StatusCode: http.StatusOK,
		Data:       resp.SubLessonLevels,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonLevelGetInput struct {
	*SubLessonLevelGetRequest
}

type SubLessonLevelGetOutput struct {
	SubLessonLevels []constant.SubLessonWithLevelResponse
}

func (service *serviceStruct) SubLessonLevelGet(in *SubLessonLevelGetInput) (*SubLessonLevelGetOutput, error) {

	subLessonLevels, err := service.teacherHomeworkStorage.GetSubLessonLevelByLessonId(in.LessonId)
	if err != nil {
		return nil, err
	}

	var difficultyOrder = map[string]int{
		"easy":   1,
		"medium": 2,
		"hard":   3,
	}
	subLessonMap := map[int]constant.SubLessonWithLevelResponse{}
	levelMap := map[int][]constant.LevelResponse{}
	for _, subLessonLevel := range subLessonLevels {
		subLessonMap[*subLessonLevel.SubLessonId] = constant.SubLessonWithLevelResponse{
			SubLessonId:    subLessonLevel.SubLessonId,
			SubLessonName:  subLessonLevel.SubLessonName,
			SubLessonIndex: subLessonLevel.SubLessonIndex,
		}
		levelMap[*subLessonLevel.SubLessonId] = append(levelMap[*subLessonLevel.SubLessonId], constant.LevelResponse{
			LevelId:         subLessonLevel.LevelId,
			LevelIndex:      *subLessonLevel.LevelIndex,
			LevelDifficulty: subLessonLevel.LevelDifficulty,
		})
	}

	for subLessonID, levels := range levelMap {
		sort.Slice(levels, func(i, j int) bool {
			diffI := difficultyOrder[*levels[i].LevelDifficulty]
			diffJ := difficultyOrder[*levels[j].LevelDifficulty]
			if diffI != diffJ {
				return diffI < diffJ
			}
			return levels[i].LevelIndex < levels[j].LevelIndex
		})
		levelMap[subLessonID] = levels
	}

	resp := []constant.SubLessonWithLevelResponse{}
	for id, subLesson := range subLessonMap {
		subLesson.Level = levelMap[id]
		subLesson.TotalLevel = len(levelMap[id])
		resp = append(resp, subLesson)
	}

	sort.Slice(resp, func(i, j int) bool {
		return *resp[i].SubLessonId < *resp[j].SubLessonId && *resp[i].SubLessonIndex < *resp[j].SubLessonIndex
	})

	//levelIndex := 1
	//for i, subLesson := range resp {
	//	for j, _ := range subLesson.Level {
	//		resp[i].Level[j].LevelIndex = levelIndex
	//		levelIndex++
	//	}
	//}

	return &SubLessonLevelGetOutput{
		SubLessonLevels: resp,
	}, nil
}
