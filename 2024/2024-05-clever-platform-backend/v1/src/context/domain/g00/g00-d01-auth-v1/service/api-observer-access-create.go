package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type ObserverAccessCreateRequest struct {
	AccessName          string  `json:"access_name"`
	Name                *string `json:"name"`
	AreaOffice          *string `json:"area_office"`
	DistrictGroup       *string `json:"district_group"`
	District            *string `json:"district"`
	SchoolAffiliationId *int    `json:"school_affiliation_id"`
	Status              string  `json:"status" validate:"required"`
	Schools             []int   `json:"schools"`
}

// ==================== Response ==========================

type ObserverAccessCreateResponse struct {
	StatusCode int                                        `json:"status_code"`
	Data       []constant.ObserverAccessWithSchoolsEntity `json:"data"`
	Message    string                                     `json:"message"`
}

type ObserverAccessData struct {
	Id                  int        `json:"id"`
	AccessName          string     `json:"access_name"`
	Name                *string    `json:"name"`
	AreaOffice          *string    `json:"area_office"`
	DistrictGroup       *string    `json:"district_group"`
	District            *string    `json:"district"`
	SchoolAffiliationId *int       `json:"school_affiliation_id"`
	Status              string     `json:"status"`
	CreatedAt           time.Time  `json:"created_at"`
	CreatedBy           *string    `json:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at"`
	UpdatedBy           *string    `json:"updated_by"`
	Schools             []int      `json:"schools"`
}

// ==================== Endpoint ==========================

// @Id ObserverAccessCreate
// @Tags Auth
// @Summary Create observer access
// @Description Create observer access
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body ObserverAccessCreateRequest true "request"
// @Success 201 {object} ObserverAccessCreateResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/observer-access [post]
func (api *APIStruct) ObserverAccessCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	authCaseAddObserverAccessInput := ObserverAccessCreateInput{}
	err = copier.Copy(&authCaseAddObserverAccessInput, request)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	authCaseAddObserverAccessInput.SubjectId = userId

	authCaseAddObserverAccessOutput, err := api.Service.ObserverAccessCreate(&authCaseAddObserverAccessInput)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(ObserverAccessCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.ObserverAccessWithSchoolsEntity{*authCaseAddObserverAccessOutput.ObserverAccessWithSchoolsEntity},
		Message:    "Observer access created",
	})
}

// ==================== Service ==========================

type ObserverAccessCreateInput struct {
	SubjectId string
	*ObserverAccessCreateRequest
}

type ObserverAccessCreateOutput struct {
	*constant.ObserverAccessWithSchoolsEntity
}

func (service *serviceStruct) ObserverAccessCreate(in *ObserverAccessCreateInput) (*ObserverAccessCreateOutput, error) {
	tx, err := service.authStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	observerAccessEntity := constant.ObserverAccessEntity{}
	err = copier.Copy(&observerAccessEntity, in)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
	}
	observerAccessEntity.CreatedBy = &in.SubjectId

	observerAccess, err := service.authStorage.ObserverAccessCreate(tx, &observerAccessEntity)
	if err != nil {
		return nil, err
	}

	schools, err := service.authStorage.ObserverAccessCaseAddSchool(tx, observerAccess.Id, in.Schools)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ObserverAccessCreateOutput{&constant.ObserverAccessWithSchoolsEntity{
		ObserverAccessEntity: *observerAccess,
		Schools:              schools,
	}}, nil
}
