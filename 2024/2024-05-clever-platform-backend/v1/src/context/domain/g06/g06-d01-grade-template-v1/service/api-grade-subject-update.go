package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Request ==========================
type GradeSubjectUpdateRequest struct {
	Data            []constant.GradeSubjectWithIndicator `json:"data"`
	SubjectId       string                               `json:"-"`
	GradeTemplateId int                                  `json:"-"`
}

// ==================== Response ==========================
type GradeSubjectUpdateResponse struct {
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) GradeSubjectUpdate(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &GradeSubjectUpdateRequest{})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	templateId, err := context.ParamsInt("gradeTemplateId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.SubjectId = subjectId
	request.GradeTemplateId = templateId
	err = api.Service.GradeSubjectUpdate(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
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
func (service *serviceStruct) GradeSubjectUpdate(in *GradeSubjectUpdateRequest) error {

	sqlTx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer sqlTx.Rollback()

	for _, Subject := range in.Data {
		err := service.gradeTemplateStorage.TemplateSubjectUpdate(sqlTx, Subject.SubjectId, Subject.CleverSubjectTemplateId)
		if err != nil {
			return err
		}
		var activeIndicatorID []int
		for _, indicator := range Subject.Indicators {
			if indicator.Id != nil {
				err = service.gradeTemplateStorage.GradeIndicatorUpdate(sqlTx, &indicator)
				if err != nil {
					return err
				}
			} else {
				indicator.TemplateSubjectId = Subject.SubjectId
				id, err := service.gradeTemplateStorage.GradeIndicatorInsert(sqlTx, &indicator)
				if err != nil {
					return err
				}
				indicator.Id = &id
			}

			activeIndicatorID = append(activeIndicatorID, *indicator.Id)

			for _, setting := range indicator.Setting {
				if setting.Id != nil {
					err = service.gradeTemplateStorage.GradeAssesmentSettingUpdate(sqlTx, &setting)
					if err != nil {
						return err
					}
				} else {
					setting.TemplateIndicatorId = indicator.Id
					_, err = service.gradeTemplateStorage.GradeAssesmentSettingInsert(sqlTx, &setting)
					if err != nil {
						return err
					}
				}
			}
		}

		err = service.gradeTemplateStorage.DeleteGradeIndicatorAndSettingNotActive(sqlTx, Subject.SubjectId, activeIndicatorID)
		if err != nil {
			log.Printf("DeleteGradeIndicatorAndSettingNotActive %+v", errors.WithStack(err))
			return err
		}
	}

	err = sqlTx.Commit()
	if err != nil {
		return err
	}

	return nil
}
