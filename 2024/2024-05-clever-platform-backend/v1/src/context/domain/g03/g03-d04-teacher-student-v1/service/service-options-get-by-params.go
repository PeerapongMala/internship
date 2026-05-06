package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (service *serviceStruct) OptionsGetByParams(in constant.OptionFilter) (*constant.OptionObject, error) {
	//student, err := service.repositoryTeacherStudent.StudentByStudentId(in.Param.Student.StudentId)
	//if err != nil {
	//	return nil, err
	//}
	in.Param.Student.UserId = in.Param.Student.StudentId
	in.Param.SeedYearId = in.SeedYearId
	in.Param.SubjectId = in.SubjectId
	in.Param.LessonId = &in.LessonId
	in.Param.SubLessonId = in.SubLessonId
	var data []constant.OptionItem
	var parent *string
	var err error

	if in.OptionType == "academic-year" {
		data, err = service.repositoryTeacherStudent.AcademicYearOptionsGetByParams(in.Param)
	}

	if in.OptionType == "curriculum-group" {
		data, err = service.repositoryTeacherStudent.CurriculumGroupOptionsGetByParams(in.Param)
	}

	if in.OptionType == "seed-year" {
		data, err = service.repositoryTeacherStudent.SeedYearOptionsGetByParams(in.Param)
		parent = helper.ToPtr("academic_year")
	}

	if in.OptionType == "subject" {
		data, err = service.repositoryTeacherStudent.SubjectOptionsGetByParams(in.Param)
		parent = helper.ToPtr("seed_year_id")
	}

	if in.OptionType == "lesson" {
		data, err = service.repositoryTeacherStudent.LessonOptionsGetByParams(in.Param)
		parent = helper.ToPtr("subject_id")
	}

	if in.OptionType == "sub-lesson" {
		data, err = service.repositoryTeacherStudent.SubLessonOptionsGetByParams(in.Param)
		parent = helper.ToPtr("lesson_id")
	}

	if in.OptionType == "level" {
		data, err = service.repositoryTeacherStudent.LevelOptionsGetByParams(in.Param)
		parent = helper.ToPtr("sub_lesson_id")
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
