package service

import (
	"database/sql"
	"errors"
	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"net/url"
	"time"
)

type CheckSavedTextGroupLanguageInput struct {
	Tx                *sqlx.Tx
	CurriculumGroupId int
	Text              string
	GroupId           string
	Language          string
	Speech            *string
	SubjectId         string
	KeysToAdd         map[string]struct {
		Bytes    []byte
		FileType string
	}
	OverrideStatus *string
	AdminLoginAs   *string
}

func (service *serviceStruct) CheckSavedTextGroupLanguage(in *CheckSavedTextGroupLanguageInput) error {
	savedText, err := service.academicLevelStorage.SavedTextCaseGetByGroupLanguage(in.Tx, in.GroupId, in.Language)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	if savedText != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil
	}

	savedTextEntity := constant.SavedTextEntity{
		CurriculumGroupId: in.CurriculumGroupId,
		GroupId:           in.GroupId,
		Language:          in.Language,
		Text:              &in.Text,
		TextToAi:          &in.Text,
		Status:            constant.SavedTextEnabled,
		CreatedAt:         time.Now().UTC(),
		CreatedBy:         in.SubjectId,
		AdminLoginAs:      in.AdminLoginAs,
	}
	if in.OverrideStatus != nil {
		savedTextEntity.Status = *in.OverrideStatus
	}

	if in.Speech != nil {
		savedTextEntity.SpeechUrl = in.Speech
		parsedUrl, err := url.Parse(*in.Speech)
		if err != nil {
			return err
		}
		if parsedUrl.Host == "" {
			savedTextEntity.TextToAi = in.Speech
			speechKey := uuid.NewString()
			speechBytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*in.Speech, in.Language)
			if err != nil {
				return err
			}
			savedTextEntity.SpeechUrl = &speechKey
			in.KeysToAdd[speechKey] = struct {
				Bytes    []byte
				FileType string
			}{Bytes: speechBytes, FileType: cloudStorageConstant.Speech}
		}
	}

	_, err = service.academicLevelStorage.SavedTextCreate(in.Tx, &savedTextEntity)
	if err != nil {
		return nil
	}

	return nil
}
