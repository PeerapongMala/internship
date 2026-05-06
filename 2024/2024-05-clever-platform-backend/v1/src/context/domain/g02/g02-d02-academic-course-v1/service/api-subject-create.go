package service

import (
	"fmt"
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

type SubjectCreateRequest struct {
	SubjectGroupId              int                   `form:"subject_group_id" validate:"required"`
	Name                        string                `form:"name" validate:"required"`
	Project                     *string               `form:"project"`
	SubjectLanguageType         string                `form:"subject_language_type" validate:"required"`
	SubjectLanguage             *string               `form:"subject_language"`
	SubjectTranslationLanguages []string              `form:"subject_translation_languages"`
	SubjectImage                *multipart.FileHeader `form:"subject_image"`
	Status                      string                `form:"status" validate:"required"`
	AdminLoginAs                *string               `form:"admin_login_as"`
}

// ==================== Response ==========================

type SubjectCreateResponse struct {
	StatusCode int                 `json:"status_code"`
	Data       []SubjectCreateData `json:"data"`
	Message    string              `json:"message"`
}

type SubjectCreateData struct {
	constant.SubjectEntity
	TagGroups []constant.TagGroupWithTagsEntity `json:"tag_groups"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &SubjectCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectImage, err := context.FormFile("subject_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", err)
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.SubjectImage = subjectImage

	err = constant.ValidateStatus(request.Status)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = constant.ValidateLanguages(request.SubjectTranslationLanguages)
	if err != nil {
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

	subjectCreateOutput, err := api.Service.SubjectCreate(&SubjectCreateInput{
		SubjectId:            subjectId,
		Roles:                roles,
		SubjectCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(SubjectCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []SubjectCreateData{{
			SubjectEntity: *subjectCreateOutput.SubjectEntity,
			TagGroups:     subjectCreateOutput.TagGroups,
		}},
		Message: "Subject created",
	})
}

// ==================== Service ==========================

type SubjectCreateInput struct {
	SubjectId string
	Roles     []int
	*SubjectCreateRequest
}

type SubjectCreateOutput struct {
	*constant.SubjectEntity
	TagGroups []constant.TagGroupWithTagsEntity
}

func (service *serviceStruct) SubjectCreate(in *SubjectCreateInput) (*SubjectCreateOutput, error) {
	curriculumGroupId, err := service.academicCourseStorage.SubjectGroupCaseGetCurriculumGroupId(in.SubjectGroupId)
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

	tx, err := service.academicCourseStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	subjectEntity := constant.SubjectEntity{}
	err = copier.Copy(&subjectEntity, in.SubjectCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	subjectEntity.CreatedAt = time.Now().UTC()
	subjectEntity.CreatedBy = in.SubjectId

	if in.SubjectImage != nil {
		key := uuid.NewString()
		err := service.cloudStorage.ObjectCreate(in.SubjectImage, key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
		subjectEntity.ImageUrl = &key
	}

	subject, err := service.academicCourseStorage.SubjectCreate(tx, &subjectEntity)
	if err != nil {
		return nil, err
	}

	for i := 1; i <= 3; i++ {
		tagGroupEntity := constant.TagGroupEntity{
			Index:     i,
			SubjectId: subject.Id,
			Name:      fmt.Sprintf(`Filter %d`, i),
		}
		_, err := service.academicCourseStorage.TagGroupCreate(tx, &tagGroupEntity)
		if err != nil {
			return nil, err
		}
	}

	subjectTranslations := []string{}
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
	subject.SubjectTranslationLanguages = subjectTranslations

	err = service.academicCourseStorage.SubjectPrefill(tx, in.SubjectGroupId, subject.Id)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if subject.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*subject.ImageUrl)
		if err != nil {
			return nil, err
		}
		subject.ImageUrl = url
	}

	tagGroupWithTags, err := service.academicCourseStorage.TagCaseListBySubjectId(subject.Id)
	if err != nil {
		return nil, err
	}

	return &SubjectCreateOutput{
		subject,
		tagGroupWithTags,
	}, nil
}
