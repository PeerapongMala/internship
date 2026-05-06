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
type GradeIndicatorGetResponse struct {
	*constant.GradeIndicatorWithAssesmentSetting
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeIndicatorGet(context *fiber.Ctx) error {

	IndicatorId, err := context.ParamsInt("indicatorId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.GradeIndicatorGet(IndicatorId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(GradeIndicatorGetResponse{
			resp,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) GradeIndicatorGet(id int) (*constant.GradeIndicatorWithAssesmentSetting, error) {

	resp, err := service.gradeTemplateStorage.GradeIndicatorWithAssesmentSettingByIndicatorId(id)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
