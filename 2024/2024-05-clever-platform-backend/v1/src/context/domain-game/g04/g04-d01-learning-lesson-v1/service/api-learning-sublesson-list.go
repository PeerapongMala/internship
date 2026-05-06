package service

import (
	"net/http"
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LearningSublessonListResponse struct {
	Pagination *helper.Pagination                `json:"_pagination"`
	StatusCode int                               `json:"status_code"`
	Data       *[]constant.LearningSublessonList `json:"data"`
	Message    string                            `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LearningSublessonList(context *fiber.Ctx) error {
	lessonId, err := context.ParamsInt("lessonId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, err := api.Service.LearningSublessonList(pagination, lessonId, userId)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(LearningSublessonListResponse{
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
		Data:       response,
		Message:    "Learning sublesson list",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) LearningSublessonList(pagination *helper.Pagination, lessonId int, userId string) (*[]constant.LearningSublessonList, error) {
	list, err := service.learningLessonStorage.ListLearningSublesson(pagination, lessonId, userId)
	if err != nil {
		return nil, err
	}

	subLessons := helper.Deref(list)
	subLessonIds := []int{}
	subLessonMap := map[int]constant.LearningSublessonList{}
	for _, subLesson := range subLessons {
		subLessonIds = append(subLessonIds, subLesson.Id)
		subLessonMap[subLesson.Id] = subLesson
	}

	stats, err := service.learningLessonStorage.SubLessonCaseGetStat(subLessonIds, userId)
	if err != nil {
		return nil, err
	}
	for _, stat := range stats {
		subLesson := subLessonMap[helper.Deref(stat.Id)]
		subLesson.Stat = &stat
		subLesson.Stat.TotalStars = helper.ToPtr(helper.Deref(subLesson.Stat.TotalLevels) * 3)
		subLessonMap[subLesson.Id] = subLesson
	}

	subLessons = []constant.LearningSublessonList{}
	for _, subLesson := range subLessonMap {
		subLessons = append(subLessons, subLesson)
	}
	sort.Slice(subLessons, func(i, j int) bool {
		return subLessons[j].Index > subLessons[i].Index
	})

	return &subLessons, nil
}
