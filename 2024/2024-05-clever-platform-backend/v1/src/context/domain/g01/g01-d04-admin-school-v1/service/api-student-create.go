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

type StudentCreateRequest struct {
	Email               *string               `form:"email"`
	Title               string                `form:"title" validate:"required"`
	FirstName           string                `form:"first_name" validate:"required,max=50"`
	LastName            string                `form:"last_name" validate:"required,max=50"`
	ProfileImage        *multipart.FileHeader `form:"profile_image"`
	Status              string                `form:"status" validate:"required"`
	SchoolId            int                   `form:"school_id" validate:"required"`
	StudentId           string                `form:"student_id" validate:"required"`
	Year                string                `form:"year"`
	IdNumber            *string               `form:"id_number" validate:"required"`
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
	Pin                 *string               `form:"pin"`
}

// ==================== Response ==========================

type StudentCreateResponse struct {
	StatusCode int                          `json:"status_code"`
	Data       []constant.StudentDataEntity `json:"data"`
	Message    string                       `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	profileImage, err := context.FormFile("profile_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		return helper.RespondHttpError(context, err)
	}
	request.ProfileImage = profileImage

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studentCreateOutput, err := api.Service.StudentCreate(&StudentCreateInput{
		StudentCreateRequest: request,
		SubjectId:            subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StudentCreateResponse{
		StatusCode: http.StatusOK,
		Data:       []constant.StudentDataEntity{*studentCreateOutput.StudentDataEntity},
		Message:    "Student created",
	})

}

// // ==================== Service ==========================

type StudentCreateInput struct {
	*StudentCreateRequest
	SubjectId string
}

type StudentCreateOutput struct {
	*constant.StudentDataEntity
}

func (service *serviceStruct) StudentCreate(in *StudentCreateInput) (*StudentCreateOutput, error) {
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
	err = copier.Copy(&studentDataEntity, in.StudentCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	studentDataEntity.Id = uuid.NewString()
	studentDataEntity.ImageUrl = key
	studentDataEntity.CreatedAt = time.Now().UTC()
	studentDataEntity.CreatedBy = &in.SubjectId

	studentData, err := service.adminSchoolStorage.StudentCreate(tx, &studentDataEntity)
	if err != nil {
		return nil, err
	}

	if in.Pin != nil {
		_, err = service.adminSchoolStorage.AuthPinCreate(tx, &constant.AuthPinEntity{
			UserId: studentData.UserId,
			Pin:    *in.Pin,
		})
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

	if studentData.ImageUrl != nil {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*studentData.ImageUrl)
		if err != nil {
			return nil, err
		}
		studentData.ImageUrl = url
	}

	return &StudentCreateOutput{
		StudentDataEntity: studentData,
	}, nil
}
