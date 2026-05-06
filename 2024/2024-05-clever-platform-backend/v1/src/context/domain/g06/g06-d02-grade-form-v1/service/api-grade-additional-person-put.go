package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type AdditionalPersonPutRequest struct {
	Data      []constant.GradeEvaluationAdditionalPersonData `json:"data"`
	SubjectId string                                         `json:"-"`
	FormId    int                                            `json:"-"`
}

// ==================== Response ==========================
type AdditionalPersonPutResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) AdditionalPersonPut(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &AdditionalPersonPutRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	id, err := context.ParamsInt("evaluationFormId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if id == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.FormId = id
	request.SubjectId = subjectId
	err = api.Service.AdditionalPersonPut(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AdditionalPersonPutResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) AdditionalPersonPut(in *AdditionalPersonPutRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}

	//delete all additional_person
	err = service.gradeFormStorage.DeleteAllAdditionalPersonByFormId(sqlTx, in.FormId)
	if err != nil {
		return err
	}

	for _, data := range in.Data {
		for _, person := range data.PersonData {
			_, err = service.gradeFormStorage.InsertAdditionalPerson(sqlTx, &constant.GradeEvaluationFormAdditionalPersonEntity{
				FormId:    &in.FormId,
				ValueType: data.Type,
				ValueId:   data.Id,
				UserType:  person.UserType,
				UserId:    person.UserId,
			})
			if err != nil {
				return err
			}
		}
	}

	err = service.gradeFormStorage.AdditionalPersonPrefill(sqlTx, in.FormId, in.SubjectId)
	if err != nil {
		return err
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
