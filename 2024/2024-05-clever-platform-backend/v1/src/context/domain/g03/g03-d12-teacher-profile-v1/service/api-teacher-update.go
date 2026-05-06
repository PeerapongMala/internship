package service

import (
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d12-teacher-profile-v1/constant"
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

type TeacherUpdateRequest struct {
	Title        string                `form:"title"`
	FirstName    string                `form:"first_name"`
	LastName     string                `form:"last_name"`
	ProfileImage *multipart.FileHeader `form:"profile_image"`
}

// ==================== Response ==========================

type TeacherUpdateResponse struct {
	StatusCode int                   `json:"status_code"`
	Data       []constant.UserEntity `json:"data"`
	Message    string                `json:"message"`
}

func (api *APIStruct) TeacherUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherUpdateRequest{})
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

	teacherUpdateOutput, err := api.Service.TeacherUpdate(&TeacherUpdateInput{
		SubjectId:            subjectId,
		TeacherUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.UserEntity{*teacherUpdateOutput.UserEntity},
		Message:    "Teacher updated",
	})
}

// ==================== Service ==========================

type TeacherUpdateInput struct {
	SubjectId string
	*TeacherUpdateRequest
}

type TeacherUpdateOutput struct {
	*constant.UserEntity
}

func (service *serviceStruct) TeacherUpdate(in *TeacherUpdateInput) (*TeacherUpdateOutput, error) {
	user, err := service.teacherProfileStorage.UserGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	userEntity := constant.UserEntity{}
	err = copier.Copy(&userEntity, in.TeacherUpdateRequest)
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

	teacher, err := service.teacherProfileStorage.UserUpdate(nil, &userEntity)
	if err != nil {
		return nil, err
	}

	if teacher.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*teacher.ImageUrl)
		if err != nil {
			return nil, err
		}
		teacher.ImageUrl = url
	}

	return &TeacherUpdateOutput{
		teacher,
	}, nil
}
