package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SubjectSubLessonListResponse struct {
	Pagination *helper.Pagination                      `json:"_pagination"`
	StatusCode int                                     `json:"status_code"`
	Data       []constant.SubjectSubLessonListResponse `json:"data"`
	Message    string                                  `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectSubLessonList(context *fiber.Ctx) error {
	lessonId, err := context.ParamsInt("lessonId")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)
	filter := constant.SubLessonListFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subLessons, err := api.Service.SubjectSubLessonList(pagination, lessonId, filter)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	data := []map[string]interface{}{}
	for _, subLesson := range *subLessons {
		subLessonWithDetails := map[string]interface{}{
			"id":              subLesson.Id,
			"lesson_id":       subLesson.LessonId,
			"lesson_name":     subLesson.LessonName,
			"lesson_index":    subLesson.LessonIndex,
			"indicator_id":    subLesson.IndicatorId,
			"indicator_name":  subLesson.IndicatorName,
			"level_count":     subLesson.LevelCount,
			"name":            subLesson.Name,
			"status":          subLesson.Status,
			"created_at":      subLesson.CreatedAt,
			"created_by":      subLesson.CreatedBy,
			"updated_at":      subLesson.UpdatedAt,
			"updated_by":      subLesson.UpdatedBy,
			"admin_login_as":  subLesson.AdminLoginAs,
			"index":           subLesson.Index,
			"user_id":         subLesson.UserId,
			"email":           subLesson.Email,
			"title":           subLesson.Title,
			"first_name":      subLesson.FirstName,
			"last_name":       subLesson.LastName,
			"transcript":      subLesson.TranscriptName,
			"file_is_updated": subLesson.FileIsUpdated,
			"file_updated_at": subLesson.FileUpdatedAt,
		}

		data = append(data, subLessonWithDetails)
	}

	response := fiber.Map{
		"_pagination": pagination,
		"status_code": fiber.StatusOK,
		"data":        data,
		"message":     "Subject sub lesson list",
	}

	return context.Status(fiber.StatusOK).JSON(response)
}

// ==================== Service ==========================

func (service *serviceStruct) SubjectSubLessonList(pagination *helper.Pagination, lessonId int, filter constant.SubLessonListFilter) (*[]constant.SubjectSubLessonListResponse, error) {
	subLessons, err := service.academicSubLessonStorage.ListSubjectSubLesson(pagination, lessonId, filter)
	if err != nil {
		return nil, err
	}

	//for i := range *subLessons {
	//	(*subLessons)[i].LevelCount = subLessonDetails.LevelCount
	//}

	return subLessons, nil
}
