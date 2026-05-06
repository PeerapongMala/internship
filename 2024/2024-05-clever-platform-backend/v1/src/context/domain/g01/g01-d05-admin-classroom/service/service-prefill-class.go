package service

import (
	"github.com/jmoiron/sqlx"
)

type PrefillClassInput struct {
	Tx       *sqlx.Tx
	SchoolId int
	ClassId  int
}

func (service *serviceStruct) PrefillClass(in *PrefillClassInput) error {
	lessonIds, err := service.storage.SchoolCaseListLesson(in.SchoolId)
	if err != nil {
		return err
	}

	subLessonIds, err := service.storage.SchoolCaseListSubLesson(in.SchoolId)
	if err != nil {
		return err
	}

	err = service.storage.ClassLessonCreate(in.Tx, in.SchoolId, in.ClassId, lessonIds)
	if err != nil {
		return err
	}

	err = service.storage.ClassSubLessonCreate(in.Tx, in.SchoolId, in.ClassId, subLessonIds)
	if err != nil {
		return err
	}

	return nil
}
