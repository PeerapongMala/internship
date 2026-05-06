package service

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"os"
	"time"
)

// ==================== Request ==========================

type ParentCaseRegisterRequest struct {
	Provider            string     `params:"provider" validate:"required"`
	ProviderAccessToken string     `json:"provider_access_token" validate:"required"`
	Title               string     `json:"title" validate:"required"`
	FirstName           string     `json:"first_name" validate:"required"`
	LastName            string     `json:"last_name" validate:"required"`
	Email               string     `json:"email" validate:"required"`
	PhoneNo             string     `json:"phone_no" validate:"required"`
	BirthDate           *time.Time `json:"birth_date" `
	Relationship        string     `json:"relationship"`
}

// ==================== Response ==========================

type ParentCaseRegisterResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ParentCaseRegister(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ParentCaseRegisterRequest{}, helper.ParseOptions{
		Body:   true,
		Params: true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = api.Service.ParentCaseRegister(&ParentCaseRegisterInput{
		request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ParentCaseRegisterResponse{
		StatusCode: http.StatusOK,
		Message:    "Bound",
	})
}

// ==================== Service ==========================

type ParentCaseRegisterInput struct {
	*ParentCaseRegisterRequest
}

func (service *serviceStruct) ParentCaseRegister(in *ParentCaseRegisterInput) error {
	getOauthProfileOutput, err := service.GetOauthProfile(&GetOauthProfileInput{
		Provider:         in.Provider,
		OauthAccessToken: in.ProviderAccessToken,
	})
	if err != nil {
		return err
	}

	user, err := service.loginStorage.UserGetBySubjectId(getOauthProfileOutput.SubjectId)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if user != nil {
		msg := "Line account is already bound with existing account"
		return helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	newUserId := uuid.NewString()
	tx, err := service.loginStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.loginStorage.UserCreate(tx, constant.User{
		Id:        newUserId,
		Email:     &in.Email,
		Title:     in.Title,
		FirstName: in.FirstName,
		LastName:  in.LastName,
		Status:    constant.Enabled,
		CreatedAt: time.Now().UTC(),
		CreatedBy: &newUserId,
	})
	if err != nil {
		return err
	}

	if in.Relationship == "" {
		in.Relationship = "parent"
	}
	err = service.loginStorage.ParentCreate(tx, &constant.ParentEntity{
		UserId:       newUserId,
		Relationship: in.Relationship,
		PhoneNumber:  in.PhoneNo,
		BirthDate:    in.BirthDate,
	})
	if err != nil {
		return err
	}

	err = service.loginStorage.AuthOauthCreate(tx, &constant.AuthOauthEntity{
		Provider:  "line",
		UserId:    newUserId,
		SubjectId: getOauthProfileOutput.SubjectId,
	})
	if err != nil {
		return err
	}

	err = service.loginStorage.UserRoleCreate(tx, newUserId, int(constant.Parent))
	if err != nil {
		return err
	}

	richMenuId := os.Getenv("PARENT_RICH_MENU_ID")
	err = service.LinkWithRichMenu(&LinkWithRichMenuInput{
		UserId:     getOauthProfileOutput.SubjectId,
		RichMenuId: richMenuId,
	})
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
