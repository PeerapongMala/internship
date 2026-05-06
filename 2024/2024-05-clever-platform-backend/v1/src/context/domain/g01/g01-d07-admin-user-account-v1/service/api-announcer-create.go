package service

// import (
// 	"log"
// 	"mime/multipart"
// 	"net/http"
// 	"slices"
// 	"time"

// 	authConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
// 	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

// 	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
// 	"github.com/gofiber/fiber/v2"
// 	"github.com/google/uuid"
// 	"github.com/pkg/errors"
// )

// // ==================== Request ==========================

// type AnnouncerCreateRequest struct {
// 	SchoolId     int                   `form:"school_id" validate:"required"`
// 	Email        string                `form:"email" validate:"required,email"`
// 	Title        string                `form:"title" validate:"required"`
// 	FirstName    string                `form:"first_name" validate:"required,max=50"`
// 	LastName     string                `form:"last_name" validate:"required,max=50"`
// 	IdNumber     *string               `form:"id_number"`
// 	ProfileImage *multipart.FileHeader `form:"profile_image"`
// 	Status       string                `form:"status" validate:"required"`
// 	Password     string                `form:"password" validate:"required"`
// }

// // ==================== Response ==========================

// type AnnouncerCreateResponse struct {
// 	StatusCode int             `json:"status_code"`
// 	Data       []AnnouncerData `json:"data"`
// 	Message    string          `json:"message"`
// }

// type AnnouncerData struct {
// 	SchoolId *int `json:"school_id"`
// 	*constant.UserEntity
// }

// // ==================== Endpoint ==========================

// // @Id AnnouncerCreate
// // @Tags Users
// // @Summary Create Announcer
// // @Description เพิ่มฝ่ายประชาสัมพันธ์
// // @Security BearerAuth
// // @Accept mpfd
// // @Produce json
// // @Param school_id formData string true "school_id"
// // @Param email formData string true "email"
// // @Param title formData string true "title"
// // @Param first_name formData string true "first_name"
// // @Param last_name formData string true "last_name"
// // @Param id_number formData string true "id_number"
// // @Param profile_image formData file false "profile_image"
// // @Param status formData string true "status (enabled / disabled / draft)"
// // @Param password formData string true "password"
// // @Success 201 {object} AnnouncerCreateResponse
// // @Failure 400 {object} helper.HttpErrorResponse
// // @Failure 401 {object} helper.HttpErrorResponse
// // @Failure 403 {object} helper.HttpErrorResponse
// // @Failure 409 {object} helper.HttpErrorResponse
// // @Failure 500 {object} helper.HttpErrorResponse
// // @Router /users/v1/announcer [post]
// func (api *APIStruct) AnnouncerCreate(context *fiber.Ctx) error {
// 	request, err := helper.ParseAndValidateRequest(context, &AnnouncerCreateRequest{})
// 	if err != nil {
// 		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
// 	}

// 	if !slices.Contains(constant.UserStatusList, constant.UserStatus(request.Status)) {
// 		msg := "Invalid status"
// 		err := helper.NewHttpError(http.StatusBadRequest, &msg)
// 		log.Printf("%+v", errors.WithStack(err))
// 		return helper.RespondHttpError(context, err)
// 	}

// 	subjectId, ok := context.Locals("subjectId").(string)
// 	if !ok {
// 		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
// 	}
// 	announcerCreateOutput, err := api.Service.AnnouncerCreate(&AnnouncerCreateInput{
// 		SubjectId:              subjectId,
// 		AnnouncerCreateRequest: request,
// 	})
// 	if err != nil {
// 		return helper.RespondHttpError(context, err)
// 	}

// 	return context.Status(http.StatusCreated).JSON(AnnouncerCreateResponse{
// 		StatusCode: http.StatusCreated,
// 		Data: []AnnouncerData{{
// 			SchoolId:   &request.SchoolId,
// 			UserEntity: announcerCreateOutput.UserEntity,
// 		}},
// 		Message: "Announcer created",
// 	})
// }

// // ==================== Service ==========================

// type AnnouncerCreateInput struct {
// 	SubjectId string
// 	*AnnouncerCreateRequest
// }

// type AnnouncerCreateOutput struct {
// 	*constant.UserEntity
// }

// func (service *serviceStruct) AnnouncerCreate(in *AnnouncerCreateInput) (*AnnouncerCreateOutput, error) {
// 	tx, err := service.adminUserAccountStorage.BeginTx()
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer tx.Rollback()

// 	// TODO cloud image upload, created by
// 	user, err := service.adminUserAccountStorage.UserCreate(tx, &constant.UserEntity{
// 		Id:        uuid.NewString(),
// 		Email:     &in.Email,
// 		Title:     in.Title,
// 		FirstName: in.FirstName,
// 		LastName:  in.LastName,
// 		IdNumber:  in.IdNumber,
// 		Status:    in.Status,
// 		CreatedAt: time.Now().UTC(),
// 		CreatedBy: &in.SubjectId,
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

// 	// add announcer role
// 	_, err = service.adminUserAccountStorage.UserCaseAddUserRole(tx, user.Id, []int{int(constant.Announcer)})
// 	if err != nil {
// 		return nil, err
// 	}

// 	// add announcer school
// 	err = service.adminUserAccountStorage.AnnouncerCaseAddSchool(tx, &constant.SchoolAnnouncerEntity{
// 		SchoolId: in.SchoolId,
// 		UserId:   user.Id,
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

// 	// add announcer password
// 	passwordHash, err := helper.HashAndSalt(in.Password)
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = service.authStorage.AuthCaseAddUserAuthEmailPassword(tx, &authConstant.AuthEmailPasswordEntity{
// 		UserId:       user.Id,
// 		PasswordHash: *passwordHash,
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return nil, err
// 	}

// 	return &AnnouncerCreateOutput{
// 		user,
// 	}, nil
// }
