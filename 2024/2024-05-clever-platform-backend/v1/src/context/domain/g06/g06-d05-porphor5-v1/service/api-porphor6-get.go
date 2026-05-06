package service

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================
type Porphor6GetRequest struct {
	EvaluationFormId int   `params:"evaluationFormId" validate:"required"`
	IDs              []int `query:"id" validate:"required,min=1"`
	SubjectId        string
}

// ==================== Response ==========================
type Porphor6GetResponse struct {
	constant.StatusResponse
	Data []Porphor6GetResponseData `json:"data"`
}

type Porphor6GetResponseData struct {
	constant.Porphor6Data
	DataJson json.RawMessage `json:"data_json"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor6Get(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &Porphor6GetRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	data, err := api.Service.Porphor6Get(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor6GetResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: data,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor6Get(in *Porphor6GetRequest) ([]Porphor6GetResponseData, error) {
	list, err := service.gradePorphor5Storage.GetPorphor6ByFormID(in.EvaluationFormId, in.IDs...)
	if err != nil {
		log.Printf("get list porphor6 error: %+v", err)
		return nil, err
	}

	result := []Porphor6GetResponseData{}
	type studentData struct {
		BirthDate string `json:"birth_date"`
	}

	for _, v := range list {
		v.SchoolAddress, v.SchoolProvince, err = service.gradePorphor5Storage.SchoolAddressGetByFormId(v.FormID)
		if err != nil {
			return nil, err
		}

		var studentData studentData
		err := json.Unmarshal([]byte(v.DataJson), &studentData)
		if err != nil {
			return nil, err
		}

		thaiDate, err := helper.ThaiDateToTime(studentData.BirthDate)
		if err != nil {
			return nil, err
		}
		year, month := helper.CalculateAge(thaiDate)
		v.AgeYear = year
		v.AgeMonth = month

		normalCredits, extraCredits, err := service.gradePorphor5Storage.GradeFormGetCredits(v.FormID)
		if err != nil {
			return nil, err
		}
		v.NormalCredits = normalCredits
		v.ExtraCredits = extraCredits
		v.TotalCredits = normalCredits + extraCredits

		result = append(result, Porphor6GetResponseData{
			Porphor6Data: v,
			DataJson:     json.RawMessage(v.DataJson),
		})
	}

	return result, nil
}
