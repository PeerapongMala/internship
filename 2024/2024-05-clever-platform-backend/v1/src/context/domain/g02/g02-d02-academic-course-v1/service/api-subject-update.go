package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type SubjectUpdateRequest struct {
	Name                        string                `form:"name"`
	SubjectLanguageType         string                `form:"subject_language_type"`
	SubjectLanguage             *string               `form:"subject_language"`
	SubjectTranslationLanguages []string              `form:"subject_translation_languages"`
	SubjectImage                *multipart.FileHeader `form:"subject_image"`
	Status                      string                `form:"status"`
	AdminLoginAs                *string               `form:"admin_login_as"`
}

// ==================== Response ==========================

type SubjectUpdateResponse struct {
	StatusCode int                      `json:"status_code"`
	Data       []constant.SubjectEntity `json:"data"`
	Message    string                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectUpdate(context *fiber.Ctx) error {
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		msg := "Invalid subject id"
		err := helper.NewHttpError(http.StatusBadRequest, &msg)
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	request, err := helper.ParseAndValidateRequest(context, &SubjectUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectImage, err := context.FormFile("subject_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", err)
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.SubjectImage = subjectImage

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = constant.ValidateStatus(request.Status)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = constant.ValidateLanguages(request.SubjectTranslationLanguages)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectUpdateOutput, err := api.Service.SubjectUpdate(&SubjectUpdateInput{
		SubjectId:            subjectId,
		UserId:               userId,
		Roles:                roles,
		SubjectUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&SubjectUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.SubjectEntity{*subjectUpdateOutput.SubjectEntity},
		Message:    "Subject updated",
	})
}

// ==================== Service ==========================

type SubjectUpdateInput struct {
	SubjectId int
	UserId    string
	Roles     []int
	*SubjectUpdateRequest
}

type SubjectUpdateOutput struct {
	*constant.SubjectEntity
}

func (service *serviceStruct) SubjectUpdate(in *SubjectUpdateInput) (*SubjectUpdateOutput, error) {
	subject, err := service.academicCourseStorage.SubjectGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId, err := service.academicCourseStorage.SubjectGroupCaseGetCurriculumGroupId(subject.SubjectGroupId)
	if err != nil {
		return nil, err
	}

	// validate content creator
	contentCreators, err := service.academicCourseStorage.CurriculumGroupCaseListContentCreator(*curriculumGroupId)
	if err != nil {
		return nil, err
	}
	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.UserId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return nil, helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	err = constant.ValidateNewStatus(subject.Status, in.Status)
	if err != nil {
		return nil, err
	}

	tx, err := service.academicCourseStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	subjectEntity := constant.SubjectEntity{}
	err = copier.Copy(&subjectEntity, in.SubjectUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	subjectEntity.Id = in.SubjectId
	subjectEntity.UpdatedBy = &in.UserId
	now := time.Now().UTC()
	subjectEntity.UpdatedAt = &now

	if in.SubjectImage != nil {
		if subject.ImageUrl != nil {
			err := service.cloudStorage.ObjectDelete(*subject.ImageUrl)
			if err != nil {
				return nil, err
			}
		}

		key := uuid.NewString()
		err = service.cloudStorage.ObjectCreate(in.SubjectImage, key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
		subjectEntity.ImageUrl = &key
		log.Println(*subjectEntity.ImageUrl)
	}

	updatedSubject, err := service.academicCourseStorage.SubjectUpdate(tx, &subjectEntity)
	if err != nil {
		return nil, err
	}

	subjectTranslations := []string{}
	if in.SubjectTranslationLanguages != nil {
		err := service.academicCourseStorage.SubjectTranslationCaseDeleteBySubject(tx, updatedSubject.Id)
		if err != nil {
			return nil, err
		}

		for _, subjectTranslationLanguage := range in.SubjectTranslationLanguages {
			subjectTranslationEntity := constant.SubjectTranslationEntity{
				SubjectId: subject.Id,
				Language:  subjectTranslationLanguage,
			}
			subjectTranslation, err := service.academicCourseStorage.SubjectTranslationCreate(tx, &subjectTranslationEntity)
			if err != nil {
				return nil, err
			}
			subjectTranslations = append(subjectTranslations, subjectTranslation.Language)
		}
	} else {
		translationLanguages, err := service.academicCourseStorage.SubjectTranslationCaseListBySubject(updatedSubject.Id)
		if err != nil {
			return nil, err
		}
		subjectTranslations = translationLanguages
	}
	updatedSubject.SubjectTranslationLanguages = subjectTranslations

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if updatedSubject.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*updatedSubject.ImageUrl)
		if err != nil {
			return nil, err
		}
		updatedSubject.ImageUrl = url
	}

	return &SubjectUpdateOutput{
		SubjectEntity: updatedSubject,
	}, nil
}
