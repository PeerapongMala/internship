package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/google/uuid"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type UserUpdateRequest struct {
	Email        *string               `form:"email"`
	Title        *string               `form:"title"`
	FirstName    *string               `form:"first_name"`
	LastName     *string               `form:"last_name"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
	Status       *string               `form:"status"`
}

// ==================== Response ==========================

type UserUpdateResponse struct {
	StatusCode int              `json:"status_code"`
	Data       []UserUpdateData `json:"data"`
	Message    string           `json:"message"`
}

type UserUpdateData struct {
	*constant.UserEntity
	Roles []int `json:"roles"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) UserUpdate(context *fiber.Ctx) error {
	userId := context.Params("userId")
	request, err := helper.ParseAndValidateRequest(context, &UserUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
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

	userUpdateOutput, err := api.Service.UserUpdate(&UserUpdateInput{
		UserId:            userId,
		UserUpdateRequest: request,
		SubjectId:         subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(UserUpdateResponse{
		StatusCode: http.StatusOK,
		Data: []UserUpdateData{{
			UserEntity: userUpdateOutput.UserEntity,
			Roles:      userUpdateOutput.Roles,
		}},
		Message: "User updated",
	})
}

// ==================== Service ==========================

type UserUpdateInput struct {
	UserId string
	*UserUpdateRequest
	SubjectId string
}

type UserUpdateOutput struct {
	*constant.UserEntity
	Roles []int
}

func (service *serviceStruct) UserUpdate(in *UserUpdateInput) (*UserUpdateOutput, error) {
	currentUser, err := service.adminUserAccountStorage.UserGet(in.UserId)
	if err != nil {
		return nil, err
	}

	var key *string
	if in.ProfileImage != nil {
		imageKey := uuid.NewString()
		key = &imageKey
	}

	now := time.Now().UTC()
	userEntity := constant.UserEntity{}
	err = copier.Copy(&userEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	userEntity.Id = in.UserId
	userEntity.UpdatedAt = &now
	userEntity.UpdatedBy = &in.SubjectId
	userEntity.ImageUrl = key

	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	user, err := service.adminUserAccountStorage.UserUpdate(tx, &userEntity)
	if err != nil {
		return nil, err
	}

	if in.ProfileImage != nil && currentUser.ImageUrl != nil {
		err := service.cloudStorage.ObjectDelete(*currentUser.ImageUrl)
		if err != nil {
			return nil, err
		}
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(in.ProfileImage, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
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

	roles, err := service.adminUserAccountStorage.UserCaseGetUserRole(user.Id)
	if err != nil {
		return nil, err
	}

	return &UserUpdateOutput{
		UserEntity: user,
		Roles:      roles,
	}, nil
}
