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
type GradeSubjectGetResponse struct {
	StatusCode int                                  `json:"status_code"`
	Message    string                               `json:"message"`
	Data       []constant.GradeSubjectWithIndicator `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeSubjectGet(context *fiber.Ctx) error {

	templateId, err := context.ParamsInt("gradeTemplateId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeSubjectGet(templateId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeSubjectGetResponse{
		Data:       resp,
		StatusCode: http.StatusOK,
		Message:    "Success",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeSubjectGet(id int) ([]constant.GradeSubjectWithIndicator, error) {

	resp, err := service.gradeTemplateStorage.GradeSubjectByTemplateId(id)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
