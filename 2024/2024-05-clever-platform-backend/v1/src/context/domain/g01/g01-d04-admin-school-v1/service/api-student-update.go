package service

import (
	"log"
	"mime/multipart"
	"net/http"
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

type StudentUpdateRequest struct {
	Email               *string               `form:"email"`
	Title               string                `form:"title"`
	FirstName           string                `form:"first_name" validate:"max=50"`
	LastName            string                `form:"last_name" validate:"max=50"`
	ProfileImage        *multipart.FileHeader `form:"profile_image"`
	Status              string                `form:"status"`
	StudentId           string                `form:"student_id"`
	Year                string                `form:"year"`
	IdNumber            *string               `form:"id_number"`
	BirthDate           *time.Time            `form:"birth_date"`
	Nationality         *string               `form:"nationality"`
	Ethnicity           *string               `form:"ethnicity"`
	Religion            *string               `form:"religion"`
	FatherTitle         *string               `form:"father_title"`
	FatherFirstName     *string               `form:"father_first_name"`
	FatherLastName      *string               `form:"father_last_name"`
	MotherTitle         *string               `form:"mother_title"`
	MotherFirstName     *string               `form:"mother_first_name"`
	MotherLastName      *string               `form:"mother_last_name"`
	ParentRelationship  *string               `form:"parent_relationship"`
	ParentTitle         *string               `form:"parent_title"`
	ParentFirstName     *string               `form:"parent_first_name"`
	ParentLastName      *string               `form:"parent_last_name"`
	HouseNumber         *string               `form:"house_number"`
	Moo                 *string               `form:"moo"`
	District            *string               `form:"district"`
	SubDistrict         *string               `form:"sub_district"`
	Province            *string               `form:"province"`
	PostCode            *string               `form:"post_code"`
	ParentMaritalStatus *string               `form:"parent_marital_status"`
}

// ==================== Response ==========================

type StudentUpdateResponse struct {
	StatusCode int                          `json:"status_code"`
	Data       []constant.StudentDataEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentUpdate(context *fiber.Ctx) error {
	userId := context.Params("userId")
	request, err := helper.ParseAndValidateRequest(context, &StudentUpdateRequest{})
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

	studentUpdateOutput, err := api.Service.StudentUpdate(&StudentUpdateInput{
		UserId:               userId,
		StudentUpdateRequest: request,
		SubjectId:            subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.StudentDataEntity{*studentUpdateOutput.StudentDataEntity},
		Message:    "Student updated",
	})
}

// ==================== Service ==========================

type StudentUpdateInput struct {
	UserId string
	*StudentUpdateRequest
	SubjectId string
}

type StudentUpdateOutput struct {
	*constant.StudentDataEntity
}

func (service *serviceStruct) StudentUpdate(in *StudentUpdateInput) (*StudentUpdateOutput, error) {
	currentStudent, err := service.adminSchoolStorage.UserGet(in.UserId)
	if err != nil {
		return nil, err
	}

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

	studentDataEntity := constant.StudentDataEntity{}
	err = copier.Copy(&studentDataEntity, in.StudentUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	studentDataEntity.Id = currentStudent.Id
	if key != nil {
		studentDataEntity.ImageUrl = key
	}
	now := time.Now().UTC()
	studentDataEntity.UpdatedAt = &now
	studentDataEntity.UpdatedBy = &in.SubjectId

	studentData, err := service.adminSchoolStorage.StudentUpdate(tx, &studentDataEntity)
	if err != nil {
		return nil, err
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(in.ProfileImage, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil, err
		}
	}

	if in.ProfileImage != nil && currentStudent.ImageUrl != nil {
		err := service.cloudStorage.ObjectDelete(*currentStudent.ImageUrl)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if studentData.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*studentData.ImageUrl)
		if err != nil {
			return nil, err
		}
		studentData.ImageUrl = url
	}

	return &StudentUpdateOutput{
		StudentDataEntity: studentData,
	}, nil
}
