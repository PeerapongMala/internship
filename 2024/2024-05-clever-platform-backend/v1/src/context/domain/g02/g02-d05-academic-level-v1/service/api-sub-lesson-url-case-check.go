package service

import (
	"fmt"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"os"
	"slices"
	"time"
)

// ==================== Request ==========================

type SubLessonUrlCaseCheckRequest struct {
	LessonId          int                      `params:"lessonId" validate:"required"`
	SubLessonTimeList []constant.SubLessonTime `json:"sub_lesson_time_list" validate:"required"`
}

// ==================== Response ==========================

type SubLessonUrlCaseCheckResponse struct {
	StatusCode int            `json:"status_code"`
	Data       map[int]string `json:"data"`
	Message    string         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonUrlCaseCheck(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonUrlCaseCheckRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subLessonUrlCaseCheckOutput, err := api.Service.SubLessonUrlCaseCheck(&SubLessonUrlCaseCheckInput{
		Roles:                        roles,
		SubjectId:                    subjectId,
		SubLessonUrlCaseCheckRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonUrlCaseCheckResponse{
		StatusCode: http.StatusOK,
		Data:       subLessonUrlCaseCheckOutput.Urls,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonUrlCaseCheckInput struct {
	Roles     []int
	SubjectId string
	*SubLessonUrlCaseCheckRequest
}

type SubLessonUrlCaseCheckOutput struct {
	Urls map[int]string
}

func (service *serviceStruct) SubLessonUrlCaseCheck(in *SubLessonUrlCaseCheckInput) (*SubLessonUrlCaseCheckOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LessonCaseGetCurriculumGroupId(in.LessonId)
	if err != nil {
		return nil, err
	}

	if !slices.Contains(in.Roles, int(userConstant.Student)) {
		err = service.CheckContentCreator(&CheckContentCreatorInput{
			SubjectId:         in.SubjectId,
			Roles:             in.Roles,
			CurriculumGroupId: *curriculumGroupId,
		})
		if err != nil {
			return nil, err
		}
	}

	subLessonTimeMap := map[int]*time.Time{}
	for _, subLessonTime := range in.SubLessonTimeList {
		subLessonTimeMap[subLessonTime.SubLessonId] = subLessonTime.UpdatedAt
	}

	subLessons, err := service.academicLevelStorage.SubLessonTimeListByLesson(in.LessonId)
	if err != nil {
		return nil, err
	}

	urls := map[int]string{}
	for _, subLesson := range subLessons {
		subLessonTime, ok := subLessonTimeMap[subLesson.SubLessonId]
		feTime := helper.Deref(subLessonTime)
		dbTime := helper.Deref(subLesson.UpdatedAt)
		if ok && (feTime.Year() == dbTime.Year() &&
			feTime.Month() == dbTime.Month() &&
			feTime.Day() == dbTime.Day() &&
			feTime.Hour() == dbTime.Hour() &&
			feTime.Minute() == dbTime.Minute() &&
			feTime.Second() == dbTime.Second()) {
			continue
		}

		env := os.Getenv("ENV")
		key := fmt.Sprintf(`%s-sub-lesson-id-%d.zip`, env, subLesson.SubLessonId)
		isExists, err := service.cloudStorage.ObjectCaseCheckExistence(key)
		if err != nil {
			return nil, err
		}

		if !isExists {
			err := service.UpdateSubLessonFile(&UpdateSubLessonFileInput{
				subjectId:   in.SubjectId,
				subLessonId: subLesson.SubLessonId,
			})
			if err != nil {
				return nil, err
			}
		}

		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(key)
		if err != nil {
			return nil, err
		}
		if subLesson.UpdatedAt == nil {
			subLesson.UpdatedAt = helper.ToPtr(time.Now().UTC())
		}
		url = helper.ToPtr(fmt.Sprintf(`%s?%d`, helper.Deref(url), subLesson.UpdatedAt.Unix()))
		urls[subLesson.SubLessonId] = *url
	}

	return &SubLessonUrlCaseCheckOutput{
		Urls: urls,
	}, nil
}
