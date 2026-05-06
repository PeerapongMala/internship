package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d07-academic-profile-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type ContentCreatorUpdateRequest struct {
	Title        string                `form:"title"`
	FirstName    string                `form:"first_name"`
	LastName     string                `form:"last_name"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
}

// ==================== Response ==========================

type ContentCreatorUpdateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) ContentCreatorUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ContentCreatorUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	profileImage, err := context.FormFile("profile_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request.ProfileImage = profileImage

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	contentCreator, err := api.Service.ContentCreatorUpdate(&ContentCreatorUpdateInput{
		SubjectId:                   subjectId,
		ContentCreatorUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ContentCreatorUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.UserEntity{*contentCreator.UserEntity},
		Message:    "Content creator updated",
	})
}

// ==================== Service ==========================

type ContentCreatorUpdateInput struct {
	SubjectId string
	*ContentCreatorUpdateRequest
}

type ContentCreatorUpdateOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) ContentCreatorUpdate(in *ContentCreatorUpdateInput) (*ContentCreatorUpdateOutput, error) {
	user, err := service.academicProfileStorage.UserGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	userEntity := constant.UserEntity{}
	err = copier.Copy(&userEntity, in.ContentCreatorUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	userEntity.Id = in.SubjectId
	userEntity.UpdatedAt = &now
	userEntity.UpdatedBy = &in.SubjectId

	if in.ProfileImage != nil {
		if user.ImageUrl != nil {
			err := service.cloudStorage.ObjectDelete(*user.ImageUrl)
			if err != nil {
				return nil, err
			}
		}

		key := uuid.NewString()
		err = service.cloudStorage.ObjectCreate(in.ProfileImage, key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
		userEntity.ImageUrl = &key
	}

	contentCreator, err := service.academicProfileStorage.UserUpdate(nil, &userEntity)
	if err != nil {
		return nil, err
	}

	if contentCreator.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*contentCreator.ImageUrl)
		if err != nil {
			return nil, err
		}
		contentCreator.ImageUrl = url
	}

	return &ContentCreatorUpdateOutput{
		contentCreator,
	}, err
}
