package service

import (
	"fmt"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
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

type SubLessonUrlListRequest struct {
	LessonId int `params:"lessonId" validate:"required"`
}

// ==================== Response ==========================

type SubLessonUrlListResponse struct {
	StatusCode int            `json:"status_code"`
	Data       map[int]string `json:"data"`
	Message    string         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonUrlList(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubLessonUrlListRequest{}, helper.ParseOptions{Params: true})
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

	subLessonUrlListOutput, err := api.Service.SubLessonUrlList(&SubLessonUrlListInput{
		Roles:                   roles,
		SubjectId:               subjectId,
		SubLessonUrlListRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SubLessonUrlListResponse{
		StatusCode: http.StatusOK,
		Data:       subLessonUrlListOutput.Urls,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SubLessonUrlListInput struct {
	Roles     []int
	SubjectId string
	*SubLessonUrlListRequest
}

type SubLessonUrlListOutput struct {
	Urls map[int]string
}

func (service *serviceStruct) SubLessonUrlList(in *SubLessonUrlListInput) (*SubLessonUrlListOutput, error) {
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

	//subLessonIds, err := service.academicLevelStorage.SubLessonIdListByLesson(in.LessonId)
	//if err != nil {
	//	return nil, err
	//}
	subLessons, err := service.academicLevelStorage.SubLessonTimeListByLesson(in.LessonId)
	if err != nil {
		return nil, err
	}

	urls := map[int]string{}
	env := os.Getenv("ENV")
	for _, subLesson := range subLessons {
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

	return &SubLessonUrlListOutput{
		Urls: urls,
	}, nil
}
