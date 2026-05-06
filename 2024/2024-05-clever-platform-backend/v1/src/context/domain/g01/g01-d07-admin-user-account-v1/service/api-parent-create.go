package service

// import (
// 	"log"
// 	"mime/multipart"
// 	"net/http"
// 	"time"

// 	authConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
// 	authService "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/service"
// 	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

// 	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
// 	"github.com/gofiber/fiber/v2"
// 	"github.com/google/uuid"
// 	"github.com/jinzhu/copier"
// 	"github.com/pkg/errors"
// )

// // ==================== Request ==========================

// type ParentCreateRequest struct {
// 	Provider            string                `form:"provider" validate:"required"`
// 	ProviderAccessToken string                `form:"provider_access_token" validate:"required"`
// 	Email               string                `form:"email" validate:"required,email"`
// 	Title               string                `form:"title" validate:"required"`
// 	FirstName           string                `form:"first_name" validate:"required"`
// 	LastName            string                `form:"last_name" validate:"required"`
// 	IdNumber            *string               `form:"id_number"`
// 	ProfileImage        *multipart.FileHeader `form:"profile_image"`
// 	Password            string                `form:"password" validate:"required"`
// 	PhoneNumber         string                `form:"phone_number" validate:"required"`
// 	BirthDate           time.Time             `form:"birth_date" validate:"required"`
// 	Relationship        string                `form:"relationship" validate:"required"`
// }

// // ==================== Response ==========================

// type ParentCreateResponse struct {
// 	StatusCode int          `json:"status_code"`
// 	Data       []ParentData `json:"data"`
// 	Message    string       `json:"message"`
// }

// type ParentData struct {
// 	*constant.UserEntity
// 	*constant.ParentEntity
// }

// // ==================== Endpoint ==========================

// // @Id ParentCreate
// // @Tags Users
// // @Summary Register Parent
// // @Description สร้างบัญชีผู้ปกครอง
// // @Security BearerAuth
// // @Accept mpfd
// // @Produce json
// // @Param provider formData string true "provider (line / google / thaid)"
// // @Param provider_access_token formData string true "provider_access_token"
// // @Param email formData string true "email"
// // @Param title formData string true "title"
// // @Param first_name formData string true "first_name"
// // @Param last_name formData string true "last_name"
// // @Param id_number formData string false "id_number"
// // @Param profile_image formData file false "profile_image"
// // @Param password formData string true "password"
// // @Param phone_number formData string true "phone_number"
// // @Param birth_date formData string true "birth_date"
// // @Param relationship formData string true "relationship"
// // @Success 201 {object} ParentCreateResponse
// // @Failure 400 {object} helper.HttpErrorResponse
// // @Failure 401 {object} helper.HttpErrorResponse
// // @Failure 403 {object} helper.HttpErrorResponse
// // @Failure 409 {object} helper.HttpErrorResponse
// // @Failure 500 {object} helper.HttpErrorResponse
// // @Router /users/v1/parent [post]
// func (api *APIStruct) ParentCreate(context *fiber.Ctx) error {
// 	request, err := helper.ParseAndValidateRequest(context, &ParentCreateRequest{})
// 	if err != nil {
// 		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
// 	}

// 	parentCreateOutput, err := api.Service.ParentCreate(&ParentCreateInput{
// 		ParentCreateRequest: request,
// 	})
// 	if err != nil {
// 		return helper.RespondHttpError(context, err)
// 	}

// 	return context.Status(http.StatusCreated).JSON(ParentCreateResponse{
// 		StatusCode: http.StatusCreated,
// 		Data: []ParentData{{
// 			UserEntity:   parentCreateOutput.UserEntity,
// 			ParentEntity: parentCreateOutput.ParentEntity,
// 		}},
// 		Message: "Registered",
// 	})
// }

// // ==================== Endpoint ==========================

// type ParentCreateInput struct {
// 	*ParentCreateRequest
// }

// type ParentCreateOutput struct {
// 	*constant.UserEntity
// 	*constant.ParentEntity
// }

// func (service *serviceStruct) ParentCreate(in *ParentCreateInput) (*ParentCreateOutput, error) {
// 	tx, err := service.adminUserAccountStorage.BeginTx()
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer tx.Rollback()

// 	userEntity := constant.UserEntity{}
// 	err = copier.Copy(&userEntity, in)
// 	if err != nil {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return nil, err
// 	}
// 	userEntity.Id = uuid.NewString()
// 	userEntity.Status = string(constant.Enabled)
// 	userEntity.CreatedAt = time.Now().UTC()

// 	user, err := service.adminUserAccountStorage.UserCreate(tx, &userEntity)
// 	if err != nil {
// 		return nil, err
// 	}

// 	parent, err := service.adminUserAccountStorage.ParentCreate(tx, &constant.ParentEntity{
// 		UserId:       user.Id,
// 		Relationship: in.Relationship,
// 		PhoneNumber:  in.PhoneNumber,
// 		BirthDate:    in.BirthDate,
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

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

// 	authCaseFindOAuthProfileOutput, err := service.authService.AuthCaseFindOAuthProfile(&authService.AuthCaseFindOAuthProfileInput{
// 		Provider:            &in.Provider,
// 		ProviderAccessToken: &in.ProviderAccessToken,
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = service.authStorage.AuthCaseAddUserAuthOAuth(tx, &authConstant.AuthOAuthEntity{
// 		Provider:  &in.Provider,
// 		UserId:    &user.Id,
// 		SubjectId: authCaseFindOAuthProfileOutput.SubjectId,
// 	})
// 	if err != nil {
// 		return nil, err
// 	}

// 	_, err = service.adminUserAccountStorage.UserCaseAddUserRole(tx, user.Id, []int{int(constant.Parent)})
// 	if err != nil {
// 		return nil, err
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		log.Printf("%+v", errors.WithStack(err))
// 		return nil, err
// 	}

// 	return &ParentCreateOutput{
// 		UserEntity:   user,
// 		ParentEntity: parent,
// 	}, nil
// }
