package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

type GetQuestionTextSpeechUrlInput struct {
	Translations *map[string]constant.SavedTextEntity
}

func (service *serviceStruct) GetQuestionTextSpeechUrl(in *GetQuestionTextSpeechUrlInput) error {
	if in.Translations == nil {
		return nil
	}

	for language, translation := range *in.Translations {
		if translation.SpeechUrl == nil {
			continue
		}
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*translation.SpeechUrl)
		if err != nil {
			return err
		}

		translation.SpeechUrl = url
		(*in.Translations)[language] = translation
	}

	return nil
}
