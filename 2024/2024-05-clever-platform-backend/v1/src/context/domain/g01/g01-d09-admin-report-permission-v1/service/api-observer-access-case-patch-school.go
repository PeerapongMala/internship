package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"time"
)

// ==================== Request ==========================

type ObserverAccessCasePatchSchoolRequest struct {
	ObserverAccessId *int  `params:"observerAccessId" validate:"required"`
	SchoolIds        []int `json:"school_ids" validate:"required"`
}

// ==================== Response ==========================

type ObserverAccessCasePatchSchoolResponse struct {
	StatusCode int    `json:"status_code"`
	Data       []int  `json:"data"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessCasePatchSchool(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessCasePatchSchoolRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerAccessCasePatchSchoolOutput, err := api.Service.ObserverAccessCasePatchSchool(&ObserverAccessCasePatchSchoolInput{
		SubjectId:                            subjectId,
		ObserverAccessCasePatchSchoolRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverAccessCasePatchSchoolResponse{
		StatusCode: http.StatusOK,
		Data:       observerAccessCasePatchSchoolOutput.SchoolIds,
		Message:    "Patched",
	})
}

// ==================== Service ==========================

type ObserverAccessCasePatchSchoolInput struct {
	SubjectId string
	*ObserverAccessCasePatchSchoolRequest
}

type ObserverAccessCasePatchSchoolOutput struct {
	SchoolIds []int
}

func (service *serviceStruct) ObserverAccessCasePatchSchool(in *ObserverAccessCasePatchSchoolInput) (*ObserverAccessCasePatchSchoolOutput, error) {
	tx, err := service.adminReportPermissionStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	schoolIds, err := service.adminReportPermissionStorage.ObserverAccessCasePatchSchool(tx, in.ObserverAccessId, in.SchoolIds)
	if err != nil {
		return nil, err
	}

	observerAccess, err := service.adminReportPermissionStorage.ObserverAccessGet(in.ObserverAccessId)
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()
	observerAccess.UpdatedAt = &now
	observerAccess.UpdatedBy = &in.SubjectId
	_, err = service.adminReportPermissionStorage.ObserverAccessUpdate(tx, observerAccess)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &ObserverAccessCasePatchSchoolOutput{
		schoolIds,
	}, nil
}
