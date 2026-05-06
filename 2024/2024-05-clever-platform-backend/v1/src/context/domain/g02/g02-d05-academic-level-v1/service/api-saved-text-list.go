package service

import (
	"log"
	"net/http"
	"slices"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type SavedTextListResponse struct {
	StatusCode int                                `json:"status_code"`
	Pagination *helper.Pagination                 `json:"_pagination"`
	Data       []constant.SavedTextListDataEntity `json:"data"`
	Message    string                             `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SavedTextList(context *fiber.Ctx) error {
	curriculumGroupId, err := context.ParamsInt("curriculumGroupId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	pagination := helper.PaginationNew(context)
	filter := constant.SavedTextFilter{}
	err = context.QueryParser(&filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	validate := validator.New()
	err = validate.Struct(filter)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	savedTextListOutput, err := api.Service.SavedTextList(&SavedTextListInput{
		Roles:             roles,
		CurriculumGroupId: curriculumGroupId,
		SubjectId:         subjectId,
		Pagination:        pagination,
		Filter:            &filter,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(SavedTextListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       savedTextListOutput.SavedText,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type SavedTextListInput struct {
	Roles             []int
	CurriculumGroupId int
	SubjectId         string
	Pagination        *helper.Pagination
	Filter            *constant.SavedTextFilter
}

type SavedTextListOutput struct {
	SavedText []constant.SavedTextListDataEntity
}

func (service *serviceStruct) SavedTextList(in *SavedTextListInput) (*SavedTextListOutput, error) {
	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(in.CurriculumGroupId)
	if err != nil {
		return nil, err
	}
	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.SubjectId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	savedTextListData, err := service.academicLevelStorage.SavedTextList(in.CurriculumGroupId, in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, savedText := range savedTextListData {
		if savedText.SpeechUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*savedText.SpeechUrl)
			if err != nil {
				return nil, err
			}
			savedTextListData[i].SpeechUrl = url
		}
	}

	return &SavedTextListOutput{
		SavedText: savedTextListData,
	}, nil
}
