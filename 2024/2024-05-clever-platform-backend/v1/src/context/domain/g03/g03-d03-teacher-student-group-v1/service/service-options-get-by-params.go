package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (service *serviceStruct) OptionListGetByParams(in constant.OptionFilter) (*constant.OptionObject, error) {
	var (
		data   []constant.OptionItem
		parent *string
		err    error
	)

	switch in.OptionType {
	case "academic-year":
		data, err = service.repository.AcademicYearOptionListGetByParams(in.OptionParam)

	case "subject":
		data, err = service.repository.SubjectOptionListGetByParams(in.OptionParam)

	case "lesson":
		data, err = service.repository.LessonOptionListGetByParams(in.OptionParam)
		parent = helper.ToPtr("subject_id")

	case "sub-lesson":
		data, err = service.repository.SubLessonOptionListGetByParams(in.OptionParam)
		parent = helper.ToPtr("lesson_id")

	}

	if err != nil {
		return nil, err
	}

	return &constant.OptionObject{
		OptionType: in.OptionType,
		ParentKey:  parent,
		Values:     data,
	}, nil
}
