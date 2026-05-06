package service

import (
	"github.com/jmoiron/sqlx"
)

type PrefillSchoolInput struct {
	Tx         *sqlx.Tx
	SchoolIds  []int
	ContractId int
}

func (service *serviceStruct) PrefillSchool(in *PrefillSchoolInput) error {
	subjectIds, err := service.schoolAffiliationStorage.ContractCaseListSubject(in.ContractId)
	if err != nil {
		return err
	}

	err = service.schoolAffiliationStorage.SchoolSubjectCreate(in.Tx, in.ContractId, in.SchoolIds, subjectIds)
	if err != nil {
		return err
	}

	lessonIds, err := service.schoolAffiliationStorage.ContractCaseListLesson(in.ContractId)
	if err != nil {
		return err
	}

	subLessonIds, err := service.schoolAffiliationStorage.ContractCaseListSubLesson(in.ContractId)
	if err != nil {
		return err
	}

	for _, schoolId := range in.SchoolIds {
		classIds, err := service.schoolAffiliationStorage.ClassList([]int{schoolId})
		if err != nil {
			return err
		}

		batchSize := 20
		for i := 0; i < len(classIds); i += batchSize {
			end := i + batchSize
			if end > len(classIds) {
				end = len(classIds)
			}
			batch := classIds[i:end]

			err = service.schoolAffiliationStorage.SchoolLessonCreate(in.Tx, schoolId, lessonIds, batch)
			if err != nil {
				return err
			}

			err = service.schoolAffiliationStorage.LessonLevelLockCreate(in.Tx, batch, subLessonIds)
			if err != nil {
				return err
			}

			err = service.schoolAffiliationStorage.SchoolSubLessonCreate(in.Tx, schoolId, subLessonIds, batch)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
