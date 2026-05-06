package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/valyala/fasthttp"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type AnnouncerCreateRequest struct {
	SchoolId     int                   `form:"school_id" validate:"required"`
	Email        string                `form:"email" validate:"required,email"`
	Title        string                `form:"title" validate:"required"`
	FirstName    string                `form:"first_name" validate:"required,max=50"`
	LastName     string                `form:"last_name" validate:"required,max=50"`
	IdNumber     *string               `form:"id_number"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
	Status       string                `form:"status" validate:"required"`
	Password     *string               `form:"password"`
}

// ==================== Response ==========================

type AnnouncerCreateResponse struct {
	StatusCode int             `json:"status_code"`
	Data       []AnnouncerData `json:"data"`
	Message    string          `json:"message"`
}

type AnnouncerData struct {
	SchoolId *int `json:"school_id"`
	*constant.UserEntity
}

// ==================== Endpoint ==========================

func (api *APIStruct) AnnouncerCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &AnnouncerCreateRequest{})
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

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	announcerCreateOutput, err := api.Service.AnnouncerCreate(&AnnouncerCreateInput{
		SubjectId:              subjectId,
		AnnouncerCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(AnnouncerCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []AnnouncerData{{
			SchoolId:   &request.SchoolId,
			UserEntity: announcerCreateOutput.UserEntity,
		}},
		Message: "Announcer created",
	})
}

// ==================== Service ==========================

type AnnouncerCreateInput struct {
	SubjectId string
	*AnnouncerCreateRequest
}

type AnnouncerCreateOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) AnnouncerCreate(in *AnnouncerCreateInput) (*AnnouncerCreateOutput, error) {
	var key *string
	if in.ProfileImage != nil {
		imageKey := uuid.NewString()
		key = &imageKey
	}

	tx, err := service.adminSchoolStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	user, err := service.adminSchoolStorage.UserCreate(tx, &constant.UserEntity{
		Id:        uuid.NewString(),
		Email:     &in.Email,
		Title:     in.Title,
		FirstName: in.FirstName,
		LastName:  in.LastName,
		ImageUrl:  key,
		IdNumber:  in.IdNumber,
		Status:    in.Status,
		CreatedAt: time.Now().UTC(),
		CreatedBy: &in.SubjectId,
	})
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

	// add announcer role
	_, err = service.adminSchoolStorage.UserCaseAddUserRole(tx, user.Id, []int{int(constant.Announcer)})
	if err != nil {
		return nil, err
	}

	// add announcer school
	err = service.adminSchoolStorage.AnnouncerCaseAddSchool(tx, &constant.SchoolAnnouncerEntity{
		SchoolId: in.SchoolId,
		UserId:   user.Id,
	})
	if err != nil {
		return nil, err
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(in.ProfileImage, *key, cloudStorageConstant.Image)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
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

	return &AnnouncerCreateOutput{
		user,
	}, nil
}
