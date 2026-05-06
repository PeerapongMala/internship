package service

// import (
// 	"log"
// 	"mime/multipart"
// 	"net/http"
// 	"slices"
// 	"time"

// 	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

// 	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
// 	"github.com/gofiber/fiber/v2"
// 	"github.com/google/uuid"
// 	"github.com/jinzhu/copier"
// 	"github.com/pkg/errors"
// 	"github.com/valyala/fasthttp"
// )

// // ==================== Request ==========================

// type StudentCreateRequest struct {
// 	Email               *string               `form:"email"`
// 	Title               string                `form:"title" validate:"required"`
// 	FirstName           string                `form:"first_name" validate:"required,max=50"`
// 	LastName            string                `form:"last_name" validate:"required,max=50"`
// 	ProfileImage        *multipart.FileHeader `form:"profile_image"`
// 	Status              string                `form:"status" validate:"required"`
// 	SchoolId            int                   `form:"school_id" validate:"required"`
// 	StudentId           string                `form:"student_id" validate:"required"`
// 	Year                string                `form:"year" validate:"required"`
// 	IdNumber            *string               `form:"id_number" validate:"required"`
// 	BirthDate           *time.Time            `form:"birth_date"`
// 	Nationality         *string               `form:"nationality"`
// 	Ethnicity           *string               `form:"ethnicity"`
// 	Religion            *string               `form:"religion"`
// 	FatherTitle         *string               `form:"father_title"`
// 	FatherFirstName     *string               `form:"father_first_name"`
// 	FatherLastName      *string               `form:"father_last_name"`
// 	MotherTitle         *string               `form:"mother_title"`
// 	MotherFirstName     *string               `form:"mother_first_name"`
// 	MotherLastName      *string               `form:"mother_last_name"`
// 	ParentRelationship  *string               `form:"parent_relationship"`
// 	ParentTitle         *string               `form:"parent_title"`
// 	ParentFirstName     *string               `form:"parent_first_name"`
// 	ParentLastName      *string               `form:"parent_last_name"`
// 	HouseNumber         *string               `form:"house_number"`
// 	Moo                 *string               `form:"moo"`
// 	District            *string               `form:"district"`
// 	SubDistrict         *string               `form:"sub_district"`
// 	Province            *string               `form:"province"`
// 	PostCode            *string               `form:"post_code"`
// 	ParentMaritalStatus *string               `form:"parent_marital_status"`
// 	Pin                 string                `form:"pin" validate:"required"`
// }

// // ==================== Response ==========================

// type StudentCreateResponse struct {
// 	StatusCode int           `json:"status_code"`
// 	Data       []StudentData `json:"data"`
// 	Message    string        `json:"message"`
// }

// type StudentData struct {
// 	*constant.UserEntity
// 	*constant.StudentEntity
// }

// // ==================== Endpoint ==========================

// // @Id Create Student
// // @Tags Users
// // @Summary Create student
// // @Description เพิ่มนักเรียน
// // @Security BearerAuth
// // @Accept mpfd
// // @Produce json
// // @Param email formData string false "อีเมล"
// // @Param title formData string true "คำนำหน้า"
// // @Param first_name formData string true "ชื่อ"
// // @Param last_name formData string true "นามสกุล"
// // @Param profile_image formData file false "รูปโปรไฟล์"
// // @Param status formData string true "สถานะ (enabled / disabled / draft)"
// // @Param school_id formData int true "Id ของโรงเรียน"
// // @Param student_id formData string true "รหัสนักเรียน"
// // @Param year formData string true "ชั้นปีเช่น ป.1"
// // @Param id_number formData string true "เลขบัตรประจำตัวประชาชน"
// // @Param birth_date formData string false "วันเกิด (format ISO string)"
// // @Param nationality formData string false "สัญชาติ"
// // @Param ethnicity formData string false "เชื้อชาติ"
// // @Param Religion formData string false "ศาสนา"
// // @Param father_title formData string false "คำนำหน้าบิดา"
// // @Param father_first_name formData string false "ชื่อบิดา"
// // @Param father_last_name formData string false "ชื่อมารดา"
// // @Param mother_title formData string false "คำนำหน้ามารดา"
// // @Param mother_first_name formData string false "ชื่อมารดา"
// // @Param mother_last_name formData string false "นามสกุลมารดา"
// // @Param parent_relationship formData string false "ความเกี่ยวข้องกับนักเรียน"
// // @Param parent_title formData string false "คำนำหน้าผู้ปกครอง"
// // @Param parent_first_name formData string false "ชื่อผู้ปกครอง"
// // @Param parent_last_name formData string false "นามสกุลผู้ปกครอง"
// // @Param house_number formData string false "บ้านเลขที่"
// // @Param moo formData string false "หมู่"
// // @Param district formData string false "อำเภอ"
// // @Param sub_district formData string false "ตำบล"
// // @Param province formData string false "จังหวัด"
// // @Param post_code formData string false "รหัสไปรษณียฺ์"
// // @Param parent_marital_status formData string false "สถานภาพสมรสของบิดามารดา"
// // @Param pin formData string true "พิน"
// // @Success 201 {object} UserCreateResponse
// // @Failure 400 {object} helper.HttpErrorResponse
// // @Failure 401 {object} helper.HttpErrorResponse
// // @Failure 403 {object} helper.HttpErrorResponse
// // @Failure 409 {object} helper.HttpErrorResponse
// // @Failure 500 {object} helper.HttpErrorResponse
// // @Router /users/v1/student [post]
// func (api *APIStruct) StudentCreate(context *fiber.Ctx) error {
// 	request, err := helper.ParseAndValidateRequest(context, &StudentCreateRequest{})
// 	if err != nil {
// 		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
// 	}

// 	if !slices.Contains(constant.UserStatusList, constant.UserStatus(request.Status)) {
// 		msg := "Invalid status"
// 		err := helper.NewHttpError(http.StatusBadRequest, &msg)
// 		log.Printf("%+v", errors.WithStack(err))
// 		return helper.RespondHttpError(context, err)
// 	}

// 	profileImage, err := context.FormFile("profile_image")
// 	if err != nil && err != fasthttp.ErrMissingFile {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
// 	}
// 	request.ProfileImage = profileImage

// 	subjectId, ok := context.Locals("subjectId").(string)
// 	if !ok {
// 		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
// 	}

// 	studentCreateOutput, err := api.Service.StudentCreate(&StudentCreateInput{
// 		StudentCreateRequest: request,
// 		SubjectId:            subjectId,
// 	})
// 	if err != nil {
// 		return helper.RespondHttpError(context, err)
// 	}

// 	return context.Status(http.StatusCreated).JSON(StudentCreateResponse{
// 		StatusCode: http.StatusCreated,
// 		Data: []StudentData{{
// 			UserEntity:    studentCreateOutput.UserEntity,
// 			StudentEntity: studentCreateOutput.StudentEntity,
// 		}},
// 		Message: "Student created",
// 	})
// }

// // ==================== Service ==========================

// type StudentCreateInput struct {
// 	*StudentCreateRequest
// 	SubjectId string
// }

// type StudentCreateOutput struct {
// 	*constant.UserEntity
// 	*constant.StudentEntity
// }

// func (service *serviceStruct) StudentCreate(in *StudentCreateInput) (*StudentCreateOutput, error) {
// 	tx, err := service.adminUserAccountStorage.BeginTx()
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer tx.Rollback()

// 	// TODO cloud image upload, created by
// 	userEntity := constant.UserEntity{}
// 	err = copier.Copy(&userEntity, in.StudentCreateRequest)
// 	if err != nil {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return nil, err
// 	}
// 	userEntity.Id = uuid.NewString()
// 	userEntity.CreatedAt = time.Now().UTC()
// 	userEntity.CreatedBy = &in.SubjectId

// 	user, err := service.adminUserAccountStorage.UserCreate(tx, &userEntity)
// 	if err != nil {
// 		return nil, err
// 	}

// 	studentEntity := constant.StudentEntity{}
// 	err = copier.Copy(&studentEntity, in.StudentCreateRequest)
// 	if err != nil {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return nil, err
// 	}
// 	studentEntity.UserId = user.Id

// 	student, err := service.adminUserAccountStorage.StudentCreate(tx, &studentEntity)
// 	if err != nil {
// 		return nil, err
// 	}

// 	_, err = service.adminUserAccountStorage.UserCaseAddUserRole(tx, student.UserId, []int{int(constant.Student)})
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = service.authStorage.AuthCaseAddStudentAuthPin(tx, user.Id, in.Pin)
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return nil, err
// 	}

// 	return &StudentCreateOutput{
// 		UserEntity:    user,
// 		StudentEntity: student,
// 	}, nil
// }
