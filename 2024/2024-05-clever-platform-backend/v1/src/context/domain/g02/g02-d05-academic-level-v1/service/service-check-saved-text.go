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

type CheckSavedTextInput struct {
	Tx                  *sqlx.Tx
	QuestionId          int
	Text                string
	TextType            string
	CurriculumGroupId   int
	Language            string
	Speech              *string
	SubDescriptionIndex *int
	SubjectId           string
	KeysToAdd           map[string]struct {
		Bytes    []byte
		FileType string
	}
	OverrideStatus     *string
	IgnoreQuestionText bool
	AdminLoginAs       *string
	RowNumber          int
	ColumnNumber       int
}

type CheckSavedTextOutput struct {
	QuestionText constant.QuestionTextEntity
}

func (service *serviceStruct) CheckSavedText(in *CheckSavedTextInput) (*CheckSavedTextOutput, error) {
	savedText, err := service.academicLevelStorage.SavedTextCaseGetByText(in.Tx, in.Language, in.Text)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	questionTextEntity := constant.QuestionTextEntity{
		QuestionId: in.QuestionId,
		Type:       in.TextType,
	}
	if in.SubDescriptionIndex != nil {
		questionTextEntity.Index = in.SubDescriptionIndex
	}

	if savedText == nil || savedText.Id == 0 {
		savedTextEntity := constant.SavedTextEntity{
			CurriculumGroupId: in.CurriculumGroupId,
			GroupId:           uuid.NewString(),
			Text:              &in.Text,
			TextToAi:          &in.Text,
			Language:          in.Language,
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
				return nil, err
			}

			if parsedUrl.Host == "" {
				savedTextEntity.TextToAi = in.Speech
				bytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*in.Speech, in.Language)
				if err != nil {
					return nil, err
				}
				speechKey := uuid.NewString()
				savedTextEntity.SpeechUrl = &speechKey
				in.KeysToAdd[speechKey] = struct {
					Bytes    []byte
					FileType string
				}{Bytes: bytes, FileType: cloudStorageConstant.Speech}
			} else {
				downloadFileOutput, err := service.DownloadFile(&DownloadFileInput{
					KeysToAdd:    in.KeysToAdd,
					Url:          *in.Speech,
					FileType:     cloudStorageConstant.Speech,
					RowNumber:    in.RowNumber,
					ColumnNumber: in.ColumnNumber,
				})
				if err != nil {
					return nil, err
				}
				savedTextEntity.SpeechUrl = &downloadFileOutput.Key
			}
		}

		savedText, err := service.academicLevelStorage.SavedTextCreate(in.Tx, &savedTextEntity)
		if err != nil {
			return nil, err
		}
		questionTextEntity.SavedTextGroupId = &savedText.GroupId
	} else {
		questionTextEntity.SavedTextGroupId = &savedText.GroupId
	}

	if in.IgnoreQuestionText {
		return &CheckSavedTextOutput{
			QuestionText: questionTextEntity,
		}, nil
	}

	questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
	if err != nil {
		return nil, err
	}

	return &CheckSavedTextOutput{
		QuestionText: *questionText,
	}, nil
}
