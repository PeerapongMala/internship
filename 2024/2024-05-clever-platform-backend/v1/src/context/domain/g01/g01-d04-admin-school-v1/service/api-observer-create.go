package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type ObserverCreateRequest struct {
	SchoolId     int                   `form:"school_id" validate:"required"`
	Email        string                `form:"email" validate:"required,email"`
	Title        string                `form:"title" validate:"required"`
	FirstName    string                `form:"first_name" validate:"required,max=50"`
	LastName     string                `form:"last_name" validate:"required,max=50"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
	Status       string                `form:"status" validate:"required"`
	Password     *string               `form:"password"`
}

// ==================== Response ==========================

type ObserverCreateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	profileImage, err := context.FormFile("profile_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.ProfileImage = profileImage

	if !slices.Contains(constant.UserStatusList, constant.UserStatus(request.Status)) {
		err := helper.NewHttpError(http.StatusBadRequest, nil)
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerCreateOutput, err := api.Service.ObserverCreate(&ObserverCreateInput{
		ObserverCreateRequest: request,
		SubjectId:             subjectId,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(ObserverCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.UserEntity{*observerCreateOutput.UserEntity},
		Message:    "Observer created",
	})
}

// ==================== Service ==========================

type ObserverCreateInput struct {
	SubjectId string
	*ObserverCreateRequest
}

type ObserverCreateOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) ObserverCreate(in *ObserverCreateInput) (*ObserverCreateOutput, error) {
	tx, err := service.adminSchoolStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var key *string
	if in.ProfileImage != nil {
		imageKey := uuid.NewString()
		key = &imageKey
	}

	userEntity := constant.UserEntity{}
	err = copier.Copy(&userEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	userEntity.Id = uuid.NewString()
	userEntity.CreatedAt = time.Now().UTC()
	userEntity.CreatedBy = &in.SubjectId
	userEntity.ImageUrl = key
	user, err := service.adminSchoolStorage.UserCreate(tx, &userEntity)
	if err != nil {
		return nil, err
	}

	if in.Password != nil {
		passwordHash, err := helper.HashAndSalt(*in.Password)
		if err != nil {
			return nil, err
		}
		_, err = service.adminSchoolStorage.AuthEmailPasswordCreate(tx, &constant.AuthEmailPasswordEntity{
			UserId:       user.Id,
			PasswordHash: *passwordHash,
		})
	}

	_, err = service.adminSchoolStorage.UserCaseAddUserRole(tx, user.Id, []int{int(constant.Observer)})
	if err != nil {
		return nil, err
	}

	err = service.adminSchoolStorage.SchoolCaseAddObserver(tx, in.SchoolId, user.Id)
	if err != nil {
		return nil, err
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(in.ProfileImage, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if user.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*user.ImageUrl)
		if err != nil {
			return nil, err
		}
		user.ImageUrl = url
	}

	return &ObserverCreateOutput{
		UserEntity: user,
	}, nil
}
