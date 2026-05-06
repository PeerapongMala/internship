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

// ==================== Response ==========================

type AdditionalPersonGetResponse struct {
	Data []constant.GradeEvaluationAdditionalPersonData `json:"data"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) AdditionalPersonGet(context *fiber.Ctx) error {

	evaluationFormId, err := context.ParamsInt("evaluationFormId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if evaluationFormId == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.AdditionalPersonGet(evaluationFormId)

	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AdditionalPersonGetResponse{
		Data: resp.Resp,
	})
}

// ==================== Service ==========================

type AdditionalPersonGetOutput struct {
	Resp []constant.GradeEvaluationAdditionalPersonData
}

func (service *serviceStruct) AdditionalPersonGet(id int) (*AdditionalPersonGetOutput, error) {

	subjectEvaluation, err := service.gradeFormStorage.GradeEvaluationSubjectGetByFormId(id, false)
	if err != nil {
		return nil, err
	}

	//Get all evaluation form general_evaluation_id
	generalEvaluation, err := service.gradeFormStorage.GradeEvaluationGeneralEvaluationGetByFormId(id)
	if err != nil {
		return nil, err
	}

	personDatas, err := service.gradeFormStorage.AdditionalPersonWithPersonalDataGet(id)
	if err != nil {
		return nil, err
	}

	mappingSubject, mappingGeneralEvaluation := PersonalDataFilterOutput(personDatas)

	resp := []constant.GradeEvaluationAdditionalPersonData{}
	for _, subject := range subjectEvaluation {
		valueType := "SUBJECT"

		personData := mappingSubject[*subject.GradeEvaluationSubjectId]
		if subject.CleverSubjectId != nil {
			subjectTeachers, err := service.gradeFormStorage.SubjectTeacherList(*subject.CleverSubjectId, id)
			if err != nil {
				return nil, err
			}
			personData = append(personData, subjectTeachers...)
			personData = RemoveDuplicate(personData)
		}
		if len(personData) == 0 {
			personData = []constant.AdditionalPersonWithPersonDataEntity{}
		}
		resp = append(resp, constant.GradeEvaluationAdditionalPersonData{
			Id:              subject.GradeEvaluationSubjectId,
			Type:            &valueType,
			Name:            subject.SubjectName,
			CleverSubjectId: subject.CleverSubjectId,
			PersonData:      personData,
		})
	}

	for _, generalEvaluation := range generalEvaluation {
		valueType := "GENERAL_EVALUATION"
		personData := mappingGeneralEvaluation[*generalEvaluation.Id]

		classTeachers, err := service.gradeFormStorage.ClassTeacherList(id)
		if err != nil {
			return nil, err
		}
		personData = append(personData, classTeachers...)
		personData = RemoveDuplicate(personData)
		if len(personData) == 0 {
			personData = []constant.AdditionalPersonWithPersonDataEntity{}
		}

		resp = append(resp, constant.GradeEvaluationAdditionalPersonData{
			Id:         generalEvaluation.Id,
			Type:       &valueType,
			Name:       generalEvaluation.TemplateType,
			PersonData: personData,
		})
	}

	return &AdditionalPersonGetOutput{
		Resp: resp,
	}, nil
}

func PersonalDataFilterOutput(personData []constant.AdditionalPersonWithPersonDataEntity) (
	mappingSubject map[int][]constant.AdditionalPersonWithPersonDataEntity,
	mappingGeneralEvaluation map[int][]constant.AdditionalPersonWithPersonDataEntity,
) {

	mappingSubject = make(map[int][]constant.AdditionalPersonWithPersonDataEntity)
	mappingGeneralEvaluation = make(map[int][]constant.AdditionalPersonWithPersonDataEntity)

	for _, person := range personData {
		if person.ValueType != nil && *person.ValueType == "SUBJECT" {
			mappingSubject[*person.ValueId] = append(mappingSubject[*person.ValueId], person)
		} else if person.ValueType != nil && *person.ValueType == "GENERAL_EVALUATION" {
			mappingGeneralEvaluation[*person.ValueId] = append(mappingGeneralEvaluation[*person.ValueId], person)
		}
	}

	return mappingSubject, mappingGeneralEvaluation
}

func RemoveDuplicate(personData []constant.AdditionalPersonWithPersonDataEntity) []constant.AdditionalPersonWithPersonDataEntity {
	m := map[string]constant.AdditionalPersonWithPersonDataEntity{}
	for _, person := range personData {
		_, ok := m[helper.Deref(person.UserId)]
		if !ok {
			m[helper.Deref(person.UserId)] = person
		}
	}
	personData = []constant.AdditionalPersonWithPersonDataEntity{}
	for _, person := range m {
		personData = append(personData, person)
	}
	return personData
}
