package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Response ==========================
type GradeSubjectDeleteResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeSubjectDelete(context *fiber.Ctx) error {

	indicatorId, err := context.ParamsInt("indicatorId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = api.Service.GradeSubjectDelete(indicatorId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeSubjectUpdateResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeSubjectDelete(id int) error {

	err := service.gradeTemplateStorage.DeleteGradeAssesmentSettingByIndicatorId(id)
	if err != nil {
		return err
	}

	err = service.gradeTemplateStorage.DeleteGradeIndicatorById(id)
	if err != nil {
		return err
	}

	return nil
}
