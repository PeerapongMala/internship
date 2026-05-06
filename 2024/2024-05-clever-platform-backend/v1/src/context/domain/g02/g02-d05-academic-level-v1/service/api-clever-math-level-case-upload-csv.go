package service

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"
)

// ==================== Request ==========================

type CleverMathLevelCaseUploadCsvRequest struct {
	LessonId     int     `params:"lessonId" validate:"required"`
	RootFolderId string  `form:"root_folder_id" validate:"required"`
	AdminLoginAs *string `form:"admin_login_as"`
}

// ==================== Response ==========================

type CleverMathLevelCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) CleverMathLevelCaseUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &CleverMathLevelCaseUploadCsvRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	form, err := context.MultipartForm()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	var csvFile *multipart.FileHeader
	if len(form.File["csv_file"]) > 0 {
		csvFile = form.File["csv_file"][0]
	} else {
		msg := "No csv provided"
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &msg))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	_, err = api.Service.CleverMathLevelCaseUploadCsv(&CleverMathLevelCaseUploadCsvInput{
		Roles:                               roles,
		SubjectId:                           subjectId,
		CleverMathLevelCaseUploadCsvRequest: request,
		CsvFile:                             csvFile,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(CleverMathLevelCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type CleverMathLevelCaseUploadCsvInput struct {
	Roles     []int
	SubjectId string
	CsvFile   *multipart.FileHeader
	*CleverMathLevelCaseUploadCsvRequest
}

type CleverMathLevelCaseUploadCsvOutput struct {
}

func (service *serviceStruct) CleverMathLevelCaseUploadCsv(in *CleverMathLevelCaseUploadCsvInput) (*CleverMathLevelCaseUploadCsvOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LessonCaseGetCurriculumGroupId(in.LessonId)
	if err != nil {
		return nil, err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.SubjectId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return nil, err
	}

	lesson, err := service.academicLevelStorage.LessonGet(in.LessonId)
	if err != nil {
		return nil, err
	}

	if lesson.Status != constant.SubLessonDraft {
		msg := "Cannot change levels of published lesson"
		return nil, helper.NewHttpError(http.StatusConflict, &msg)
	}

	file, err := in.CsvFile.Open()
	if err != nil {
		log.Printf("+%v", errors.WithStack(err))
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)

	levelCsvRows := []constant.CleverMathLevelCsvRow{}
	lineNumber := 0
	for {
		lineNumber++
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		if len(row) != constant.CleverMathLevelCsvColumnsCount {
			msg := "Incorrect number of columns"
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		if lineNumber <= constant.CleverMathLevelCsvHeaderLines {
			continue
		}

		levelCsvRow := constant.CleverMathLevelCsvRow{}

		// lesson index
		levelCsvRow.LessonIndex = row[constant.CMCsvLessonIndex]

		// level index
		if strings.TrimSpace(row[constant.CMCsvLevelIndex]) != "" {
			levelIndex, err := strconv.Atoi(row[constant.CMCsvLevelIndex])
			if err != nil {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CMCsvLevelIndex,
				})
			}
			levelCsvRow.LevelIndex = levelIndex
		}

		// Difficulty
		if strings.TrimSpace(row[constant.CMCsvLevelDifficulty]) != "" {
			mapDifficultyFromCsvOutput, err := service.MapDifficultyFromCsv(&MapDifficultyFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CMCsvLevelDifficulty,
				Cell:         row[constant.CMCsvLevelDifficulty],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.Difficulty = mapDifficultyFromCsvOutput.Difficulty
		}

		// Type
		if strings.TrimSpace(row[constant.CMCsvLevelTypeAndQuestionType]) != "" {
			levelCsvRow.OriginalQuestionType = strings.TrimSpace(row[constant.CMCsvLevelTypeAndQuestionType])
			mapQuestionTypeFromCsvOutput, err := service.MapQuestionTypeFromCsv(&MapQuestionTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CMCsvLevelTypeAndQuestionType,
				Cell:         row[constant.CMCsvLevelTypeAndQuestionType],
			})
			if err != nil {
				log.Println(row[constant.CMCsvLevelTypeAndQuestionType])
				return nil, err
			}
			levelCsvRow.QuestionType = mapQuestionTypeFromCsvOutput.QuestionType
		}

		// Command & Sub-lesson name
		if strings.TrimSpace(row[constant.CMCsvCommandAndSubLessonName]) != "" {
			if row[constant.CMCsvLessonIndex] != "" {
				levelCsvRow.SubLessonName = row[constant.CMCsvCommandAndSubLessonName]
			} else {
				levelCsvRow.CommandText = row[constant.CMCsvCommandAndSubLessonName]
			}
		}

		// description text
		levelCsvRow.DescriptionText = service.PreprocessQuizText(&PreprocessQuizTextInput{
			Text: row[constant.CMCsvDescriptionText],
			Type: constant.Description,
		}).Text
		//levelCsvRow.DescriptionText = strings.ReplaceAll(row[constant.CMCsvDescriptionText], "\n", "$\\\\$")
		//pattern := `{([0-9.A-zก-ฮ❑]+)}{([0-9.A-zก-ฮ❑]+)}`
		//pattern := `([^ \t\r\n]*){([0-9.A-zก-ฮ❑]+)}{([0-9.A-zก-ฮ❑]+)}([^ \t\r\n]*)`
		//re := regexp.MustCompile(pattern)
		//levelCsvRow.DescriptionText = re.ReplaceAllString(levelCsvRow.DescriptionText, `$\frac{$1}{$2}$`)
		//levelCsvRow.DescriptionText = re.ReplaceAllString(levelCsvRow.DescriptionText, `$$$1\frac{$2}{$3}$4$$`)

		//levelCsvRow.DescriptionText = strings.ReplaceAll(levelCsvRow.DescriptionText, "\n", "$\\\\$")

		// description image
		if row[constant.CMCsvDescriptionImage] != "" && row[constant.CMCsvLessonIndex] == "" {
			getGoogleDriveImageUrlOutput, err := service.GetGoogleDriveImageUrl(&GetGoogleDriveImageUrlInput{
				RootFolderId: in.RootFolderId,
				FileName:     row[constant.CMCsvDescriptionImage],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.DescriptionImage = &getGoogleDriveImageUrlOutput.FileUrl
		}

		// answer
		levelCsvRow.AnswerText = service.PreprocessQuizText(&PreprocessQuizTextInput{
			Text: row[constant.CMCsvAnswer],
			Type: constant.Choice,
		}).Text

		// hint text
		levelCsvRow.HintText = row[constant.CMCsvHintText]

		// hint image
		if row[constant.CMCsvHintImage] != "" && row[constant.CMCsvLessonIndex] == "" {
			getGoogleDriveImageUrlOutput, err := service.GetGoogleDriveImageUrl(&GetGoogleDriveImageUrlInput{
				RootFolderId: in.RootFolderId,
				FileName:     row[constant.CMCsvHintImage],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.HintImage = &getGoogleDriveImageUrlOutput.FileUrl
		}

		// choices
		levelCsvRow.Choices = service.PreprocessQuizText(&PreprocessQuizTextInput{
			Text: row[constant.CMCsvChoices],
			Type: constant.Choice,
		}).Text

		levelCsvRows = append(levelCsvRows, levelCsvRow)
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var currentSubLessonId, currentLevelId int
	currentQuestionIndex := 0
	currentLevelIndex := 0
	var currentQuestionType string

	for k, levelCsvRow := range levelCsvRows {
		currentQuestionIndex++
		if levelCsvRow.QuestionType == "" {
			levelCsvRow.QuestionType = currentQuestionType
		}

		if levelCsvRow.LessonIndex != "" {
			currentLevelIndex++
			currentQuestionType = levelCsvRow.QuestionType
			currentQuestionIndex = 0

			if levelCsvRow.SubLessonName != "ด่านบอส" {
				subLessonId, err := service.academicLevelStorage.SubLessonCaseGetByName(tx, in.LessonId, levelCsvRow.SubLessonName)
				if err != nil && !errors.Is(err, sql.ErrNoRows) {
					return nil, err
				}

				if subLessonId == nil || *subLessonId != currentSubLessonId {
					currentLevelIndex = 1
				}

				if subLessonId == nil {
					subLesson, err := service.academicLevelStorage.SubLessonCreate(tx, &constant.SubLessonEntity{
						LessonId:     in.LessonId,
						Name:         levelCsvRow.SubLessonName,
						Status:       constant.Enabled,
						CreatedAt:    time.Now().UTC(),
						CreatedBy:    in.SubjectId,
						AdminLoginAs: in.AdminLoginAs,
					})
					if err != nil {
						return nil, err
					}
					currentSubLessonId = subLesson.Id
				} else {
					currentSubLessonId = *subLessonId
				}
			} /*else {
				currentLevelIndex++
			}*/

			switch levelCsvRow.SubLessonName {
			case "Pre-test":
				levelCsvRow.LevelType = constant.PrePostTest
			case "Post-test":
				levelCsvRow.LevelType = constant.SubLessonPostTest
			case "Special":
				levelCsvRow.LevelType = constant.SubLessonPostTest
			default:
				levelCsvRow.LevelType = constant.Test
			}

			lockNextLevel := false
			levelEntity := constant.LevelEntity{
				SubLessonId:   currentSubLessonId,
				Index:         currentLevelIndex,
				QuestionType:  levelCsvRow.QuestionType,
				LevelType:     levelCsvRow.LevelType,
				Difficulty:    levelCsvRow.Difficulty,
				LockNextLevel: &lockNextLevel,
				TimerType:     constant.No,
				TimerTime:     0,
				Status:        constant.Question,
				WizardIndex:   2,
				CreatedAt:     time.Now().UTC(),
				CreatedBy:     in.SubjectId,
				AdminLoginAs:  in.AdminLoginAs,
			}
			level, err := service.academicLevelStorage.LevelCreate(tx, &levelEntity)
			if err != nil {
				return nil, err
			}
			currentLevelId = level.Id
			continue
		}

		questionEntity := constant.QuestionEntity{
			LevelId:                    currentLevelId,
			Index:                      currentQuestionIndex,
			QuestionType:               levelCsvRow.QuestionType,
			TimerType:                  constant.No,
			TimerTime:                  0,
			ChoicePosition:             "1",
			Layout:                     constant.QuestionLayoutOneToOne,
			LeftBoxColumns:             constant.QuestionRightBoxTwoColumns,
			LeftBoxRows:                constant.QuestionRightBoxTwoRows,
			BottomBoxColumns:           constant.QuestionBottomBoxTwoColumns,
			BottomBoxRows:              constant.QuestionBottomBoxTwoRows,
			ImageDescriptionUrl:        levelCsvRow.DescriptionImage,
			ImageHintUrl:               levelCsvRow.HintImage,
			EnforceDescriptionLanguage: &constant.DefaultEnforceDescriptionLanguage,
			EnforceChoiceLanguage:      &constant.DefaultEnforceChoiceLanguage,
		}
		question, err := service.academicLevelStorage.QuestionCreate(tx, &questionEntity)
		if err != nil {
			return nil, err
		}

		_, err = service.CheckSavedText(&CheckSavedTextInput{
			Tx:                tx,
			QuestionId:        question.Id,
			Text:              levelCsvRow.CommandText,
			TextType:          constant.Command,
			CurriculumGroupId: *curriculumGroupId,
			Language:          constant.Thai,
			SubjectId:         in.SubjectId,
			AdminLoginAs:      in.AdminLoginAs,
			RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
			ColumnNumber:      constant.CMCsvCommandAndSubLessonName,
		})
		if err != nil {
			return nil, err
		}

		if levelCsvRow.QuestionType != "" {
			currentQuestionType = levelCsvRow.QuestionType
		}
		if currentQuestionType != constant.Placeholder || levelCsvRow.OriginalQuestionType == "number-picker" {
			_, err := service.CheckSavedText(&CheckSavedTextInput{
				Tx:                tx,
				QuestionId:        question.Id,
				Text:              levelCsvRow.DescriptionText,
				TextType:          constant.Description,
				CurriculumGroupId: *curriculumGroupId,
				Language:          constant.Thai,
				SubjectId:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
				RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
				ColumnNumber:      constant.CMCsvDescriptionText,
			})
			if err != nil {
				return nil, err
			}
		}

		_, err = service.CheckSavedText(&CheckSavedTextInput{
			Tx:                tx,
			QuestionId:        question.Id,
			Text:              levelCsvRow.HintText,
			TextType:          constant.Hint,
			CurriculumGroupId: *curriculumGroupId,
			Language:          constant.Thai,
			SubjectId:         in.SubjectId,
			AdminLoginAs:      in.AdminLoginAs,
			RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
			ColumnNumber:      constant.CMCsvHintText,
		})
		if err != nil {
			return nil, err
		}

		if levelCsvRow.QuestionType == constant.MultipleChoice || currentQuestionType == constant.MultipleChoice {
			re := regexp.MustCompile(`[^|]+`)

			maxPoint := 1
			var choiceType string
			questionMultipleChoiceEntity := constant.QuestionMultipleChoiceEntity{
				QuestionId:              question.Id,
				UseSoundDescriptionOnly: &constant.DefaultUseSoundDescriptionOnly,
				ChoiceType:              constant.QuestionChoiceTypeTextSpeech,
				CorrectChoiceAmount:     constant.CorrectChoiceAmountOne,
				MaxPoint:                &maxPoint,
			}
			_, err = service.academicLevelStorage.QuestionMultipleChoiceCreate(tx, &questionMultipleChoiceEntity)
			if err != nil {
				return nil, err
			}

			choices := re.FindAllString(levelCsvRow.Choices, -1)
			isDuplicate := false
			for _, choice := range choices {
				if strings.TrimSpace(choice) == levelCsvRow.AnswerText {
					isDuplicate = true
				}
			}
			if !isDuplicate {
				choices = append(choices, levelCsvRow.AnswerText)
			}

			for i, choice := range choices {
				choice = strings.TrimSpace(choice)
				var isCorrect bool
				if choice == levelCsvRow.AnswerText {
					isCorrect = true
				}

				if strings.Contains(choice, ".jpg") {
					choiceType = constant.QuestionChoiceTypeImage
					getGoogleDriveImageUrlOutput, err := service.GetGoogleDriveImageUrl(&GetGoogleDriveImageUrlInput{
						FileName: choice,
					})
					if err != nil {
						return nil, err
					}

					questionMultipleChoiceImageChoiceEntity := constant.QuestionMultipleChoiceImageChoiceEntity{
						QuestionMultipleChoiceId: question.Id,
						Index:                    i + 1,
						ImageUrl:                 getGoogleDriveImageUrlOutput.FileUrl,
						IsCorrect:                &isCorrect,
					}
					_, err = service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCreate(tx, &questionMultipleChoiceImageChoiceEntity)
					if err != nil {
						return nil, err
					}
				} else {
					choiceType = constant.QuestionChoiceTypeTextSpeech
					checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
						Tx:                tx,
						QuestionId:        question.Id,
						Text:              choice,
						TextType:          constant.Choice,
						CurriculumGroupId: *curriculumGroupId,
						Language:          constant.Thai,
						SubjectId:         in.SubjectId,
						AdminLoginAs:      in.AdminLoginAs,
						RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
						ColumnNumber:      constant.CMCsvChoices,
					})
					if err != nil {
						return nil, err
					}

					questionMultipleChoiceTextChoiceEntity := constant.QuestionMultipleChoiceTextChoiceEntity{
						QuestionMultipleChoiceId: question.Id,
						QuestionTextId:           checkSavedTextOutput.QuestionText.Id,
						Index:                    i + 1,
						IsCorrect:                &isCorrect,
					}
					_, err = service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCreate(tx, &questionMultipleChoiceTextChoiceEntity)
					if err != nil {
						return nil, err
					}
				}
			}
			_, err = service.academicLevelStorage.QuestionMultipleChoiceUpdate(tx, &constant.QuestionMultipleChoiceEntity{
				QuestionId: question.Id,
				ChoiceType: choiceType,
			})
			if err != nil {
				return nil, err
			}

		}

		if levelCsvRow.QuestionType == constant.Sort || currentQuestionType == constant.Sort {
			re := regexp.MustCompile(`[^|]+`)
			choices := re.FindAllString(levelCsvRow.AnswerText, -1)

			canReuseChoice := false
			dummyAmount := 0
			_, err := service.academicLevelStorage.QuestionSortCreate(tx, &constant.QuestionSortEntity{
				QuestionId:              question.Id,
				UseSoundDescriptionOnly: &constant.DefaultUseSoundDescriptionOnly,
				ChoiceType:              constant.QuestionChoiceTypeTextSpeech,
				ChoiceAmount:            len(choices),
				CanReuseChoice:          &canReuseChoice,
				DummyAmount:             &dummyAmount,
			})
			if err != nil {
				return nil, err
			}

			for i, choice := range choices {
				choice := strings.TrimSpace(choice)
				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        question.Id,
					Text:              choice,
					TextType:          constant.Choice,
					CurriculumGroupId: *curriculumGroupId,
					Language:          constant.Thai,
					SubjectId:         in.SubjectId,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
					ColumnNumber:      constant.CMCsvChoices,
				})
				if err != nil {
					return nil, err
				}

				isCorrect := true
				questionSortTextChoiceEntity := constant.QuestionSortTextChoiceEntity{
					QuestionSortId: question.Id,
					QuestionTextId: checkSavedTextOutput.QuestionText.Id,
					Index:          i + 1,
					IsCorrect:      &isCorrect,
				}
				questionSortTextChoice, err := service.academicLevelStorage.QuestionSortTextChoiceCreate(tx, &questionSortTextChoiceEntity)
				if err != nil {
					return nil, err
				}

				_, err = service.academicLevelStorage.QuestionSortAnswerCreate(tx, &constant.QuestionSortAnswerEntity{
					QuestionSortId:           question.Id,
					QuestionSortTextChoiceId: questionSortTextChoice.Id,
					Index:                    i + 1,
				})
				if err != nil {
					return nil, err
				}
			}
		}

		if levelCsvRow.QuestionType == constant.Placeholder || currentQuestionType == constant.Placeholder {
			re := regexp.MustCompile(`[^|]+`)
			answers := re.FindAllString(levelCsvRow.AnswerText, -1)
			dummies := []string{}
			if !(levelCsvRow.OriginalQuestionType == "number-picker") {
				dummies = re.FindAllString(levelCsvRow.Choices, -1)
				dummies = slices.DeleteFunc(dummies, func(dummy string) bool {
					return dummy == "num"
				})
			} else {
				if len(answers) == 1 {
					answers = strings.Split(answers[0], "")
					answers = slices.DeleteFunc(answers, func(answer string) bool { return answer == "," })
				}
			}

			dummyAmount := len(dummies)
			questionPlaceholderEntity := constant.QuestionPlaceholderEntity{
				QuestionId:              question.Id,
				UseSoundDescriptionOnly: &constant.DefaultUseSoundDescriptionOnly,
				ChoiceType:              constant.QuestionChoiceTypeTextSpeech,
				CanReuseChoice:          &constant.DefaultCanReuseChoice,
				ChoiceAmount:            len(answers),
				DummyAmount:             &dummyAmount,
				HintType:                constant.HintTypeNone,
			}
			_, err := service.academicLevelStorage.QuestionPlaceholderCreate(tx, &questionPlaceholderEntity)
			if err != nil {
				return nil, err
			}

			re2 := regexp.MustCompile(`{___}`)

			count := 0
			levelCsvRow.DescriptionText = re2.ReplaceAllStringFunc(levelCsvRow.DescriptionText, func(_ string) string {
				count++
				return fmt.Sprintf("{Ans%d}", count)
			})
			if count == 0 {
				levelCsvRow.DescriptionText = ""
				for i, _ := range answers {
					levelCsvRow.DescriptionText = levelCsvRow.DescriptionText + "{Ans" + strconv.Itoa(i+1) + "}"
				}
				for i := 0; i <= 9; i++ {
					if !slices.Contains(answers, strconv.Itoa(i)) {
						dummies = append(dummies, strconv.Itoa(i))
					}
				}
			}

			subDescriptionIndex := 1
			descriptionText, err := service.CheckSavedText(&CheckSavedTextInput{
				Tx:                  tx,
				QuestionId:          question.Id,
				Text:                levelCsvRow.DescriptionText,
				TextType:            constant.Description,
				CurriculumGroupId:   *curriculumGroupId,
				Language:            constant.Thai,
				SubDescriptionIndex: &subDescriptionIndex,
				SubjectId:           in.SubjectId,
				OverrideStatus:      &constant.SavedTextHidden,
				RowNumber:           k + constant.CleverMathLevelCsvHeaderLines,
				ColumnNumber:        constant.CMCsvDescriptionText,
				AdminLoginAs:        in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}

			textMap := map[string]int{}
			answerIndex := 0
			for i, answer := range answers {
				answer = strings.TrimSpace(answer)
				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        question.Id,
					Text:              answer,
					TextType:          constant.Choice,
					CurriculumGroupId: *curriculumGroupId,
					Language:          constant.Thai,
					SubjectId:         in.SubjectId,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
					ColumnNumber:      constant.CMCsvAnswer,
				})
				if err != nil {
					return nil, err
				}

				questionPlaceholderAnswer, err := service.academicLevelStorage.QuestionPlaceholderAnswerCreate(tx, &constant.QuestionPlaceholderAnswerEntity{
					QuestionTextDescriptionId: descriptionText.QuestionText.Id,
					AnswerIndex:               i + 1,
				})
				if err != nil {
					return nil, err
				}

				_, ok := textMap[answer]
				if !ok {
					textMap[answer] = answerIndex + 1
					answerIndex++
					isCorrect := true
					_, err = service.academicLevelStorage.QuestionPlaceholderTextChoiceCreate(tx, &constant.QuestionPlaceholderTextChoiceEntity{
						QuestionPlaceholderId: question.Id,
						QuestionTextId:        checkSavedTextOutput.QuestionText.Id,
						Index:                 answerIndex,
						IsCorrect:             &isCorrect,
					})
					if err != nil {
						return nil, err
					}
				}

				_, err = service.academicLevelStorage.QuestionPlaceholderAnswerTextCreate(tx, &constant.QuestionPlaceholderAnswerTextEntity{
					QuestionPlaceholderAnswerId: questionPlaceholderAnswer.Id,
					ChoiceIndex:                 textMap[answer],
					Index:                       1,
				})
				if err != nil {
					return nil, err
				}
			}

			dummyIndex := 0
			for _, dummy := range dummies {
				dummy = strings.TrimSpace(dummy)
				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        question.Id,
					Text:              dummy,
					TextType:          constant.Choice,
					CurriculumGroupId: *curriculumGroupId,
					Language:          constant.Thai,
					SubjectId:         in.SubjectId,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
					ColumnNumber:      constant.CMCsvAnswer,
				})
				if err != nil {
					return nil, err
				}

				_, ok := textMap[dummy]
				if !ok {
					textMap[dummy] = dummyIndex + 1
					dummyIndex++
					isCorrect := false
					_, err = service.academicLevelStorage.QuestionPlaceholderTextChoiceCreate(tx, &constant.QuestionPlaceholderTextChoiceEntity{
						QuestionPlaceholderId: question.Id,
						QuestionTextId:        checkSavedTextOutput.QuestionText.Id,
						Index:                 dummyIndex,
						IsCorrect:             &isCorrect,
					})
					if err != nil {
						return nil, err
					}
				}
			}
		}

		if levelCsvRow.QuestionType == constant.Group || currentQuestionType == constant.Group {
			//re := regexp.MustCompile(`([^|]+)\s*\|\s*([^|]+)`)
			//items := re.FindAllString(levelCsvRow.AnswerText, -1)
			items := strings.Split(levelCsvRow.AnswerText, "||")

			groups := map[string][]string{}
			choiceAmount := 0
			for _, item := range items {
				re := regexp.MustCompile(`[^|]+`)
				choices := re.FindAllString(item, -1)

				var groupName string
				for i, choice := range choices {
					choice = strings.TrimSpace(choice)
					if i == 0 {
						groupName = choice
						groups[groupName] = []string{}
					} else {
						groups[groupName] = append(groups[groupName], choice)
						choiceAmount++
					}
				}
			}

			re2 := regexp.MustCompile(`[^|]+`)
			wrongChoices := re2.FindAllString(levelCsvRow.Choices, -1)

			questionGroupEntity := constant.QuestionGroupEntity{
				QuestionId:              question.Id,
				UseSoundDescriptionOnly: &constant.DefaultUseSoundDescriptionOnly,
				ChoiceType:              constant.QuestionChoiceTypeTextSpeech,
				CanReuseChoice:          &constant.DefaultCanReuseChoice,
				GroupAmount:             len(items),
				ChoiceAmount:            choiceAmount,
				DummyAmount:             len(wrongChoices),
			}
			questionGroup, err := service.academicLevelStorage.QuestionGroupCreate(tx, &questionGroupEntity)
			if err != nil {
				return nil, err
			}

			groupIndex := 0
			choiceIndex := 0
			var choiceType string
			for group, members := range groups {
				groupIndex++
				group = strings.TrimSpace(group)
				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        question.Id,
					Text:              group,
					TextType:          constant.GroupName,
					CurriculumGroupId: *curriculumGroupId,
					Language:          constant.Thai,
					SubjectId:         in.SubjectId,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
					ColumnNumber:      constant.CMCsvAnswer,
				})
				if err != nil {
					return nil, err
				}

				questionGroupGroup, err := service.academicLevelStorage.QuestionGroupGroupCreate(tx, &constant.QuestionGroupGroupEntity{
					Index:           groupIndex,
					QuestionGroupId: question.Id,
					QuestionTextId:  checkSavedTextOutput.QuestionText.Id,
				})
				if err != nil {
					return nil, err
				}

				for _, member := range members {
					member = strings.TrimSpace(member)

					isCorrect := true
					questionGroupChoice := &constant.QuestionGroupChoiceEntity{
						QuestionGroupId: question.Id,
						IsCorrect:       &isCorrect,
					}

					choiceIndex++
					if strings.Contains(member, ".jpg") {
						choiceType = constant.QuestionChoiceTypeImage
						getGoogleDriveImageUrlOutput, err := service.GetGoogleDriveImageUrl(&GetGoogleDriveImageUrlInput{
							RootFolderId: in.RootFolderId,
							FileName:     member,
						})
						if err != nil {
							return nil, err
						}

						questionGroupChoice.ImageUrl = &getGoogleDriveImageUrlOutput.FileUrl
					} else {
						checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
							Tx:                tx,
							QuestionId:        question.Id,
							Text:              member,
							TextType:          constant.Choice,
							CurriculumGroupId: *curriculumGroupId,
							Language:          constant.Thai,
							SubjectId:         in.SubjectId,
							AdminLoginAs:      in.AdminLoginAs,
							RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
							ColumnNumber:      constant.CMCsvAnswer,
						})
						if err != nil {
							return nil, err
						}

						questionGroupChoice.QuestionTextId = &checkSavedTextOutput.QuestionText.Id
					}

					questionGroupChoice.Index = choiceIndex
					questionGroupChoice, err = service.academicLevelStorage.QuestionGroupChoiceCreate(tx, questionGroupChoice)
					if err != nil {
						return nil, err
					}

					_, err = service.academicLevelStorage.QuestionGroupGroupMemberCreate(tx, &constant.QuestionGroupGroupMemberEntity{
						QuestionGroupGroupId:  questionGroupGroup.Id,
						QuestionGroupChoiceId: questionGroupChoice.Id,
					})
					if err != nil {
						return nil, err
					}
				}
			}

			for i, wrongChoice := range wrongChoices {
				wrongChoice = strings.TrimSpace(wrongChoice)

				isCorrect := false
				questionGroupChoice := &constant.QuestionGroupChoiceEntity{
					QuestionGroupId: question.Id,
					IsCorrect:       &isCorrect,
				}

				if strings.Contains(wrongChoice, ".jpg") {
					choiceType = constant.QuestionChoiceTypeImage
					getGoogleDriveImageUrlOutput, err := service.GetGoogleDriveImageUrl(&GetGoogleDriveImageUrlInput{
						RootFolderId: in.RootFolderId,
						FileName:     wrongChoice,
					})
					if err != nil {
						return nil, err
					}

					questionGroupChoice.ImageUrl = &getGoogleDriveImageUrlOutput.FileUrl
				} else {
					checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
						Tx:                tx,
						QuestionId:        question.Id,
						Text:              wrongChoice,
						TextType:          constant.Choice,
						CurriculumGroupId: *curriculumGroupId,
						Language:          constant.Thai,
						SubjectId:         in.SubjectId,
						AdminLoginAs:      in.AdminLoginAs,
						RowNumber:         k + constant.CleverMathLevelCsvHeaderLines,
						ColumnNumber:      constant.CMCsvChoices,
					})
					if err != nil {
						return nil, err
					}

					questionGroupChoice.QuestionTextId = &checkSavedTextOutput.QuestionText.Id
				}

				questionGroupChoice.Index = i + 1
				_, err = service.academicLevelStorage.QuestionGroupChoiceCreate(tx, questionGroupChoice)
				if err != nil {
					return nil, err
				}
			}

			if choiceType == constant.QuestionChoiceTypeImage {
				_, err := service.academicLevelStorage.QuestionGroupUpdate(tx, &constant.QuestionGroupEntity{
					QuestionId: questionGroup.QuestionId,
					ChoiceType: constant.QuestionChoiceTypeImage,
				})
				if err != nil {
					return nil, err
				}
			}
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return nil, nil
}
