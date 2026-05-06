package service

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	service2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

// ==================== Service ==========================

type CloneGradeTemplateInput struct {
	TemplateId int
	SubjectId  string
	IsPublic   bool
}

func (service *serviceStruct) CloneGradeTemplate(in *CloneGradeTemplateInput) error {
	tx, err := service.gradeTemplateStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	template, err := service.gradeTemplateStorage.GradeTemplateGetById(in.TemplateId)
	if err != nil {
		return err
	}

	template.Template.CreatedAt = helper.ToPtr(time.Now().UTC())
	template.Template.CreatedBy = &in.SubjectId
	template.Template.UpdatedAt = nil
	template.Template.UpdatedBy = nil

	if in.IsPublic {
		template.Template.SchoolId = helper.ToPtr(0)
	}

	newTemplateId, err := service.gradeTemplateStorage.GradeTemplateInsert(tx, &template.Template)
	if err != nil {
		return err
	}

	for _, generalTemplate := range template.GeneralTemplate {
		generalTemplate.TemplateId = &newTemplateId
		_, err := service.gradeTemplateStorage.GradeGeneralEvaluationInsert(tx, &generalTemplate)
		if err != nil {
			return err
		}
	}

	subjects, err := service.gradeTemplateStorage.GradeSubjectByTemplateId(in.TemplateId)
	if err != nil {
		return err
	}

	subjectIndicatorsMap := map[int]constant.GradeSubjectWithIndicator{}
	for _, subject := range subjects {
		subjectIndicatorsMap[subject.SubjectId] = subject
	}

	newSubjectIndicatorsMap := map[int]constant.GradeSubjectWithIndicator{}
	for _, subject := range template.Subject {
		oldSubjectId := subject.Id
		subject.TemplateId = &newTemplateId
		subjectId, err := service.gradeTemplateStorage.GradeSubjectInsert(tx, &subject)
		if err != nil {
			return err
		}

		if subject.IsClever {
			subject.Id = &subjectId
			err = service2.IsCleverDumpData(tx, subject)
			if err != nil {
				return err
			}
		}

		subjectWithIndicators := subjectIndicatorsMap[helper.Deref(oldSubjectId)]
		subjectWithIndicators.SubjectId = subjectId
		newSubjectIndicatorsMap[helper.Deref(subject.Id)] = subjectWithIndicators
	}

	for _, Subject := range newSubjectIndicatorsMap {
		var activeIndicatorID []int
		for _, indicator := range Subject.Indicators {
			indicator.TemplateSubjectId = Subject.SubjectId
			id, err := service.gradeTemplateStorage.GradeIndicatorInsert(tx, &indicator)
			if err != nil {
				return err
			}
			indicator.Id = &id

			activeIndicatorID = append(activeIndicatorID, *indicator.Id)

			for _, setting := range indicator.Setting {
				setting.TemplateIndicatorId = indicator.Id
				_, err = service.gradeTemplateStorage.GradeAssesmentSettingInsert(tx, &setting)
				if err != nil {
					return err
				}
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
