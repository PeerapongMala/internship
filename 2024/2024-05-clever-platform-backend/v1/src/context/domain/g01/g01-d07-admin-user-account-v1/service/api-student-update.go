package service

import (
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

// ==================== Request ==========================

type StudentUpdateRequest struct {
	Title               string                `form:"title"`
	FirstName           string                `form:"first_name"`
	LastName            string                `form:"last_name"`
	ProfileImage        *multipart.FileHeader `form:"profile_image"`
	Status              string                `form:"status"`
	StudentId           string                `form:"student_id"`
	Year                string                `form:"year"`
	IdNumber            string                `form:"id_number"`
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

// @Id StudentUpdate
// @Tags Users
// @Summary Update Student
// @Description Update Student
// @Security BearerAuth
// @Accept mpfd
// @Produce json
// @Param userId path string true "userId"
// @Param title formData string false "คำนำหน้า"
// @Param first_name formData string false "ชื่อ"
// @Param last_name formData string false "นามสกุล"
// @Param profile_image formData file false "รูปโปรไฟล์"
// @Param status formData string false "สถานะ (enabled / disabled / draft)"
// @Param school_id formData int false "Id ของโรงเรียน"
// @Param student_id formData string false "รหัสนักเรียน"
// @Param year formData string false "ชั้นปีเช่น ป.1"
// @Param id_number formData string false "เลขบัตรประจำตัวประชาชน"
// @Param birth_date formData string false "วันเกิด (format ISO string)"
// @Param nationality formData string false "สัญชาติ"
// @Param ethnicity formData string false "เชื้อชาติ"
// @Param Religion formData string false "ศาสนา"
// @Param father_title formData string false "คำนำหน้าบิดา"
// @Param father_first_name formData string false "ชื่อบิดา"
// @Param father_last_name formData string false "ชื่อมารดา"
// @Param mother_title formData string false "คำนำหน้ามารดา"
// @Param mother_first_name formData string false "ชื่อมารดา"
// @Param mother_last_name formData string false "นามสกุลมารดา"
// @Param parent_relationship formData string false "ความเกี่ยวข้องกับนักเรียน"
// @Param parent_title formData string false "คำนำหน้าผู้ปกครอง"
// @Param parent_first_name formData string false "ชื่อผู้ปกครอง"
// @Param parent_last_name formData string false "นามสกุลผู้ปกครอง"
// @Param house_number formData string false "บ้านเลขที่"
// @Param moo formData string false "หมู่"
// @Param district formData string false "อำเภอ"
// @Param sub_district formData string false "ตำบล"
// @Param province formData string false "จังหวัด"
// @Param post_code formData string false "รหัสไปรษณียฺ์"
// @Param parent_marital_status formData string false "สถานภาพสมรสของบิดามารดา"
// @Success 200 {object} AuthCaseUpdatePasswordResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /users/v1/student/{userId} [patch]
func (api *APIStruct) StudentUpdate(context *fiber.Ctx) error {
	userId := context.Params("userId")
	request, err := helper.ParseAndValidateRequest(context, &StudentUpdateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request.Status != "" {
		if !slices.Contains(constant.UserStatusList, constant.UserStatus(request.Status)) {
			log.Printf("Status: %s doesn't exist", request.Status)
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
		}
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
		Data: []constant.StudentDataEntity{{
			UserEntity:    studentUpdateOutput.UserEntity,
			StudentEntity: studentUpdateOutput.StudentEntity,
		}},
		Message: "Student updated",
	})
}

// ==================== Service ===========================

type StudentUpdateInput struct {
	UserId string
	*StudentUpdateRequest
	SubjectId string
}

type StudentUpdateOutput struct {
	*constant.UserEntity
	*constant.StudentEntity
}

func (service *serviceStruct) StudentUpdate(in *StudentUpdateInput) (*StudentUpdateOutput, error) {
	userEntity := constant.UserEntity{}
	err := copier.Copy(&userEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	userEntity.Id = in.UserId
	now := time.Now().UTC()
	userEntity.UpdatedAt = &now
	userEntity.UpdatedBy = &in.SubjectId

	tx, err := service.adminUserAccountStorage.BeginTx()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer tx.Rollback()

	user, err := service.adminUserAccountStorage.UserUpdate(tx, &userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	studentEntity := constant.StudentEntity{}
	err = copier.Copy(&studentEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	studentEntity.UserId = in.UserId

	student, err := service.adminUserAccountStorage.StudentUpdate(tx, &studentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &StudentUpdateOutput{
		UserEntity:    user,
		StudentEntity: student,
	}, nil
}
