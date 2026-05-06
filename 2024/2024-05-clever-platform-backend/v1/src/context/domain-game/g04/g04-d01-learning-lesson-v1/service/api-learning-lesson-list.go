package service

import (
	"net/http"
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LearningLessonListResponse struct {
	Pagination *helper.Pagination            `json:"_pagination"`
	StatusCode int                           `json:"status_code"`
	Data       []constant.LearningLessonList `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LearningLessonList(context *fiber.Ctx) error {
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	response, err := api.Service.LearningLessonList(pagination, subjectId, userId)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(LearningLessonListResponse{
		Pagination: pagination,
		StatusCode: fiber.StatusOK,
		Data:       *response,
		Message:    "Learning lesson list",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) LearningLessonList(pagination *helper.Pagination, subjectId int, userId string) (*[]constant.LearningLessonList, error) {
	studyGroupIds, err := service.learningLessonStorage.StudyGroupGetByUserId(userId)
	if err != nil {
		return nil, err
	}
	list, err := service.learningLessonStorage.ListLearningLesson(pagination, subjectId, userId, studyGroupIds)
	if err != nil {
		return nil, err
	}

	lessons := helper.Deref(list)
	lessonIds := []int{}
	lessonMap := map[int]constant.LearningLessonList{}
	for _, lesson := range lessons {
		lessonIds = append(lessonIds, lesson.Id)
		lessonMap[lesson.Id] = lesson
	}

	stats, err := service.learningLessonStorage.LessonCaseGetStat(lessonIds, userId)
	if err != nil {
		return nil, err
	}
	for _, stat := range stats {
		lesson := lessonMap[helper.Deref(stat.Id)]
		lesson.Stat = &stat
		lesson.Stat.TotalStars = helper.ToPtr(helper.Deref(lesson.Stat.TotalLevels) * 3)
		lessonMap[lesson.Id] = lesson
	}

	lessons = []constant.LearningLessonList{}
	for _, lesson := range lessonMap {
		lessons = append(lessons, lesson)
	}
	sort.Slice(lessons, func(i, j int) bool {
		return lessons[j].Index > lessons[i].Index
	})

	return &lessons, nil
}
