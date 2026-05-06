package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type ObserverAccessCaseDeleteSchoolRequest struct {
	ObserverAccessId int   `params:"observerAccessId" validate:"required"`
	SchoolIds        []int `json:"school_ids" validate:"required"`
}

// ==================== Response ==========================

type ObserverAccessCaseDeleteSchoolResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ObserverAccessCaseDeleteSchool(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ObserverAccessCaseDeleteSchoolRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.ObserverAccessCaseDeleteSchool(&ObserverAccessCaseDeleteSchoolInput{
		SubjectId:                             subjectId,
		ObserverAccessCaseDeleteSchoolRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(&ObserverAccessCaseDeleteSchoolResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type ObserverAccessCaseDeleteSchoolInput struct {
	SubjectId string
	*ObserverAccessCaseDeleteSchoolRequest
}

func (service *serviceStruct) ObserverAccessCaseDeleteSchool(in *ObserverAccessCaseDeleteSchoolInput) error {
	tx, err := service.adminReportPermissionStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.adminReportPermissionStorage.ObserverAccessCaseDeleteSchool(tx, in.ObserverAccessId, in.SchoolIds)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(errors.WithStack(err)))
		return err
	}

	return nil
}
