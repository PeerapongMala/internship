package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"

	"log"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type TeacherCreateRequest struct {
	SchoolId        int                   `form:"school_id" validate:"required"`
	Title           string                `form:"title" validate:"required"`
	FirstName       string                `form:"first_name" validate:"required"`
	LastName        string                `form:"last_name" validate:"required"`
	Email           string                `form:"email" validate:"required,email"`
	ProfileImage    *multipart.FileHeader `form:"profile_image"`
	Status          string                `form:"status" validate:"required"`
	Password        *string               `form:"password"`
	TeacherAccesses []int                 `form:"teacher_accesses"`
}

// ==================== Response ==========================

type TeacherCreateResponse struct {
	StatusCode int                       `json:"status_code"`
	Data       []TeacherWithAccessesData `json:"data"`
	Message    string                    `json:"message"`
}

type TeacherWithAccessesData struct {
	*constant.UserEntity
	TeacherAccesses []int `json:"teacher_accesses"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) TeacherCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	profileImage, err := context.FormFile("profile_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	request.ProfileImage = profileImage

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	teacherCreateOutput, err := api.Service.TeacherCreate(&TeacherCreateInput{
		SubjectId:            subjectId,
		TeacherCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(TeacherCreateResponse{
		StatusCode: http.StatusCreated,
		Data: []TeacherWithAccessesData{{
			UserEntity:      teacherCreateOutput.UserEntity,
			TeacherAccesses: teacherCreateOutput.TeacherAccesses,
		}},
		Message: "Teacher created",
	})
}

// ==================== Service ==========================

type TeacherCreateInput struct {
	SubjectId string
	*TeacherCreateRequest
}

type TeacherCreateOutput struct {
	*constant.UserEntity
	TeacherAccesses []int
}

func (service *serviceStruct) TeacherCreate(in *TeacherCreateInput) (*TeacherCreateOutput, error) {
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

	_, err = service.adminSchoolStorage.UserCaseAddUserRole(tx, user.Id, []int{int(constant.Teacher)})
	if err != nil {
		return nil, err
	}

	err = service.adminSchoolStorage.SchoolCaseAddTeacher(tx, in.SchoolId, user.Id)
	if err != nil {
		return nil, err
	}

	err = service.adminSchoolStorage.TeacherCaseUpdateTeacherAccesses(tx, user.Id, in.TeacherAccesses)
	if err != nil {
		return nil, err
	}

	if in.ProfileImage != nil {
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

	return &TeacherCreateOutput{
		UserEntity:      user,
		TeacherAccesses: in.TeacherAccesses,
	}, nil
}
