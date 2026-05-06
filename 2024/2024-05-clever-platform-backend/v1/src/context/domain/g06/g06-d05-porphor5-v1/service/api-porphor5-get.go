package service

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"sort"
	"time"
)

// ==================== Request ==========================
type Porphor5GetRequest struct {
	EvaluationFormId int   `params:"evaluationFormId" validate:"required"`
	IDs              []int `query:"id" validate:"required,min=1"`
	SubjectId        string
}

// ==================== Response ==========================
type Porphor5GetResponse struct {
	constant.StatusResponse
	Data []Porphor5GetResponseData `json:"data"`
}

type Porphor5GetResponseData struct {
	ID        int                       `json:"id"`
	FormID    int                       `json:"form_id"`
	Order     int                       `json:"order"`
	Name      constant.Porphor5Category `json:"name"`
	DataJson  json.RawMessage           `json:"data_json"`
	CreatedAt time.Time                 `json:"created_at"`

	StudentList    []Porphor5StudentList `json:"student_list,omitempty"`
	AdditionalData json.RawMessage       `json:"additional_data"`
	Mode           map[string][]int      `json:"mode"`
}

type Porphor5StudentList struct {
	Id            int    `json:"id"`
	No            int    `json:"no"`
	Title         string `json:"title"`
	ThaiFirstName string `json:"thai_first_name"`
	ThaiLastName  string `json:"thai_last_name"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) Porphor5Get(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &Porphor5GetRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	data, err := api.Service.Porphor5Get(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(Porphor5GetResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: data,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) Porphor5Get(in *Porphor5GetRequest) ([]Porphor5GetResponseData, error) {
	list, err := service.gradePorphor5Storage.GetListPorphor5ByFormID(in.EvaluationFormId, in.IDs...)
	if err != nil {
		log.Printf("get list porphor5 error: %+v", err)
		return nil, err
	}

	result := []Porphor5GetResponseData{}
	for _, v := range list {

		studentList, _ := getStudentList([]byte(v.DataJson)) // for some data json, ignore if error

		if v.AdditionalData == nil {
			v.AdditionalData = helper.ToPtr("{}")
		}

		resultMode := map[string][]int{}
		if v.Name == constant.Competency {
			mode := map[string][]float64{}
			data := constant.StudentScoreDataList{}
			err := json.Unmarshal([]byte(v.DataJson), &data)
			if err != nil {
				return nil, err
			}

			for _, j := range data {
				for _, k := range j.StudentIndicatorData {
					mode[helper.Deref(k.IndicatorGeneralName)] = append(mode[helper.Deref(k.IndicatorGeneralName)], k.Value)
				}
			}
			resultMode = calcMode(mode)
		}

		result = append(result, Porphor5GetResponseData{
			ID:             v.ID,
			FormID:         v.FormID,
			Order:          v.Order,
			Name:           v.Name,
			DataJson:       json.RawMessage(v.DataJson),
			CreatedAt:      v.CreatedAt,
			StudentList:    studentList,
			AdditionalData: json.RawMessage(helper.Deref(v.AdditionalData)),
			Mode:           resultMode,
		})
	}

	return result, nil
}

func getStudentList(data []byte) ([]Porphor5StudentList, error) {
	// โครงสร้างสำหรับ decode evaluation ที่อยู่ใน DataJson
	type evaluation struct {
		EvaluationStudentID int `json:"evaluation_student_id"`
		AdditionalFields    struct {
			Id            int    `json:"id"`
			Title         string `json:"title"`
			ThaiFirstName string `json:"thai_first_name"`
			ThaiLastName  string `json:"thai_last_name"`
		} `json:"additional_fields"`
	}

	var evaluations []evaluation
	if err := json.Unmarshal(data, &evaluations); err != nil {
		return nil, err
	}

	// ใช้ map เพื่อเก็บข้อมูลนักเรียนที่ไม่ซ้ำกัน โดยใช้ key เป็น id
	studentMap := make(map[int]Porphor5StudentList)
	for _, eval := range evaluations {
		if eval.AdditionalFields.Id == 0 {
			continue
		}

		if _, exists := studentMap[eval.AdditionalFields.Id]; !exists {
			studentMap[eval.AdditionalFields.Id] = Porphor5StudentList{
				Id:            eval.AdditionalFields.Id,
				Title:         eval.AdditionalFields.Title,
				ThaiFirstName: eval.AdditionalFields.ThaiFirstName,
				ThaiLastName:  eval.AdditionalFields.ThaiLastName,
			}
		}
	}

	var studentList []Porphor5StudentList
	for _, student := range studentMap {
		studentList = append(studentList, student)
	}

	sort.Slice(studentList, func(i, j int) bool {
		return studentList[i].Id < studentList[j].Id
	})

	for i := range studentList {
		studentList[i].No = i + 1
	}

	return studentList, nil
}
