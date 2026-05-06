package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d07-gamemaster-profile-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
	"log"
	"mime/multipart"
	"net/http"
	"time"
)

// ==================== Request ==========================

type GamemasterUpdateRequest struct {
	Title        string                `form:"title"`
	FirstName    string                `form:"first_name"`
	LastName     string                `form:"last_name"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
}

// ==================== Response ==========================

type GamemasterUpdateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) GamemasterUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GamemasterUpdateRequest{})
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

	gamemasterUpdateOutput, err := api.Service.GamemasterUpdate(&GamemasterUpdateInput{
		SubjectId:               subjectId,
		GamemasterUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GamemasterUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.UserEntity{*gamemasterUpdateOutput.UserEntity},
		Message:    "Gamemaster updated",
	})
}

// ==================== Service ==========================

type GamemasterUpdateInput struct {
	SubjectId string
	*GamemasterUpdateRequest
}

type GamemastterUpdateOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) GamemasterUpdate(in *GamemasterUpdateInput) (*GamemastterUpdateOutput, error) {
	user, err := service.gamemasterProfileStorage.UserGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	userEntity := constant.UserEntity{}
	err = copier.Copy(&userEntity, in.GamemasterUpdateRequest)
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

	gamemaster, err := service.gamemasterProfileStorage.UserUpdate(nil, &userEntity)
	if err != nil {
		return nil, err
	}

	if gamemaster.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*gamemaster.ImageUrl)
		if err != nil {
			return nil, err
		}
		gamemaster.ImageUrl = url
	}

	return &GamemastterUpdateOutput{
		gamemaster,
	}, nil
}
