package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"

type GetSubjectLanguageInput struct {
	LevelId int
}

type GetSubjectLanguageOutput struct {
	SubjectLanguage string
}

func (service *serviceStruct) GetSubjectLanguage(in *GetSubjectLanguageInput) (*GetSubjectLanguageOutput, error) {
	subjectLanguage, err := service.academicLevelStorage.LevelCaseGetSubjectLanguage(in.LevelId)
	if err != nil {
		return nil, err
	}
	if subjectLanguage == nil {
		subjectLanguage = &constant.Thai
	}

	return &GetSubjectLanguageOutput{
		*subjectLanguage,
	}, nil
}
