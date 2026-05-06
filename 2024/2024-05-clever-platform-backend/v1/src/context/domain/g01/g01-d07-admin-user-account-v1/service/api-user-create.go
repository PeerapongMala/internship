package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type UserCreateRequest struct {
	Email        string                `form:"email" validate:"required,email"`
	Title        string                `form:"title" validate:"required"`
	FirstName    string                `form:"first_name" validate:"required,max=50"`
	LastName     string                `form:"last_name" validate:"required,max=50"`
	IdNumber     *string               `form:"id_number"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
	Status       string                `form:"status" validate:"required"`
	Password     *string               `form:"password"`
	Roles        []int                 `form:"roles"`
}

// ==================== Response ==========================

type UserCreateResponse struct {
	StatusCode int        `json:"status_code"`
	Data       []UserData `json:"data"`
	Message    string     `json:"message"`
}

type UserData struct {
	*constant.UserEntity
	Roles []int `json:"roles"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &UserCreateRequest{})
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
		msg := "Invalid status"
		err := helper.NewHttpError(http.StatusBadRequest, &msg)
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	for _, role := range request.Roles {
		if !slices.Contains(constant.RoleList, constant.Role(role)) {
			msg := "Invalid roles"
			err := helper.NewHttpError(http.StatusBadRequest, &msg)
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	userCreateOutput, err := api.Service.UserCreate(&UserCreateInput{
		UserCreateRequest: request,
		SubjectId:         subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if userCreateOutput.Roles == nil {
		userCreateOutput.Roles = []int{}
	}

	return context.Status(http.StatusCreated).JSON(UserCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []UserData{{
			UserEntity: userCreateOutput.UserEntity,
			Roles:      userCreateOutput.Roles,
		}},
		Message: "User created",
	})
}

// ==================== Service ==========================

type UserCreateInput struct {
	*UserCreateRequest
	SubjectId string
}

type UserCreateOutput struct {
	*constant.UserEntity
	Roles []int
}

func (service *serviceStruct) UserCreate(in *UserCreateInput) (*UserCreateOutput, error) {
	var key *string
	if in.ProfileImage != nil {
		imageKey := uuid.NewString()
		key = &imageKey
	}

	userEntity := constant.UserEntity{}
	err := copier.Copy(&userEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	userEntity.Id = uuid.NewString()
	userEntity.CreatedAt = time.Now().UTC()
	userEntity.CreatedBy = &in.SubjectId
	userEntity.ImageUrl = key

	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	user, err := service.adminUserAccountStorage.UserCreate(tx, &userEntity)
	if err != nil {
		return nil, err
	}

	roles, err := service.adminUserAccountStorage.UserCaseAddUserRole(tx, user.Id, in.Roles)
	if err != nil {
		return nil, err
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(in.ProfileImage, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
	}

	if in.Password != nil {
		passwordHash, err := helper.HashAndSalt(*in.Password)
		if err != nil {
			return nil, err
		}
		_, err = service.adminUserAccountStorage.AuthEmailPasswordCreate(tx, &constant.AuthEmailPasswordEntity{
			UserId:       user.Id,
			PasswordHash: *passwordHash,
		})
	}

	err = tx.Commit()
	if err != nil {
		cloudErr := service.cloudStorage.ObjectDelete(*userEntity.ImageUrl)
		if cloudErr != nil {
			return nil, err
		}
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

	return &UserCreateOutput{
		UserEntity: user,
		Roles:      roles,
	}, nil
}
