package service

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/url"
	"slices"
	"strconv"
	"strings"
	"time"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LevelCaseUploadCsvRequest struct {
	SubLessonId  int     `params:"subLessonId" validate:"required"`
	AdminLoginAs *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type LevelCaseUploadCsvResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseUploadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseUploadCsvRequest{}, helper.ParseOptions{Params: true, Body: true})
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

	_, err = api.Service.LevelCaseUploadCsv(&LevelCaseUploadCsvInput{
		Roles:                     roles,
		SubjectId:                 subjectId,
		LevelCaseUploadCsvRequest: request,
		CsvFile:                   csvFile,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseUploadCsvResponse{
		StatusCode: http.StatusOK,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type LevelCaseUploadCsvInput struct {
	Roles     []int
	SubjectId string
	CsvFile   *multipart.FileHeader
	*LevelCaseUploadCsvRequest
}

type LevelCaseUploadCsvOutput struct {
}

func (service *serviceStruct) LevelCaseUploadCsv(in *LevelCaseUploadCsvInput) (*LevelCaseUploadCsvOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
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

	subLesson, err := service.academicLevelStorage.SubLessonGet(in.SubLessonId)
	if err != nil {
		return nil, err
	}

	if subLesson.Status != constant.SubLessonDraft {
		msg := "Cannot change levels of published sub-lesson"
		return nil, helper.NewHttpError(http.StatusConflict, &msg)
	}

	file, err := in.CsvFile.Open()
	if err != nil {
		log.Printf("+%v", errors.WithStack(err))
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)

	LevelCsvRows := []constant.LevelCsvRow{}
	lineNumber := 0
	keysToAdd := map[string]struct {
		Bytes    []byte
		FileType string
	}{}
	imagesToDownload := map[string]struct {
		Url                     string
		ColumnNumber, RowNumber int
	}{}
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

		if len(row) != constant.LevelCsvColumnsCount {
			msg := "Incorrect number of columns"
			return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
		}

		if lineNumber <= constant.LevelCsvHeaderLines {
			continue
		}

		levelCsvRow := constant.LevelCsvRow{}

		// level index
		if strings.TrimSpace(row[constant.CsvLevelIndex]) != "" {
			levelIndex, err := strconv.Atoi(row[constant.CsvLevelIndex])
			if err != nil || levelIndex == 0 {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{RowNumber: lineNumber, ColumnNumber: constant.CsvLevelIndex})
			}
			levelCsvRow.LevelIndex = levelIndex
		}

		// question type
		if strings.TrimSpace(row[constant.CsvQuestionType]) != "" {
			mapQuestionTypeFromCsvOutput, err := service.MapQuestionTypeFromCsv(&MapQuestionTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvQuestionType,
				Cell:         row[constant.CsvQuestionType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.QuestionType = mapQuestionTypeFromCsvOutput.QuestionType
		}

		// question index
		if strings.TrimSpace(row[constant.CsvQuestionIndex]) != "" {
			questionIndex, err := strconv.Atoi(row[constant.CsvQuestionIndex])
			if err != nil || questionIndex == 0 {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{RowNumber: lineNumber, ColumnNumber: constant.CsvQuestionIndex})
			}
			levelCsvRow.QuestionIndex = questionIndex
		}

		// question language
		if strings.TrimSpace(row[constant.CsvQuestionLanguage]) != "" {
			mapLanguageFromCsvOutput, err := service.MapLanguageFromCsv(&MapLanguageFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvQuestionLanguage,
				Cell:         row[constant.CsvQuestionLanguage],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.QuestionLanguage = mapLanguageFromCsvOutput.Language
		}

		// command text
		if strings.TrimSpace(row[constant.CsvCommandText]) != "" {
			levelCsvRow.CommandText = row[constant.CsvCommandText]
		}

		// description text
		if strings.TrimSpace(row[constant.CsvDescriptionText]) != "" {
			levelCsvRow.DescriptionText = row[constant.CsvDescriptionText]
		}

		// hint text
		if strings.TrimSpace(row[constant.CsvHintText]) != "" {
			levelCsvRow.HintText = row[constant.CsvHintText]
		}

		// correct text
		if strings.TrimSpace(row[constant.CsvCorrectText]) != "" {
			levelCsvRow.CorrectText = row[constant.CsvCorrectText]
		}

		// wrong text
		if strings.TrimSpace(row[constant.CsvWrongText]) != "" {
			levelCsvRow.WrongText = row[constant.CsvWrongText]
		}

		// bloom
		if strings.TrimSpace(row[constant.CsvBloom]) != "" {
			mapBloomFromCsvOutput, err := service.MapBloomFromCsv(&MapBloomFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvBloom,
				Cell:         row[constant.CsvBloom],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.Bloom = mapBloomFromCsvOutput.Bloom
		}

		// sub criteria 1
		if strings.TrimSpace(row[constant.CsvSubCriteria1]) != "" {
			levelCsvRow.SubCriteria1 = row[constant.CsvSubCriteria1]
		}

		// sub criteria 2
		if strings.TrimSpace(row[constant.CsvSubCriteria2]) != "" {
			levelCsvRow.SubCriteria2 = row[constant.CsvSubCriteria2]
		}

		// sub criteria 3
		if strings.TrimSpace(row[constant.CsvSubCriteria3]) != "" {
			levelCsvRow.SubCriteria3 = row[constant.CsvSubCriteria3]
		}

		// filter 1
		if strings.TrimSpace(row[constant.CsvFilter1]) != "" {
			filter1, err := strconv.Atoi(row[constant.CsvFilter1])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{RowNumber: lineNumber, ColumnNumber: constant.CsvFilter1})
			}
			levelCsvRow.Filter1 = filter1
		}

		// filter 2
		if strings.TrimSpace(row[constant.CsvFilter2]) != "" {
			filter2, err := strconv.Atoi(row[constant.CsvFilter2])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{RowNumber: lineNumber, ColumnNumber: constant.CsvFilter2})
			}
			levelCsvRow.Filter2 = filter2
		}

		// filter 3
		if strings.TrimSpace(row[constant.CsvFilter3]) != "" {
			filter3, err := strconv.Atoi(row[constant.CsvFilter3])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{RowNumber: lineNumber, ColumnNumber: constant.CsvFilter3})
			}
			levelCsvRow.Filter3 = filter3
		}

		// level type
		if strings.TrimSpace(row[constant.CsvLevelType]) != "" {
			mapLevelTypeFromCsvOutput, err := service.MapLevelTypeFromCsv(&MapLevelTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvLevelType,
				Cell:         row[constant.CsvLevelType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.LevelType = mapLevelTypeFromCsvOutput.LevelType
		}

		// difficulty
		if strings.TrimSpace(row[constant.CsvDifficulty]) != "" {
			mapDifficultyFromCsvOutput, err := service.MapDifficultyFromCsv(&MapDifficultyFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvDifficulty,
				Cell:         row[constant.CsvDifficulty],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.Difficulty = mapDifficultyFromCsvOutput.Difficulty
		}

		// lock next level
		if strings.TrimSpace(row[constant.CsvLockNextLevel]) != "" {
			mapLockNextLevelFromCsvOutput, err := service.MapLockNextLevelFromCsv(&MapLockNextLevelFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvLockNextLevel,
				Cell:         row[constant.CsvLockNextLevel],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.LockNextLevel = mapLockNextLevelFromCsvOutput.LockNextLevel
		}

		/// default timer type
		if strings.TrimSpace(row[constant.CsvDefaultTimerType]) != "" {
			mapDefaultTimerTypeFromCsvOutput, err := service.MapTimerTypeFromCsv(&MapTimerTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvDefaultTimerType,
				Cell:         row[constant.CsvDefaultTimerType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.DefaultTimerType = mapDefaultTimerTypeFromCsvOutput.TimerType
		}

		// default timer time
		if strings.TrimSpace(row[constant.CsvDefaultTimerTime]) != "" {
			defaultTimerType, err := strconv.Atoi(row[constant.CsvDefaultTimerTime])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvDefaultTimerTime,
				})
			}
			levelCsvRow.DefaultTimerTime = &defaultTimerType
		}

		// question timer type
		if strings.TrimSpace(row[constant.CsvQuestionTimerType]) != "" {
			mapTimerTypeFromCsvOutput, err := service.MapTimerTypeFromCsv(&MapTimerTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvQuestionTimerType,
				Cell:         row[constant.CsvQuestionTimerType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.QuestionTimerType = mapTimerTypeFromCsvOutput.TimerType
		}

		// question timer time
		if strings.TrimSpace(row[constant.CsvQuestionTimerTime]) != "" {
			questionTimerTime, err := strconv.Atoi(row[constant.CsvQuestionTimerTime])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvQuestionTimerTime,
				})
			}
			levelCsvRow.QuestionTimerTime = questionTimerTime
		}

		// layout type
		if strings.TrimSpace(row[constant.CsvLayoutType]) != "" {
			mapLayoutTypeFromCsvOutput, err := service.MapLayoutTypeFromCsv(&MapLayoutTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvLayoutType,
				Cell:         row[constant.CsvLayoutType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.LayoutType = mapLayoutTypeFromCsvOutput.LayoutType
		}

		// layout ratio
		if strings.TrimSpace(row[constant.CsvLayoutRatio]) != "" {
			mapLayoutRatioFromCsvOutput, err := service.MapLayoutRatioFromCsv(&MapLayoutRatioFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvLayoutRatio,
				Cell:         row[constant.CsvLayoutRatio],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.LayoutRatio = mapLayoutRatioFromCsvOutput.LayoutRatio
		}

		// choice grid
		if strings.TrimSpace(row[constant.CsvChoiceGrid]) != "" {
			mapChoiceGridFromCsvOutput, err := service.MapChoiceGridFromCsv(&MapChoiceGridFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvChoiceGrid,
				Cell:         row[constant.CsvChoiceGrid],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.ChoiceGrid = mapChoiceGridFromCsvOutput.ChoiceGrid
		}

		// description grid
		if strings.TrimSpace(row[constant.CsvDescriptionGrid]) != "" {
			mapDescriptionGridFromCsvOutput, err := service.MapDescriptionGridFromCsv(
				&MapDescriptionGridFromCsvInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvDescriptionGrid,
					Cell:         row[constant.CsvDescriptionGrid],
				},
			)
			if err != nil {
				return nil, err
			}
			levelCsvRow.DescriptionGrid = mapDescriptionGridFromCsvOutput.DescriptionGrid
		}

		// enforce description language
		if strings.TrimSpace(row[constant.CsvEnforceDescriptionLanguage]) != "" {
			enforceDescriptionLanguage, err := strconv.ParseBool(row[constant.CsvEnforceDescriptionLanguage])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvEnforceDescriptionLanguage,
				})
			}
			levelCsvRow.EnforceDescriptionLanguage = &enforceDescriptionLanguage
		}

		// enforce choice language
		if strings.TrimSpace(row[constant.CsvEnforceChoiceLanguage]) != "" {
			enforceChoiceLanguage, err := strconv.ParseBool(row[constant.CsvEnforceChoiceLanguage])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvEnforceChoiceLanguage,
				})
			}
			levelCsvRow.EnforceChoiceLanguage = &enforceChoiceLanguage
		}

		// command speech
		if strings.TrimSpace(row[constant.CsvCommandSpeech]) != "" {
			levelCsvRow.CommandSpeech = &row[constant.CsvCommandSpeech]
		}

		// description speech
		if strings.TrimSpace(row[constant.CsvDescriptionSpeech]) != "" {
			levelCsvRow.DescriptionSpeech = &row[constant.CsvDescriptionSpeech]
		}

		// hint speech
		if strings.TrimSpace(row[constant.CsvHintSpeech]) != "" {
			levelCsvRow.HintSpeech = &row[constant.CsvHintSpeech]
		}

		// correct text speech
		if strings.TrimSpace(row[constant.CsvCorrectTextSpeech]) != "" {
			levelCsvRow.CorrectTextSpeech = &row[constant.CsvCorrectTextSpeech]
		}

		// wrong text speech
		if strings.TrimSpace(row[constant.CsvWrongTextSpeech]) != "" {
			levelCsvRow.WrongTextSpeech = &row[constant.CsvWrongTextSpeech]
		}

		// use sound description only
		if strings.TrimSpace(row[constant.CsvUseSoundDescriptionOnly]) != "" {
			useSoundDescriptionOnly, err := strconv.ParseBool(row[constant.CsvUseSoundDescriptionOnly])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvUseSoundDescriptionOnly,
				})
			}
			levelCsvRow.UseSoundDescriptionOnly = &useSoundDescriptionOnly
		}

		// description image
		if strings.TrimSpace(row[constant.CsvDescriptionImage]) != "" {
			levelCsvRow.DescriptionImage = &row[constant.CsvDescriptionImage]
		}

		// hint image
		if strings.TrimSpace(row[constant.CsvHintImage]) != "" {
			levelCsvRow.HintImage = &row[constant.CsvHintImage]
		}

		// choice hint
		if strings.TrimSpace(row[constant.CsvChoiceHint]) != "" {
			mapChoiceHintFromCsvOutput, err := service.MapChoiceHintFromCsv(&MapChoiceHintFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvChoiceHint,
				Cell:         row[constant.CsvChoiceHint],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.ChoiceHint = mapChoiceHintFromCsvOutput.ChoiceHint
		}

		// choice type
		if strings.TrimSpace(row[constant.CsvChoiceType]) != "" {
			mapChoiceTypeFromCsvOutput, err := service.MapChoiceTypeFromCsv(&MapChoiceTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvChoiceType,
				Cell:         row[constant.CsvChoiceType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.ChoiceType = mapChoiceTypeFromCsvOutput.ChoiceType
		}

		// input type
		if strings.TrimSpace(row[constant.CsvInputType]) != "" {
			mapInputTypeFromCsvOutput, err := service.MapInputTypeFromCsv(&MapInputTypeFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvInputType,
				Cell:         row[constant.CsvInputType],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.InputType = mapInputTypeFromCsvOutput.InputType
		}

		// sub description index
		if strings.TrimSpace(row[constant.CsvSubDescriptionIndex]) != "" {
			subDescriptionIndex, err := strconv.Atoi(row[constant.CsvSubDescriptionIndex])
			if err != nil || subDescriptionIndex == 0 {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvSubDescriptionIndex,
				})
			}
			levelCsvRow.SubDescriptionIndex = subDescriptionIndex
		}

		// sub description language
		if strings.TrimSpace(row[constant.CsvSubDescriptionLanguage]) != "" {
			mapLanguageFromCsvOutput, err := service.MapLanguageFromCsv(&MapLanguageFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvSubDescriptionLanguage,
				Cell:         row[constant.CsvSubDescriptionLanguage],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.SubDescriptionLanguage = mapLanguageFromCsvOutput.Language
		}

		// sub description text
		if strings.TrimSpace(row[constant.CsvSubDescriptionText]) != "" {
			levelCsvRow.SubDescriptionText = row[constant.CsvSubDescriptionText]
		}

		if strings.TrimSpace(row[constant.CsvSubDescriptionSpeech]) != "" {
			levelCsvRow.SubDescriptionSpeech = row[constant.CsvSubDescriptionSpeech]
		}

		// choice group index
		if strings.TrimSpace(row[constant.CsvChoiceGroupIndex]) != "" {
			choiceGroupIndex, err := strconv.Atoi(row[constant.CsvChoiceGroupIndex])
			if err != nil || choiceGroupIndex == 0 {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvChoiceGroupIndex,
				})
			}
			levelCsvRow.ChoiceGroupIndex = choiceGroupIndex
		}

		// choice group language
		if strings.TrimSpace(row[constant.CsvChoiceGroupLanguage]) != "" {
			mapLanguageFromCsvOutput, err := service.MapLanguageFromCsv(&MapLanguageFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvChoiceGroupLanguage,
				Cell:         row[constant.CsvChoiceGroupLanguage],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.ChoiceGroupLanguage = mapLanguageFromCsvOutput.Language
		}

		// choice group text
		if strings.TrimSpace(row[constant.CsvChoiceGroupText]) != "" {
			levelCsvRow.ChoiceGroupText = row[constant.CsvChoiceGroupText]
		}

		// choice index
		if strings.TrimSpace(row[constant.CsvChoiceIndex]) != "" {
			choiceIndex, err := strconv.Atoi(row[constant.CsvChoiceIndex])
			if err != nil || choiceIndex == 0 {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvChoiceIndex,
				})
			}
			levelCsvRow.ChoiceIndex = choiceIndex
		}

		// choice language
		if strings.TrimSpace(row[constant.CsvChoiceLanguage]) != "" {
			mapLanguageFromCsvOutput, err := service.MapLanguageFromCsv(&MapLanguageFromCsvInput{
				RowNumber:    lineNumber,
				ColumnNumber: constant.CsvChoiceLanguage,
				Cell:         row[constant.CsvChoiceLanguage],
			})
			if err != nil {
				return nil, err
			}
			levelCsvRow.ChoiceLanguage = mapLanguageFromCsvOutput.Language
		}

		// choice text
		if strings.TrimSpace(row[constant.CsvChoiceText]) != "" {
			levelCsvRow.ChoiceText = row[constant.CsvChoiceText]
		}

		// choice speech
		if strings.TrimSpace(row[constant.CsvChoiceSpeech]) != "" {
			levelCsvRow.ChoiceSpeech = &row[constant.CsvChoiceSpeech]
		}

		// choice image
		if strings.TrimSpace(row[constant.CsvChoiceImage]) != "" {
			levelCsvRow.ChoiceImage = row[constant.CsvChoiceImage]
		}

		// is correct
		if strings.TrimSpace(row[constant.CsvIsCorrect]) != "" {
			isCorrect, err := strconv.ParseBool(row[constant.CsvIsCorrect])
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvIsCorrect,
				})
			}
			levelCsvRow.IsCorrect = &isCorrect
		}

		// score
		if strings.TrimSpace(row[constant.CsvScore]) != "" {
			score, err := strconv.Atoi(row[constant.CsvScore])
			if err != nil {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    lineNumber,
					ColumnNumber: constant.CsvScore,
				})
			}
			levelCsvRow.Score = score
		}

		LevelCsvRows = append(LevelCsvRows, levelCsvRow)
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	now := time.Now().UTC()
	var currentLevel constant.LevelEntity
	levelIndexes := []int{}
	var currentQuestion constant.QuestionEntity
	questionIndexes := []int{}
	var currentCommandGroupId string
	var currentDescriptionGroupId string
	var currentHintGroupId string
	var currentCorrectTextGroupId string
	var currentWrongTextGroupId string
	var currentQuestionMultipleChoice constant.QuestionMultipleChoiceEntity
	var currentQuestionSort constant.QuestionSortEntity
	var currentQuestionGroup constant.QuestionGroupEntity
	var currentQuestionPlaceholder constant.QuestionPlaceholderEntity
	var currentQuestionInput constant.QuestionInputEntity
	var currentQuestionLearn constant.QuestionLearnEntity
	var currentChoiceIndex int
	choiceIndexes := []int{}
	var currentGroupId string

	var questionMultipleChoiceTextChoices []constant.QuestionMultipleChoiceTextChoiceEntity
	var questionMultipleChoiceImageChoices []constant.QuestionMultipleChoiceImageChoiceEntity
	var questionMultipleChoiceChoices map[bool]int
	var questionSortChoices map[struct {
		Language  string
		Text      string
		IsCorrect *bool
	}]struct {
		QuestionTextId int
		Indexes        []int
	}
	var currentChoiceGroupIndex int
	var questionGroupGroups map[int]constant.QuestionGroupGroupEntity
	var questionGroupTextChoices map[struct {
		Language string
		Text     string
	}]struct {
		QuestionTextId int
		GroupIndexes   []int
	}
	var questionGroupImageChoices map[string]struct {
		GroupIndexes    []int
		ImageLineNumber int
	}
	var currentSubDescriptionIndex int
	var currentSubDescriptionGroupId string
	var questionPlaceholderSubDescriptions map[int]constant.QuestionTextEntity
	var questionPlaceholderTextChoices map[struct {
		Text     string
		Language string
	}]struct {
		Indexes                       []int
		QuestionPlaceholderTextChoice constant.QuestionPlaceholderTextChoiceEntity
	}
	var questionPlaceholderAnswers map[int][]constant.QuestionPlaceholderAnswerEntity
	var currentQuestionPlaceholderAnswer constant.QuestionPlaceholderAnswerEntity
	var questionPlaceholderAnswerTextList map[struct {
		QuestionPlaceholderSubDescriptionIndex int
		QuestionPlaceholderAnswerIndex         int
	}][]constant.QuestionPlaceholderAnswerTextEntity
	var currentPlaceholderTextChoiceIndex int
	var currentPlaceholderWrongChoiceIndex int

	var questionInputSubDescriptions map[int]constant.QuestionTextEntity
	var questionInputAnswers map[int][]constant.QuestionInputAnswerEntity
	var currentQuestionInputAnswer constant.QuestionInputAnswerEntity
	var questionInputAnswerTextList map[struct {
		QuestionInputSubDescriptionIndex int
		QuestionInputAnswerIndex         int
	}][]constant.QuestionInputAnswerTextEntity

	i := 0
	for _, levelCsvRow := range LevelCsvRows {
		i++
		// new level
		if levelCsvRow.LevelIndex != 0 {
			currentQuestion = constant.QuestionEntity{}
			questionIndexes = []int{}

			if slices.Contains(levelIndexes, levelCsvRow.LevelIndex) {
				msg := fmt.Sprintf("Level index %d already exists in this file", levelCsvRow.LevelIndex)
				return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			levelIndexes = append(levelIndexes, levelCsvRow.LevelIndex)

			isExists, err := service.academicLevelStorage.LevelCaseCheckIfExists(in.SubLessonId, levelCsvRow.LevelIndex)
			if err != nil {
				return nil, err
			}
			if *isExists {
				msg := fmt.Sprintf("Level index %d already exists in this sub-lesson", levelCsvRow.LevelIndex)
				return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
			}

			requiredLevelFields := map[int]interface{}{
				constant.CsvQuestionType:     levelCsvRow.QuestionType,
				constant.CsvBloom:            levelCsvRow.Bloom,
				constant.CsvLevelType:        levelCsvRow.LevelType,
				constant.CsvDifficulty:       levelCsvRow.Difficulty,
				constant.CsvLockNextLevel:    levelCsvRow.LockNextLevel,
				constant.CsvDefaultTimerType: levelCsvRow.DefaultTimerType,
				constant.CsvDefaultTimerTime: levelCsvRow.DefaultTimerTime,
			}
			err = service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: requiredLevelFields,
			})
			if err != nil {
				return nil, err
			}

			timerTime := 0
			if levelCsvRow.DefaultTimerTime != nil {
				timerTime = *levelCsvRow.DefaultTimerTime
			}
			levelEntity := constant.LevelEntity{
				SubLessonId:   in.SubLessonId,
				Index:         levelCsvRow.LevelIndex,
				BloomType:     levelCsvRow.Bloom,
				QuestionType:  levelCsvRow.QuestionType,
				LevelType:     levelCsvRow.LevelType,
				Difficulty:    levelCsvRow.Difficulty,
				LockNextLevel: levelCsvRow.LockNextLevel,
				TimerType:     levelCsvRow.DefaultTimerType,
				TimerTime:     timerTime,
				Status:        constant.Question,
				WizardIndex:   2,
				CreatedAt:     now,
				CreatedBy:     in.SubjectId,
				AdminLoginAs:  in.AdminLoginAs,
			}
			level, err := service.academicLevelStorage.LevelCreate(tx, &levelEntity)
			if err != nil {
				return nil, err
			}
			currentLevel = *level

			SubCriteriaTopicsAndTagsMap := map[int]struct {
				Id        int
				Type      int // sub-criteria = 0 / subject filter = 1
				Index     int
				ShortName string
			}{
				constant.CsvSubCriteria1: {ShortName: levelCsvRow.SubCriteria1, Type: 0, Index: 1},
				constant.CsvSubCriteria2: {ShortName: levelCsvRow.SubCriteria2, Type: 0, Index: 2},
				constant.CsvSubCriteria3: {ShortName: levelCsvRow.SubCriteria3, Type: 0, Index: 3},
				constant.CsvFilter1:      {Id: levelCsvRow.Filter1, Type: 1, Index: 1},
				constant.CsvFilter2:      {Id: levelCsvRow.Filter2, Type: 1, Index: 2},
				constant.CsvFilter3:      {Id: levelCsvRow.Filter3, Type: 1, Index: 3},
			}

			for key, value := range SubCriteriaTopicsAndTagsMap {
				if value.Id != 0 || value.ShortName != "" {
					switch value.Type {
					case 0: // sub-criteria
						subCriteriaTopicId, err := service.academicLevelStorage.SubCriteriaTopicCheckIfExists(value.ShortName, value.Index, *curriculumGroupId)
						if err != nil {
							return nil, err
						}

						if subCriteriaTopicId == 0 {
							return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
								RowNumber:    i + constant.LevelCsvHeaderLines,
								ColumnNumber: key,
							})
						}

						err = service.academicLevelStorage.LevelSubCriteriaTopicCreate(tx, subCriteriaTopicId, currentLevel.Id)
						if err != nil {
							return nil, err
						}
					case 1: // subject filter
						subjectId, err := service.academicLevelStorage.SubLessonCaseGetSubjectId(in.SubLessonId)
						if err != nil {
							return nil, err
						}

						isExists, err := service.academicLevelStorage.TagCheckIfExists(value.Id, value.Index, *subjectId)
						if err != nil {
							return nil, err
						}

						if !*isExists {
							return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
								RowNumber:    i + constant.LevelCsvHeaderLines,
								ColumnNumber: key,
							})
						}

						err = service.academicLevelStorage.LevelTagCreate(tx, value.Id, currentLevel.Id)
						if err != nil {
							return nil, err
						}
					}
				}
			}
		}

		// new question (diff index)
		if levelCsvRow.QuestionIndex != 0 && levelCsvRow.QuestionIndex != currentQuestion.Index {
			currentCommandGroupId = ""
			currentDescriptionGroupId = ""
			currentHintGroupId = ""
			currentCorrectTextGroupId = ""
			currentWrongTextGroupId = ""
			currentQuestionMultipleChoice = constant.QuestionMultipleChoiceEntity{}
			currentQuestionSort = constant.QuestionSortEntity{}
			currentQuestionGroup = constant.QuestionGroupEntity{}
			currentQuestionPlaceholder = constant.QuestionPlaceholderEntity{}
			currentQuestionInput = constant.QuestionInputEntity{}
			choiceIndexes = []int{}
			currentChoiceIndex = 0
			questionMultipleChoiceTextChoices = []constant.QuestionMultipleChoiceTextChoiceEntity{}
			questionMultipleChoiceImageChoices = []constant.QuestionMultipleChoiceImageChoiceEntity{}
			questionMultipleChoiceChoices = map[bool]int{}
			questionSortChoices = map[struct {
				Language  string
				Text      string
				IsCorrect *bool
			}]struct {
				QuestionTextId int
				Indexes        []int
			}{}
			currentChoiceGroupIndex = 0
			questionGroupGroups = map[int]constant.QuestionGroupGroupEntity{}
			questionGroupTextChoices = map[struct {
				Language string
				Text     string
			}]struct {
				QuestionTextId int
				GroupIndexes   []int
			}{}
			questionGroupImageChoices = map[string]struct {
				GroupIndexes    []int
				ImageLineNumber int
			}{}
			currentSubDescriptionIndex = 0
			currentSubDescriptionGroupId = ""
			questionPlaceholderSubDescriptions = map[int]constant.QuestionTextEntity{}
			questionPlaceholderTextChoices = map[struct {
				Text     string
				Language string
			}]struct {
				Indexes                       []int
				QuestionPlaceholderTextChoice constant.QuestionPlaceholderTextChoiceEntity
			}{}
			questionPlaceholderAnswers = map[int][]constant.QuestionPlaceholderAnswerEntity{}
			questionPlaceholderAnswerTextList = map[struct {
				QuestionPlaceholderSubDescriptionIndex int
				QuestionPlaceholderAnswerIndex         int
			}][]constant.QuestionPlaceholderAnswerTextEntity{}
			currentQuestionPlaceholderAnswer = constant.QuestionPlaceholderAnswerEntity{}
			currentPlaceholderTextChoiceIndex = 0
			currentPlaceholderWrongChoiceIndex = 0
			questionInputSubDescriptions = map[int]constant.QuestionTextEntity{}
			questionInputAnswers = map[int][]constant.QuestionInputAnswerEntity{}
			currentQuestionInputAnswer = constant.QuestionInputAnswerEntity{}
			questionInputAnswerTextList = map[struct {
				QuestionInputSubDescriptionIndex int
				QuestionInputAnswerIndex         int
			}][]constant.QuestionInputAnswerTextEntity{}

			if slices.Contains(questionIndexes, levelCsvRow.QuestionIndex) {
				msg := fmt.Sprintf("Question index %d already exists in this level", levelCsvRow.QuestionIndex)
				return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			questionIndexes = append(questionIndexes, levelCsvRow.QuestionIndex)

			if levelCsvRow.QuestionType != constant.Learn {
				requiredQuestionFields := map[int]interface{}{
					constant.CsvQuestionType:    levelCsvRow.QuestionType,
					constant.CsvChoiceType:      levelCsvRow.ChoiceType,
					constant.CsvLayoutType:      levelCsvRow.LayoutType,
					constant.CsvLayoutRatio:     levelCsvRow.LayoutRatio,
					constant.CsvChoiceGrid:      levelCsvRow.ChoiceGrid,
					constant.CsvDescriptionGrid: levelCsvRow.DescriptionGrid,
				}
				err = service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: requiredQuestionFields,
				})
				if err != nil {
					return nil, err
				}
			}

			if levelCsvRow.QuestionTimerType == "" {
				levelCsvRow.QuestionTimerType = currentLevel.TimerType
			}

			if levelCsvRow.QuestionTimerTime == 0 {
				levelCsvRow.QuestionTimerTime = currentLevel.TimerTime
			}

			if levelCsvRow.EnforceDescriptionLanguage == nil {
				levelCsvRow.EnforceDescriptionLanguage = &constant.DefaultEnforceDescriptionLanguage
			}

			if levelCsvRow.EnforceChoiceLanguage == nil {
				levelCsvRow.EnforceChoiceLanguage = &constant.DefaultEnforceChoiceLanguage
			}

			if levelCsvRow.DescriptionImage != nil && levelCsvRow.QuestionType != constant.Learn {
				downloadFileOutput, err := service.DownloadFile(&DownloadFileInput{
					ImagesToDownload: imagesToDownload,
					KeysToAdd:        keysToAdd,
					Url:              *levelCsvRow.DescriptionImage,
					FileType:         cloudStorageConstant.Image,
					RowNumber:        i + constant.LevelCsvHeaderLines,
					ColumnNumber:     constant.CsvDescriptionImage,
				})
				if err != nil {
					return nil, err
				}
				levelCsvRow.DescriptionImage = &downloadFileOutput.Key
			}

			if levelCsvRow.HintImage != nil {
				downloadFileOutput, err := service.DownloadFile(&DownloadFileInput{
					ImagesToDownload: imagesToDownload,
					KeysToAdd:        keysToAdd,
					Url:              *levelCsvRow.HintImage,
					FileType:         cloudStorageConstant.Image,
					RowNumber:        i + constant.LevelCsvHeaderLines,
					ColumnNumber:     constant.CsvHintImage,
				})
				if err != nil {
					return nil, err
				}
				levelCsvRow.HintImage = &downloadFileOutput.Key
			}

			// TODO: layout & ratio redesign
			questionEntity := constant.QuestionEntity{
				LevelId:                    currentLevel.Id,
				Index:                      levelCsvRow.QuestionIndex,
				QuestionType:               levelCsvRow.QuestionType,
				TimerType:                  levelCsvRow.QuestionTimerType,
				TimerTime:                  levelCsvRow.QuestionTimerTime,
				ChoicePosition:             levelCsvRow.LayoutType,
				Layout:                     levelCsvRow.LayoutRatio,
				LeftBoxColumns:             levelCsvRow.ChoiceGrid,
				LeftBoxRows:                levelCsvRow.ChoiceGrid,
				BottomBoxColumns:           levelCsvRow.DescriptionGrid,
				BottomBoxRows:              levelCsvRow.DescriptionGrid,
				ImageDescriptionUrl:        levelCsvRow.DescriptionImage,
				ImageHintUrl:               levelCsvRow.HintImage,
				EnforceDescriptionLanguage: levelCsvRow.EnforceDescriptionLanguage,
				EnforceChoiceLanguage:      levelCsvRow.EnforceChoiceLanguage,
			}
			question, err := service.academicLevelStorage.QuestionCreate(tx, &questionEntity)
			if err != nil {
				return nil, err
			}
			currentQuestion = *question

			if levelCsvRow.QuestionType == constant.Learn {
				err = service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvCommandText: levelCsvRow.CommandText,
					},
				})
				if err != nil {
					return nil, err
				}
			} else {
				err = service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvQuestionLanguage: levelCsvRow.QuestionLanguage,
						constant.CsvCommandText:      levelCsvRow.CommandText,
						constant.CsvDescriptionText:  levelCsvRow.DescriptionText,
					},
				})
				if err != nil {
					return nil, err
				}
			}

			questionTextMap := map[string]struct {
				Text               string
				Speech             *string
				SpeechColumnNumber int
			}{
				constant.Command:     {Text: levelCsvRow.CommandText, Speech: levelCsvRow.CommandSpeech, SpeechColumnNumber: constant.CsvCommandSpeech},
				constant.Description: {Text: levelCsvRow.DescriptionText, Speech: levelCsvRow.DescriptionSpeech, SpeechColumnNumber: constant.CsvDescriptionSpeech},
				constant.Hint:        {Text: levelCsvRow.HintText, Speech: levelCsvRow.HintSpeech, SpeechColumnNumber: constant.CsvHintSpeech},
				constant.CorrectText: {Text: levelCsvRow.CorrectText, Speech: levelCsvRow.CorrectTextSpeech, SpeechColumnNumber: constant.CsvCorrectTextSpeech},
				constant.WrongText:   {Text: levelCsvRow.WrongText, Speech: levelCsvRow.WrongTextSpeech, SpeechColumnNumber: constant.CsvWrongTextSpeech},
			}

			for key, value := range questionTextMap {
				if value.Text == "" {
					continue
				}

				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        currentQuestion.Id,
					Text:              value.Text,
					TextType:          key,
					CurriculumGroupId: *curriculumGroupId,
					Language:          levelCsvRow.QuestionLanguage,
					Speech:            value.Speech,
					SubjectId:         in.SubjectId,
					KeysToAdd:         keysToAdd,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         i + constant.LevelCsvHeaderLines,
					ColumnNumber:      value.SpeechColumnNumber,
				})
				if err != nil {
					return nil, err
				}

				savedTextGroupId := *checkSavedTextOutput.QuestionText.SavedTextGroupId
				switch key {
				case constant.Command:
					currentCommandGroupId = savedTextGroupId
				case constant.Description:
					currentDescriptionGroupId = savedTextGroupId
				case constant.Hint:
					currentHintGroupId = savedTextGroupId
				case constant.CorrectText:
					currentCorrectTextGroupId = savedTextGroupId
				case constant.WrongText:
					currentWrongTextGroupId = savedTextGroupId
				}
			}

			if levelCsvRow.UseSoundDescriptionOnly == nil {
				useSoundDescriptionOnly := false
				levelCsvRow.UseSoundDescriptionOnly = &useSoundDescriptionOnly
			}

			if levelCsvRow.ChoiceHint == "" {
				levelCsvRow.ChoiceHint = constant.DefaultChoiceHint
			}

			switch levelCsvRow.QuestionType {
			case constant.MultipleChoice:
				currentQuestionMultipleChoice = constant.QuestionMultipleChoiceEntity{
					QuestionId:              currentQuestion.Id,
					UseSoundDescriptionOnly: levelCsvRow.UseSoundDescriptionOnly,
					ChoiceType:              levelCsvRow.ChoiceType,
				}
			case constant.Sort:
				currentQuestionSort = constant.QuestionSortEntity{
					QuestionId:              currentQuestion.Id,
					UseSoundDescriptionOnly: levelCsvRow.UseSoundDescriptionOnly,
					ChoiceType:              levelCsvRow.ChoiceType,
				}
			case constant.Group:
				currentQuestionGroup = constant.QuestionGroupEntity{
					QuestionId:              currentQuestion.Id,
					UseSoundDescriptionOnly: levelCsvRow.UseSoundDescriptionOnly,
					ChoiceType:              levelCsvRow.ChoiceType,
				}
			case constant.Placeholder:
				if levelCsvRow.ChoiceHint == "" {
					levelCsvRow.ChoiceHint = constant.DefaultChoiceHint
				}
				currentQuestionPlaceholder = constant.QuestionPlaceholderEntity{
					QuestionId:              currentQuestion.Id,
					UseSoundDescriptionOnly: levelCsvRow.UseSoundDescriptionOnly,
					ChoiceType:              levelCsvRow.ChoiceType,
					HintType:                levelCsvRow.ChoiceHint,
				}
			case constant.Input:
				if levelCsvRow.InputType == "" {
					levelCsvRow.InputType = constant.DefaultInputType
				}
				if levelCsvRow.ChoiceHint == "" {
					levelCsvRow.ChoiceHint = constant.DefaultChoiceHint
				}
				currentQuestionInput = constant.QuestionInputEntity{
					QuestionId:              currentQuestion.Id,
					UseSoundDescriptionOnly: levelCsvRow.UseSoundDescriptionOnly,
					InputType:               levelCsvRow.InputType,
					HintType:                levelCsvRow.ChoiceHint,
				}
			case constant.Learn:
				var text *string
				if levelCsvRow.DescriptionText != "" {
					text = &levelCsvRow.DescriptionText
				}
				currentQuestionLearn = constant.QuestionLearnEntity{
					QuestionId: currentQuestion.Id,
					Text:       text,
					Url:        levelCsvRow.DescriptionImage,
				}
			}
		}

		// same question diff language
		if levelCsvRow.QuestionIndex != 0 && levelCsvRow.QuestionIndex == currentQuestion.Index {
			if (levelCsvRow.CommandText != "" || levelCsvRow.DescriptionText != "" || levelCsvRow.HintText != "") && levelCsvRow.QuestionLanguage == "" {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    i + constant.LevelCsvHeaderLines,
					ColumnNumber: constant.CsvQuestionLanguage,
				})
			}

			questionTextMap := map[string]struct {
				Text    string
				GroupId string
				Speech  *string
			}{
				constant.Command:     {Text: levelCsvRow.CommandText, GroupId: currentCommandGroupId, Speech: levelCsvRow.CommandSpeech},
				constant.Description: {Text: levelCsvRow.DescriptionText, GroupId: currentDescriptionGroupId, Speech: levelCsvRow.DescriptionSpeech},
				constant.Hint:        {Text: levelCsvRow.HintText, GroupId: currentHintGroupId, Speech: levelCsvRow.HintSpeech},
				constant.CorrectText: {Text: levelCsvRow.CorrectText, GroupId: currentCorrectTextGroupId, Speech: levelCsvRow.CorrectTextSpeech},
				constant.WrongText:   {Text: levelCsvRow.WrongText, GroupId: currentWrongTextGroupId, Speech: levelCsvRow.WrongTextSpeech},
			}

			for _, value := range questionTextMap {
				if value.Text == "" {
					continue
				}

				err := service.CheckSavedTextGroupLanguage(&CheckSavedTextGroupLanguageInput{
					Tx:                tx,
					CurriculumGroupId: *curriculumGroupId,
					Text:              value.Text,
					GroupId:           value.GroupId,
					Language:          levelCsvRow.QuestionLanguage,
					Speech:            value.Speech,
					SubjectId:         in.SubjectId,
					KeysToAdd:         keysToAdd,
					AdminLoginAs:      in.AdminLoginAs,
				})
				if err != nil {
					return nil, err
				}
			}
		}

		// new question multiple choice choice
		// TODO: reset choice index & choice indexes
		if currentQuestion.QuestionType == constant.MultipleChoice && levelCsvRow.ChoiceIndex != 0 && levelCsvRow.ChoiceIndex != currentChoiceIndex {
			currentGroupId = ""
			if slices.Contains(choiceIndexes, levelCsvRow.ChoiceIndex) {
				msg := fmt.Sprintf("Choice index %d already exists in this question at column %d of row %d", levelCsvRow.ChoiceIndex, constant.CsvChoiceIndex, i+constant.LevelCsvHeaderLines)
				return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			choiceIndexes = append(choiceIndexes, levelCsvRow.ChoiceIndex)

			currentChoiceIndex = levelCsvRow.ChoiceIndex

			switch currentQuestionMultipleChoice.ChoiceType {
			case constant.QuestionChoiceTypeTextSpeech, constant.QuestionChoiceTypeSpeech:
				err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvChoiceText:     levelCsvRow.ChoiceText,
						constant.CsvChoiceLanguage: levelCsvRow.ChoiceLanguage,
					},
				})
				if err != nil {
					return nil, err
				}

				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        currentQuestion.Id,
					Text:              levelCsvRow.ChoiceText,
					TextType:          constant.Choice,
					CurriculumGroupId: *curriculumGroupId,
					Language:          levelCsvRow.ChoiceLanguage,
					Speech:            levelCsvRow.ChoiceSpeech,
					SubjectId:         in.SubjectId,
					KeysToAdd:         keysToAdd,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         i + constant.LevelCsvHeaderLines,
					ColumnNumber:      constant.CsvChoiceSpeech,
				})
				if err != nil {
					return nil, err
				}

				currentGroupId = *checkSavedTextOutput.QuestionText.SavedTextGroupId

				if levelCsvRow.IsCorrect == nil {
					levelCsvRow.IsCorrect = &constant.DefaultIsCorrect
				}

				questionMultipleChoiceTextChoiceEntity := constant.QuestionMultipleChoiceTextChoiceEntity{
					QuestionMultipleChoiceId: currentQuestion.Id,
					QuestionTextId:           checkSavedTextOutput.QuestionText.Id,
					Index:                    currentChoiceIndex,
					IsCorrect:                levelCsvRow.IsCorrect,
					Point:                    &levelCsvRow.Score,
				}
				questionMultipleChoiceTextChoices = append(questionMultipleChoiceTextChoices, questionMultipleChoiceTextChoiceEntity)
				questionMultipleChoiceChoices[*questionMultipleChoiceTextChoiceEntity.IsCorrect] += 1
			case constant.QuestionChoiceTypeImage:
				err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvChoiceImage: levelCsvRow.ChoiceImage,
					},
				})
				if err != nil {
					return nil, err
				}

				if levelCsvRow.IsCorrect == nil {
					levelCsvRow.IsCorrect = &constant.DefaultIsCorrect
				}

				downloadFileOutput, err := service.DownloadFile(&DownloadFileInput{
					ImagesToDownload: imagesToDownload,
					KeysToAdd:        keysToAdd,
					Url:              levelCsvRow.ChoiceImage,
					FileType:         cloudStorageConstant.Image,
					RowNumber:        i + constant.LevelCsvHeaderLines,
					ColumnNumber:     constant.CsvChoiceImage,
				})
				if err != nil {
					return nil, err
				}
				levelCsvRow.ChoiceImage = downloadFileOutput.Key

				questionMultipleChoiceImageChoiceEntity := constant.QuestionMultipleChoiceImageChoiceEntity{
					QuestionMultipleChoiceId: currentQuestion.Id,
					Index:                    currentChoiceIndex,
					ImageUrl:                 levelCsvRow.ChoiceImage,
					IsCorrect:                levelCsvRow.IsCorrect,
					Point:                    &levelCsvRow.Score,
				}
				questionMultipleChoiceImageChoices = append(questionMultipleChoiceImageChoices, questionMultipleChoiceImageChoiceEntity)
				questionMultipleChoiceChoices[*questionMultipleChoiceImageChoiceEntity.IsCorrect] += 1
			}
		}

		isTargetQuestionType := currentQuestion.QuestionType == constant.MultipleChoice || currentQuestion.QuestionType == constant.Sort || currentQuestion.QuestionType == constant.Group
		isChoice := levelCsvRow.ChoiceIndex != 0
		isCurrentChoiceIndex := levelCsvRow.ChoiceIndex == currentChoiceIndex
		isTextOrSpeechType := currentQuestionMultipleChoice.ChoiceType == constant.QuestionChoiceTypeSpeech || currentQuestionMultipleChoice.ChoiceType == constant.QuestionChoiceTypeTextSpeech || currentQuestionSort.ChoiceType == constant.QuestionChoiceTypeSpeech || currentQuestionSort.ChoiceType == constant.QuestionChoiceTypeTextSpeech

		// same question multiple choice / sort / group choice index diff language
		if isTargetQuestionType && isChoice && isCurrentChoiceIndex && isTextOrSpeechType { // TODO: check condition of this choice type (might have speech choice type)
			err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: map[int]interface{}{
					constant.CsvChoiceText:     levelCsvRow.ChoiceText,
					constant.CsvChoiceLanguage: levelCsvRow.ChoiceLanguage,
				},
			})
			if err != nil {
				return nil, err
			}

			err = service.CheckSavedTextGroupLanguage(&CheckSavedTextGroupLanguageInput{
				Tx:                tx,
				CurriculumGroupId: *curriculumGroupId,
				Text:              levelCsvRow.ChoiceText,
				GroupId:           currentGroupId,
				Language:          levelCsvRow.ChoiceLanguage,
				Speech:            levelCsvRow.ChoiceSpeech,
				SubjectId:         in.SubjectId,
				KeysToAdd:         keysToAdd,
				AdminLoginAs:      in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}

		}

		// question sort new choice
		isQuestionSort := currentQuestion.QuestionType == constant.Sort
		isChoice = levelCsvRow.ChoiceIndex != 0
		isNewChoice := levelCsvRow.ChoiceIndex != currentChoiceIndex
		if isQuestionSort && isChoice && isNewChoice {
			currentGroupId = ""
			if slices.Contains(choiceIndexes, levelCsvRow.ChoiceIndex) {
				msg := fmt.Sprintf("Choice index %d already exists in this question at column %d of row %d", levelCsvRow.ChoiceIndex, constant.CsvChoiceIndex, i+constant.LevelCsvHeaderLines)
				return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
			}
			choiceIndexes = append(choiceIndexes, levelCsvRow.ChoiceIndex)

			currentChoiceIndex = levelCsvRow.ChoiceIndex

			switch currentQuestionSort.ChoiceType {
			case constant.QuestionChoiceTypeTextSpeech, constant.QuestionChoiceTypeSpeech:
				err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvChoiceText:     levelCsvRow.ChoiceText,
						constant.CsvChoiceLanguage: levelCsvRow.ChoiceLanguage,
					},
				})
				if err != nil {
					return nil, err
				}

				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        currentQuestion.Id,
					Text:              levelCsvRow.ChoiceText,
					TextType:          constant.Choice,
					CurriculumGroupId: *curriculumGroupId,
					Language:          levelCsvRow.ChoiceLanguage,
					Speech:            levelCsvRow.ChoiceSpeech,
					SubjectId:         in.SubjectId,
					KeysToAdd:         keysToAdd,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         i + constant.LevelCsvHeaderLines,
					ColumnNumber:      constant.CsvChoiceSpeech,
				})
				if err != nil {
					return nil, err
				}

				currentGroupId = *checkSavedTextOutput.QuestionText.SavedTextGroupId

				if levelCsvRow.IsCorrect == nil {
					levelCsvRow.IsCorrect = &constant.DefaultIsCorrect
				}

				key := struct {
					Language  string
					Text      string
					IsCorrect *bool
				}{
					Language:  levelCsvRow.ChoiceLanguage,
					Text:      levelCsvRow.ChoiceText,
					IsCorrect: levelCsvRow.IsCorrect,
				}
				value := questionSortChoices[key]
				value.QuestionTextId = checkSavedTextOutput.QuestionText.Id
				value.Indexes = append(value.Indexes, currentChoiceIndex)
				questionSortChoices[key] = value
			}
		}

		isQuestionGroup := currentQuestion.QuestionType == constant.Group
		isChoiceGroup := levelCsvRow.ChoiceGroupIndex != 0
		isNewChoiceGroup := levelCsvRow.ChoiceGroupIndex != currentChoiceGroupIndex
		// question group new group
		if isQuestionGroup && isChoiceGroup && isNewChoiceGroup {
			currentChoiceIndex = 0

			err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: map[int]interface{}{
					constant.CsvChoiceGroupText:     levelCsvRow.ChoiceGroupText,
					constant.CsvChoiceGroupLanguage: levelCsvRow.ChoiceGroupLanguage,
				},
			})
			if err != nil {
				return nil, err
			}

			_, exists := questionGroupGroups[levelCsvRow.ChoiceGroupIndex]
			if currentChoiceGroupIndex != levelCsvRow.ChoiceGroupIndex && exists {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					ColumnNumber: constant.CsvChoiceGroupIndex,
					RowNumber:    i + constant.LevelCsvHeaderLines,
				})
			}
			currentChoiceGroupIndex = levelCsvRow.ChoiceGroupIndex

			checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
				Tx:                tx,
				QuestionId:        currentQuestion.Id,
				Text:              levelCsvRow.ChoiceGroupText,
				TextType:          constant.GroupName,
				CurriculumGroupId: *curriculumGroupId,
				Language:          levelCsvRow.ChoiceGroupLanguage,
				SubjectId:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}

			currentGroupId = *checkSavedTextOutput.QuestionText.SavedTextGroupId

			questionGroupGroupEntity := constant.QuestionGroupGroupEntity{
				QuestionGroupId: currentQuestion.Id,
				QuestionTextId:  checkSavedTextOutput.QuestionText.Id,
				Index:           currentChoiceGroupIndex,
			}

			questionGroupGroups[questionGroupGroupEntity.Index] = questionGroupGroupEntity
		}

		// question group same group diff lang
		isQuestionGroup = currentQuestion.QuestionType == constant.Group
		isChoiceGroup = levelCsvRow.ChoiceGroupIndex != 0
		isCurrentChoiceGroup := levelCsvRow.ChoiceGroupIndex == currentChoiceGroupIndex
		if isQuestionGroup && isChoiceGroup && isCurrentChoiceGroup {
			err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: map[int]interface{}{
					constant.CsvChoiceGroupText:     levelCsvRow.ChoiceGroupText,
					constant.CsvChoiceGroupLanguage: levelCsvRow.ChoiceGroupLanguage,
				},
			})
			if err != nil {
				return nil, err
			}

			err = service.CheckSavedTextGroupLanguage(&CheckSavedTextGroupLanguageInput{
				Tx:                tx,
				CurriculumGroupId: *curriculumGroupId,
				Text:              levelCsvRow.ChoiceGroupText,
				GroupId:           currentGroupId,
				Language:          levelCsvRow.ChoiceGroupLanguage,
				SubjectId:         in.SubjectId,
				AdminLoginAs:      in.AdminLoginAs,
			})
		}

		// new question group choice
		isQuestionGroup = currentQuestion.QuestionType == constant.Group
		isChoice = levelCsvRow.ChoiceIndex != 0
		isNewChoice = levelCsvRow.ChoiceIndex != currentChoiceIndex
		if isQuestionGroup && isChoice && isNewChoice {
			currentGroupId = ""
			//if slices.Contains(choiceIndexes, levelCsvRow.ChoiceIndex) {
			//	msg := fmt.Sprintf("Choice index %d already exists in this question", levelCsvRow.ChoiceIndex)
			//	return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
			//}
			choiceIndexes = append(choiceIndexes, levelCsvRow.ChoiceIndex)

			currentChoiceIndex = levelCsvRow.ChoiceIndex

			if levelCsvRow.IsCorrect == nil {
				levelCsvRow.IsCorrect = &constant.DefaultIsCorrect
			}

			switch currentQuestionGroup.ChoiceType {
			case constant.QuestionChoiceTypeTextSpeech, constant.QuestionChoiceTypeSpeech:
				err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvChoiceText:     levelCsvRow.ChoiceText,
						constant.CsvChoiceLanguage: levelCsvRow.ChoiceLanguage,
					},
				})
				if err != nil {
					return nil, err
				}

				checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
					Tx:                tx,
					QuestionId:        currentQuestion.Id,
					Text:              levelCsvRow.ChoiceText,
					TextType:          constant.Choice,
					CurriculumGroupId: *curriculumGroupId,
					Language:          levelCsvRow.ChoiceLanguage,
					Speech:            levelCsvRow.ChoiceSpeech,
					SubjectId:         in.SubjectId,
					KeysToAdd:         keysToAdd,
					AdminLoginAs:      in.AdminLoginAs,
					RowNumber:         i + constant.LevelCsvHeaderLines,
					ColumnNumber:      constant.CsvChoiceSpeech,
				})
				if err != nil {
					return nil, err
				}

				currentGroupId = *checkSavedTextOutput.QuestionText.SavedTextGroupId

				key := struct {
					Language string
					Text     string
				}{Language: levelCsvRow.ChoiceLanguage, Text: levelCsvRow.ChoiceText}

				isCorrect := new(bool)
				_, exists := questionGroupTextChoices[key]
				if exists {
					value := questionGroupTextChoices[key]
					if len(value.GroupIndexes) > 0 {
						*isCorrect = true
					} else {
						*isCorrect = false
					}
				}

				if exists && *isCorrect != *levelCsvRow.IsCorrect {
					msg := fmt.Sprintf(
						`Cannot re-use choice text (%s) at column %d of row %d (is correct conflict)`,
						levelCsvRow.ChoiceText,
						constant.CsvChoiceText+1,
						i+constant.LevelCsvHeaderLines,
					)
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				value := questionGroupTextChoices[key]
				value.QuestionTextId = checkSavedTextOutput.QuestionText.Id

				if *levelCsvRow.IsCorrect {
					value.GroupIndexes = append(value.GroupIndexes, currentChoiceGroupIndex)
					questionGroupTextChoices[key] = value
				} else {
					value.GroupIndexes = append(value.GroupIndexes, currentChoiceGroupIndex)
					value.GroupIndexes = []int{}
					questionGroupTextChoices[key] = value
				}
			case constant.QuestionChoiceTypeImage:
				err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
					Row: i,
					Map: map[int]interface{}{
						constant.CsvChoiceImage: levelCsvRow.ChoiceImage,
					},
				})
				if err != nil {
					return nil, err
				}

				isCorrect := new(bool)
				_, exists := questionGroupImageChoices[levelCsvRow.ChoiceImage]
				if exists {
					value := questionGroupImageChoices[levelCsvRow.ChoiceImage]
					if len(value.GroupIndexes) > 0 {
						*isCorrect = true
					} else {
						*isCorrect = false
					}
				}

				if exists && *isCorrect != *levelCsvRow.IsCorrect {
					msg := fmt.Sprintf(
						`Cannot re-use choice text (%s) at column %d of row %d (is correct conflict)`,
						levelCsvRow.ChoiceText,
						constant.CsvChoiceText+1,
						i+constant.LevelCsvHeaderLines,
					)
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				if *levelCsvRow.IsCorrect {
					groupIndexes := append(questionGroupImageChoices[levelCsvRow.ChoiceImage].GroupIndexes, currentChoiceGroupIndex)
					tmpStruct := struct {
						GroupIndexes    []int
						ImageLineNumber int
					}{
						GroupIndexes:    groupIndexes,
						ImageLineNumber: questionGroupImageChoices[levelCsvRow.ChoiceImage].ImageLineNumber,
					}
					questionGroupImageChoices[levelCsvRow.ChoiceImage] = tmpStruct
				} else {
					questionGroupImageChoices[levelCsvRow.ChoiceImage] = struct {
						GroupIndexes    []int
						ImageLineNumber int
					}{GroupIndexes: []int{}, ImageLineNumber: i + constant.LevelCsvHeaderLines}
				}
			}
		}

		// new question placeholder sub description
		isQuestionPlaceholder := currentQuestion.QuestionType == constant.Placeholder
		isSubDescription := levelCsvRow.SubDescriptionIndex != 0
		isNewSubDescription := levelCsvRow.SubDescriptionIndex != currentSubDescriptionIndex
		if isQuestionPlaceholder && isSubDescription && isNewSubDescription {
			currentSubDescriptionGroupId = ""
			currentQuestionPlaceholderAnswer = constant.QuestionPlaceholderAnswerEntity{}
			err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: map[int]interface{}{
					constant.CsvSubDescriptionLanguage: levelCsvRow.SubDescriptionLanguage,
					constant.CsvSubDescriptionText:     levelCsvRow.SubDescriptionText,
				},
			})
			if err != nil {
				return nil, err
			}

			currentSubDescriptionIndex = levelCsvRow.SubDescriptionIndex

			checkSavedTextOutput, err := service.CheckSavedText(&CheckSavedTextInput{
				Tx:                  tx,
				QuestionId:          currentQuestion.Id,
				Text:                levelCsvRow.SubDescriptionText,
				TextType:            constant.Description,
				CurriculumGroupId:   *curriculumGroupId,
				Language:            levelCsvRow.SubDescriptionLanguage,
				SubDescriptionIndex: &levelCsvRow.SubDescriptionIndex,
				SubjectId:           in.SubjectId,
				OverrideStatus:      &constant.SavedTextHidden,
				IgnoreQuestionText:  true,
				AdminLoginAs:        in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}

			currentSubDescriptionGroupId = *checkSavedTextOutput.QuestionText.SavedTextGroupId
			questionPlaceholderSubDescriptions[levelCsvRow.SubDescriptionIndex] = checkSavedTextOutput.QuestionText
		}

		// same question placeholder / input sub description diff lang
		isTargetQuestionType = currentQuestion.QuestionType == constant.Placeholder || currentQuestion.QuestionType == constant.Input
		isSubDescription = levelCsvRow.SubDescriptionIndex != 0
		isCurrentSubDescription := levelCsvRow.SubDescriptionIndex == currentSubDescriptionIndex
		if isTargetQuestionType && isSubDescription && isCurrentSubDescription {
			err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: map[int]interface{}{
					constant.CsvSubDescriptionLanguage: levelCsvRow.SubDescriptionLanguage,
					constant.CsvSubDescriptionText:     levelCsvRow.SubDescriptionText,
				},
			})
			if err != nil {
				return nil, err
			}

			err = service.CheckSavedTextGroupLanguage(&CheckSavedTextGroupLanguageInput{
				Tx:                tx,
				CurriculumGroupId: *curriculumGroupId,
				Text:              levelCsvRow.SubDescriptionText,
				GroupId:           currentSubDescriptionGroupId,
				Language:          levelCsvRow.SubDescriptionLanguage,
				SubjectId:         in.SubjectId,
				OverrideStatus:    &constant.SavedTextHidden,
				AdminLoginAs:      in.AdminLoginAs,
			})
			if err != nil {
				return nil, err
			}
		}

		isQuestionPlaceholder = currentQuestion.QuestionType == constant.Placeholder
		isAnswer := levelCsvRow.ChoiceGroupIndex != 0
		// question placeholder answer
		if isQuestionPlaceholder && isAnswer {
			for _, answer := range questionPlaceholderAnswers[currentSubDescriptionIndex] {
				if answer.AnswerIndex == levelCsvRow.ChoiceGroupIndex {
					return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
						RowNumber:    i + constant.LevelCsvHeaderLines,
						ColumnNumber: constant.CsvChoiceGroupIndex,
					})
				}
			}

			questionPlaceholderAnswerEntity := constant.QuestionPlaceholderAnswerEntity{
				QuestionTextDescriptionId: questionPlaceholderSubDescriptions[currentSubDescriptionIndex].Id,
				AnswerIndex:               levelCsvRow.ChoiceGroupIndex,
			}
			questionPlaceholderAnswers[currentSubDescriptionIndex] = append(questionPlaceholderAnswers[currentSubDescriptionIndex], questionPlaceholderAnswerEntity)
			currentQuestionPlaceholderAnswer = questionPlaceholderAnswerEntity
		}

		// question placeholder answer text
		if currentQuestion.QuestionType == constant.Placeholder && levelCsvRow.ChoiceIndex != 0 {
			key := struct {
				QuestionPlaceholderSubDescriptionIndex int
				QuestionPlaceholderAnswerIndex         int
			}{QuestionPlaceholderSubDescriptionIndex: currentSubDescriptionIndex, QuestionPlaceholderAnswerIndex: currentQuestionPlaceholderAnswer.AnswerIndex}
			value := questionPlaceholderAnswerTextList[key]
			for _, answerText := range value {
				if answerText.Index == levelCsvRow.ChoiceIndex {
					return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
						RowNumber:    i + constant.LevelCsvHeaderLines,
						ColumnNumber: constant.CsvChoiceIndex,
					})
				}
			}

			if levelCsvRow.ChoiceText == "" {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    i + constant.LevelCsvHeaderLines,
					ColumnNumber: constant.CsvChoiceText,
				})
			}

			if levelCsvRow.IsCorrect == nil {
				levelCsvRow.IsCorrect = &constant.DefaultIsCorrect
			}

			textChoiceKey := struct {
				Text     string
				Language string
			}{Text: levelCsvRow.ChoiceText, Language: levelCsvRow.ChoiceLanguage}

			_, exists := questionPlaceholderTextChoices[textChoiceKey]

			if !exists {
				savedTextEntity := constant.SavedTextEntity{
					CurriculumGroupId: *curriculumGroupId,
					GroupId:           uuid.NewString(),
					Language:          levelCsvRow.ChoiceLanguage, // TODO: subject langauge
					Text:              &levelCsvRow.ChoiceText,
					TextToAi:          &levelCsvRow.ChoiceText,
					//SpeechUrl:         levelCommandSpeech,
					Status:       constant.SavedTextHidden,
					CreatedAt:    time.Now().UTC(),
					CreatedBy:    in.SubjectId,
					AdminLoginAs: in.AdminLoginAs,
				}

				questionTextEntity := constant.QuestionTextEntity{
					QuestionId: currentQuestion.Id,
					Type:       constant.Choice,
				}

				if levelCsvRow.ChoiceSpeech != nil {
					savedTextEntity.SpeechUrl = levelCsvRow.ChoiceSpeech
					parsedUrl, err := url.Parse(*levelCsvRow.ChoiceSpeech)
					if err != nil {
						return nil, err
					}
					if parsedUrl.Host == "" {
						savedTextEntity.TextToAi = levelCsvRow.ChoiceSpeech
						speechKey := uuid.NewString()
						speechBytes, err := service.textToSpeechStorage.TextToSpeechCaseGenerateSpeech(*levelCsvRow.ChoiceSpeech, levelCsvRow.ChoiceLanguage)
						if err != nil {
							return nil, err
						}
						savedTextEntity.SpeechUrl = &speechKey
						keysToAdd[speechKey] = struct {
							Bytes    []byte
							FileType string
						}{Bytes: speechBytes, FileType: cloudStorageConstant.Speech}
					}
				}
				savedText, err := service.academicLevelStorage.SavedTextCreate(tx, &savedTextEntity)
				if err != nil {
					return nil, err
				}
				questionTextEntity.SavedTextGroupId = &savedText.GroupId

				choiceText, err := service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
				if err != nil {
					return nil, err
				}

				questionPlaceholderTextChoiceEntity := constant.QuestionPlaceholderTextChoiceEntity{
					QuestionPlaceholderId: currentQuestion.Id,
					QuestionTextId:        choiceText.Id,
					IsCorrect:             levelCsvRow.IsCorrect,
				}

				if *levelCsvRow.IsCorrect {
					currentPlaceholderTextChoiceIndex++
					value := questionPlaceholderTextChoices[textChoiceKey]
					value.Indexes = []int{levelCsvRow.ChoiceIndex}
					questionPlaceholderTextChoiceEntity.Index = currentPlaceholderTextChoiceIndex
					value.QuestionPlaceholderTextChoice = questionPlaceholderTextChoiceEntity
					questionPlaceholderTextChoices[textChoiceKey] = value

					questionPlaceholderAnswerTextEntity := constant.QuestionPlaceholderAnswerTextEntity{
						QuestionPlaceholderAnswerId: currentQuestionPlaceholderAnswer.Id,
						ChoiceIndex:                 currentPlaceholderTextChoiceIndex,
					}

					answerTextKey := struct {
						QuestionPlaceholderSubDescriptionIndex int
						QuestionPlaceholderAnswerIndex         int
					}{QuestionPlaceholderSubDescriptionIndex: currentSubDescriptionIndex, QuestionPlaceholderAnswerIndex: currentQuestionPlaceholderAnswer.AnswerIndex}

					questionPlaceholderAnswerTextList[answerTextKey] = append(questionPlaceholderAnswerTextList[answerTextKey], questionPlaceholderAnswerTextEntity)
				} else {
					currentPlaceholderWrongChoiceIndex++
					questionPlaceholderTextChoiceEntity.Index = currentPlaceholderWrongChoiceIndex
					questionPlaceholderTextChoices[textChoiceKey] = struct {
						Indexes                       []int
						QuestionPlaceholderTextChoice constant.QuestionPlaceholderTextChoiceEntity
					}{Indexes: []int{}, QuestionPlaceholderTextChoice: questionPlaceholderTextChoiceEntity}
				}
			} else {
				if *levelCsvRow.IsCorrect {
					textChoiceIndex := questionPlaceholderTextChoices[textChoiceKey].QuestionPlaceholderTextChoice.Index
					questionPlaceholderAnswerTextEntity := constant.QuestionPlaceholderAnswerTextEntity{
						QuestionPlaceholderAnswerId: currentQuestionPlaceholderAnswer.Id,
						ChoiceIndex:                 textChoiceIndex,
					}
					//targetIndex := questionPlaceholderTextChoices[struct {
					//	Text     string
					//	Language string
					//}{Text: levelCsvRow.ChoiceText, Language: levelCsvRow.ChoiceLanguage}]

					answerTextKey := struct {
						QuestionPlaceholderSubDescriptionIndex int
						QuestionPlaceholderAnswerIndex         int
					}{QuestionPlaceholderSubDescriptionIndex: currentSubDescriptionIndex, QuestionPlaceholderAnswerIndex: currentQuestionPlaceholderAnswer.AnswerIndex}

					questionPlaceholderAnswerTextList[answerTextKey] = append(questionPlaceholderAnswerTextList[answerTextKey], questionPlaceholderAnswerTextEntity)

					value := questionPlaceholderTextChoices[textChoiceKey]
					value.Indexes = append(value.Indexes, levelCsvRow.ChoiceIndex)
					questionPlaceholderTextChoices[textChoiceKey] = value
				}
			}
		}

		isQuestionInput := currentQuestion.QuestionType == constant.Input
		isSubDescription = levelCsvRow.SubDescriptionIndex != 0
		isNewSubDescription = levelCsvRow.SubDescriptionIndex != currentSubDescriptionIndex
		// new question input sub description
		if isQuestionInput && isSubDescription && isNewSubDescription {
			currentSubDescriptionGroupId = ""
			currentQuestionInputAnswer = constant.QuestionInputAnswerEntity{}

			err := service.CheckRequiredFields(&CheckRequiredFieldsInput{
				Row: i,
				Map: map[int]interface{}{
					constant.CsvSubDescriptionLanguage: levelCsvRow.SubDescriptionLanguage,
					constant.CsvSubDescriptionText:     levelCsvRow.SubDescriptionText,
				},
			})
			if err != nil {
				return nil, err
			}

			currentSubDescriptionIndex = levelCsvRow.SubDescriptionIndex

			checkSavedText, err := service.CheckSavedText(&CheckSavedTextInput{
				Tx:                  tx,
				QuestionId:          currentQuestion.Id,
				Text:                levelCsvRow.SubDescriptionText,
				TextType:            constant.Description,
				CurriculumGroupId:   *curriculumGroupId,
				Language:            levelCsvRow.SubDescriptionLanguage,
				SubDescriptionIndex: &levelCsvRow.SubDescriptionIndex,
				Speech:              &levelCsvRow.SubDescriptionSpeech,
				SubjectId:           in.SubjectId,
				OverrideStatus:      &constant.SavedTextHidden,
				IgnoreQuestionText:  true,
				AdminLoginAs:        in.AdminLoginAs,
				KeysToAdd:           keysToAdd,
				RowNumber:           i + constant.LevelCsvHeaderLines,
				ColumnNumber:        constant.CsvSubDescriptionSpeech,
			})
			if err != nil {
				return nil, err
			}

			currentSubDescriptionGroupId = *checkSavedText.QuestionText.SavedTextGroupId
			questionInputSubDescriptions[levelCsvRow.SubDescriptionIndex] = checkSavedText.QuestionText
		}

		// question input answer
		if currentQuestion.QuestionType == constant.Input && levelCsvRow.ChoiceGroupIndex != 0 {
			for _, answer := range questionInputAnswers[currentSubDescriptionIndex] {
				if answer.AnswerIndex == levelCsvRow.ChoiceGroupIndex {
					return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
						RowNumber:    i + constant.LevelCsvHeaderLines,
						ColumnNumber: constant.CsvChoiceGroupIndex,
					})
				}
			}

			questionInputAnswerEntity := constant.QuestionInputAnswerEntity{
				QuestionTextDescriptionId: questionInputSubDescriptions[currentSubDescriptionIndex].Id,
				AnswerIndex:               levelCsvRow.ChoiceGroupIndex,
			}
			questionInputAnswers[currentSubDescriptionIndex] = append(questionInputAnswers[currentSubDescriptionIndex], questionInputAnswerEntity)
			currentQuestionInputAnswer = questionInputAnswerEntity
		}

		// question input answer text
		isQuestionInput = currentQuestion.QuestionType == constant.Input
		isChoice = levelCsvRow.ChoiceIndex != 0
		if isQuestionInput && isChoice {
			key := struct {
				QuestionInputSubDescriptionIndex int
				QuestionInputAnswerIndex         int
			}{
				QuestionInputSubDescriptionIndex: currentSubDescriptionIndex,
				QuestionInputAnswerIndex:         currentQuestionInputAnswer.AnswerIndex,
			}
			value := questionInputAnswerTextList[key]
			for _, answerText := range value {
				if answerText.Index == levelCsvRow.ChoiceIndex {
					return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
						RowNumber:    i + constant.LevelCsvHeaderLines,
						ColumnNumber: constant.CsvChoiceIndex,
					})
				}
			}

			if levelCsvRow.ChoiceText == "" {
				return nil, service.BuildLevelCsvGeneralError(&BuildLevelCsvGeneralErrorInput{
					RowNumber:    i + constant.LevelCsvHeaderLines,
					ColumnNumber: constant.CsvChoiceText,
				})
			}

			savedTextEntity := constant.SavedTextEntity{
				CurriculumGroupId: *curriculumGroupId,
				GroupId:           uuid.NewString(),
				Language:          levelCsvRow.ChoiceLanguage, // TODO: subject language
				Text:              &levelCsvRow.ChoiceText,
				TextToAi:          &levelCsvRow.ChoiceText,
				//SpeechUrl:         levelCommandSpeech,
				Status:       constant.SavedTextHidden,
				CreatedAt:    time.Now().UTC(),
				CreatedBy:    in.SubjectId,
				AdminLoginAs: in.AdminLoginAs,
			}
			savedText, err := service.academicLevelStorage.SavedTextCreate(tx, &savedTextEntity)
			if err != nil {
				return nil, err
			}

			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       currentQuestion.Id,
				Type:             constant.Choice,
				SavedTextGroupId: &savedText.GroupId,
			}

			choiceText, err := service.academicLevelStorage.QuestionTextCreate(tx, &questionTextEntity)
			if err != nil {
				return nil, err
			}

			questionInputAnswerText := constant.QuestionInputAnswerTextEntity{
				QuestionInputAnswerId: currentQuestionInputAnswer.Id,
				QuestionTextId:        choiceText.Id,
			}

			key = struct {
				QuestionInputSubDescriptionIndex int
				QuestionInputAnswerIndex         int
			}{QuestionInputSubDescriptionIndex: currentSubDescriptionIndex, QuestionInputAnswerIndex: currentQuestionInputAnswer.AnswerIndex}
			questionInputAnswerTextList[key] = append(questionInputAnswerTextList[key], questionInputAnswerText)
		}

		isNotLastRow := i+1 < len(LevelCsvRows)
		isNewQuestion := isNotLastRow && LevelCsvRows[i].QuestionIndex != 0 && LevelCsvRows[i].QuestionIndex != currentQuestion.Index
		isNewLevel := isNotLastRow && LevelCsvRows[i].LevelIndex != 0 && LevelCsvRows[i].LevelIndex != currentLevel.Index
		isLastRow := i == len(LevelCsvRows)

		// save question
		if isNewQuestion || isNewLevel || isLastRow {
			switch currentQuestion.QuestionType {
			case constant.MultipleChoice:
				if currentLevel.LevelType != constant.PrePostTest && currentLevel.LevelType != constant.SubLessonPostTest && currentLevel.QuestionType != constant.MultipleChoice {
					msg := "Invalid question type of this level"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				if questionMultipleChoiceChoices[true] >= 1 {
					currentQuestionMultipleChoice.CorrectChoiceAmount = constant.CorrectChoiceAmountOne
				} else {
					currentQuestionMultipleChoice.CorrectChoiceAmount = constant.CorrectChoiceAmountMoreThanOne
				}

				_, err = service.academicLevelStorage.QuestionMultipleChoiceCreate(tx, &currentQuestionMultipleChoice)
				if err != nil {
					return nil, err
				}

				switch currentQuestionMultipleChoice.ChoiceType {
				case constant.QuestionChoiceTypeTextSpeech, constant.QuestionChoiceTypeSpeech:
					for _, choice := range questionMultipleChoiceTextChoices {
						_, err := service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCreate(tx, &choice)
						if err != nil {
							return nil, err
						}
					}
				case constant.QuestionChoiceTypeImage:
					for _, choice := range questionMultipleChoiceImageChoices {
						_, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCreate(tx, &choice)
						if err != nil {
							return nil, err
						}
					}
				}
			case constant.Sort:
				if currentLevel.LevelType != constant.PrePostTest && currentLevel.LevelType != constant.SubLessonPostTest && currentLevel.QuestionType != constant.Sort {
					msg := "Invalid question type of this level"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				canReuseChoice := false
				choiceAmount := 0
				dummyAmount := 0

				for key, value := range questionSortChoices {
					if len(value.Indexes) > 2 {
						canReuseChoice = true
					}
					if *key.IsCorrect {
						choiceAmount++
					} else {
						dummyAmount++
					}
				}
				currentQuestionSort.CanReuseChoice = &canReuseChoice
				currentQuestionSort.ChoiceAmount = choiceAmount
				currentQuestionSort.DummyAmount = &dummyAmount
				_, err = service.academicLevelStorage.QuestionSortCreate(tx, &currentQuestionSort)
				if err != nil {
					return nil, err
				}

				choiceIndex := 0
				dummyIndex := 0
				for key, value := range questionSortChoices {
					index := 0
					if *key.IsCorrect {
						choiceIndex++
						index = choiceIndex
					} else {
						dummyIndex++
						index = dummyIndex
					}

					questionSortTextChoiceEntity := constant.QuestionSortTextChoiceEntity{
						QuestionSortId: currentQuestion.Id,
						QuestionTextId: value.QuestionTextId,
						Index:          index,
						IsCorrect:      key.IsCorrect,
					}
					questionSortTextChoice, err := service.academicLevelStorage.QuestionSortTextChoiceCreate(tx, &questionSortTextChoiceEntity)
					if err != nil {
						return nil, err
					}

					if *key.IsCorrect {
						for _, index := range value.Indexes {
							questionSortAnswerEntity := constant.QuestionSortAnswerEntity{
								QuestionSortId:           currentQuestion.Id,
								QuestionSortTextChoiceId: questionSortTextChoice.Id,
								Index:                    index,
							}
							_, err := service.academicLevelStorage.QuestionSortAnswerCreate(tx, &questionSortAnswerEntity)
							if err != nil {
								return nil, err
							}
						}
					}
				}
			case constant.Group:
				if currentLevel.LevelType != constant.PrePostTest && currentLevel.LevelType != constant.SubLessonPostTest && currentLevel.QuestionType != constant.Group {
					msg := "Invalid question type of this level"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				canReuseChoice := false
				ChoiceAmount := 0
				DummyAmount := 0

				switch currentQuestionGroup.ChoiceType {
				case constant.QuestionChoiceTypeSpeech, constant.QuestionChoiceTypeTextSpeech:
					for _, value := range questionGroupTextChoices {
						if len(value.GroupIndexes) > 0 {
							ChoiceAmount++
						}
						if len(value.GroupIndexes) > 1 {
							canReuseChoice = true
						}
						if len(value.GroupIndexes) == 0 {
							DummyAmount++
						}
					}
				case constant.QuestionChoiceTypeImage:
					for _, value := range questionGroupImageChoices {
						if len(value.GroupIndexes) > 0 {
							ChoiceAmount++
						}
						if len(value.GroupIndexes) > 1 {
							canReuseChoice = true
						}
						if len(value.GroupIndexes) == 0 {
							DummyAmount++
						}
					}
				}

				currentQuestionGroup.GroupAmount = len(questionGroupGroups)
				currentQuestionGroup.CanReuseChoice = &canReuseChoice
				currentQuestionGroup.ChoiceAmount = ChoiceAmount
				currentQuestionGroup.DummyAmount = DummyAmount
				_, err := service.academicLevelStorage.QuestionGroupCreate(tx, &currentQuestionGroup)
				if err != nil {
					return nil, err
				}

				for i, group := range questionGroupGroups {
					questionGroup, err := service.academicLevelStorage.QuestionGroupGroupCreate(tx, &group)
					if err != nil {
						return nil, err
					}
					questionGroupGroups[i] = *questionGroup
				}

				for key, value := range questionGroupTextChoices {
					fmt.Println(key, value)
				}

				switch currentQuestionGroup.ChoiceType {
				case constant.QuestionChoiceTypeSpeech, constant.QuestionChoiceTypeTextSpeech:
					ChoiceAmount = 0
					DummyAmount = 0
					for _, value := range questionGroupTextChoices {
						index := 0
						isCorrect := false
						if len(value.GroupIndexes) > 0 {
							ChoiceAmount++
							index = ChoiceAmount
							isCorrect = true
						}
						if len(value.GroupIndexes) == 0 {
							DummyAmount++
							index = DummyAmount
						}

						questionGroupChoiceEntity := constant.QuestionGroupChoiceEntity{
							QuestionGroupId: currentQuestion.Id,
							Index:           index,
							QuestionTextId:  &value.QuestionTextId,
							IsCorrect:       &isCorrect,
						}
						questionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(tx, &questionGroupChoiceEntity)
						if err != nil {
							return nil, err
						}
						for _, groupIndex := range value.GroupIndexes {
							questionGroupGroupMember := constant.QuestionGroupGroupMemberEntity{
								QuestionGroupGroupId:  questionGroupGroups[groupIndex].Id,
								QuestionGroupChoiceId: questionGroupChoice.Id,
							}
							_, err = service.academicLevelStorage.QuestionGroupGroupMemberCreate(tx, &questionGroupGroupMember)
							if err != nil {
								return nil, err
							}
						}
					}
				case constant.QuestionChoiceTypeImage:
					ChoiceAmount = 0
					DummyAmount = 0
					for imageUrl, value := range questionGroupImageChoices {
						index := 1
						isCorrect := false
						if len(value.GroupIndexes) > 0 {
							ChoiceAmount++
							index = ChoiceAmount
							isCorrect = true
						}
						if len(value.GroupIndexes) == 0 {
							DummyAmount++
							index = DummyAmount
						}

						downloadFileOutput, err := service.DownloadFile(&DownloadFileInput{
							ImagesToDownload: imagesToDownload,
							KeysToAdd:        keysToAdd,
							Url:              imageUrl,
							FileType:         cloudStorageConstant.Image,
							RowNumber:        value.ImageLineNumber,
							ColumnNumber:     constant.CsvChoiceImage,
						})
						if err != nil {
							return nil, err
						}
						imageUrl = downloadFileOutput.Key

						questionGroupChoiceEntity := constant.QuestionGroupChoiceEntity{
							QuestionGroupId: currentQuestion.Id,
							Index:           index,
							ImageUrl:        &imageUrl,
							IsCorrect:       &isCorrect,
						}
						questionGroupChoice, err := service.academicLevelStorage.QuestionGroupChoiceCreate(tx, &questionGroupChoiceEntity)
						if err != nil {
							return nil, err
						}
						for _, groupIndex := range value.GroupIndexes {
							questionGroupGroupMember := constant.QuestionGroupGroupMemberEntity{
								QuestionGroupGroupId:  questionGroupGroups[groupIndex].Id,
								QuestionGroupChoiceId: questionGroupChoice.Id,
							}
							_, err = service.academicLevelStorage.QuestionGroupGroupMemberCreate(tx, &questionGroupGroupMember)
							if err != nil {
								return nil, err
							}
						}

					}
				}
			case constant.Placeholder:
				if currentLevel.LevelType != constant.PrePostTest && currentLevel.LevelType != constant.SubLessonPostTest && currentLevel.QuestionType != constant.Placeholder {
					msg := "Invalid question type of this level"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				choiceAmount := 0
				dummyAmount := 0
				canReuseChoice := false

				for _, value := range questionPlaceholderTextChoices {
					if len(value.Indexes) == 0 {
						dummyAmount++
					}
					if len(value.Indexes) > 0 {
						choiceAmount++
					}
					if len(value.Indexes) > 1 {
						canReuseChoice = true
					}
				}

				currentQuestionPlaceholder.CanReuseChoice = &canReuseChoice
				currentQuestionPlaceholder.ChoiceAmount = choiceAmount
				currentQuestionPlaceholder.DummyAmount = &dummyAmount
				_, err := service.academicLevelStorage.QuestionPlaceholderCreate(tx, &currentQuestionPlaceholder)
				if err != nil {
					return nil, err
				}

				for _, value := range questionPlaceholderTextChoices {
					isCorrect := false
					if len(value.Indexes) > 0 {
						isCorrect = true
					}
					value.QuestionPlaceholderTextChoice.IsCorrect = &isCorrect
					value.QuestionPlaceholderTextChoice.QuestionPlaceholderId = currentQuestion.Id
					_, err := service.academicLevelStorage.QuestionPlaceholderTextChoiceCreate(tx, &value.QuestionPlaceholderTextChoice)
					if err != nil {
						return nil, err
					}
				}

				for _, questionText := range questionPlaceholderSubDescriptions {
					subDescription, err := service.academicLevelStorage.QuestionTextCreate(tx, &questionText)
					if err != nil {
						return nil, err
					}

					answers := questionPlaceholderAnswers[*subDescription.Index]
					for _, answer := range answers {
						answer.QuestionTextDescriptionId = subDescription.Id
						questionPlaceholderAnswer, err := service.academicLevelStorage.QuestionPlaceholderAnswerCreate(tx, &answer)
						if err != nil {
							return nil, err
						}

						for j, answerText := range questionPlaceholderAnswerTextList[struct {
							QuestionPlaceholderSubDescriptionIndex int
							QuestionPlaceholderAnswerIndex         int
						}{QuestionPlaceholderSubDescriptionIndex: *subDescription.Index, QuestionPlaceholderAnswerIndex: answer.AnswerIndex}] {
							answerText.Index = j + 1
							answerText.QuestionPlaceholderAnswerId = questionPlaceholderAnswer.Id
							_, err = service.academicLevelStorage.QuestionPlaceholderAnswerTextCreate(tx, &answerText)
							if err != nil {
								return nil, err
							}
						}
					}
				}
			case constant.Input:
				if currentLevel.LevelType != constant.PrePostTest && currentLevel.LevelType != constant.SubLessonPostTest && currentLevel.QuestionType != constant.Input {
					msg := "Invalid question type of this level"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				_, err := service.academicLevelStorage.QuestionInputCreate(tx, &currentQuestionInput)
				if err != nil {
					return nil, err
				}

				for _, questionText := range questionInputSubDescriptions {
					subDescription, err := service.academicLevelStorage.QuestionTextCreate(tx, &questionText)
					if err != nil {
						return nil, err
					}

					answers := questionInputAnswers[*subDescription.Index]
					for _, answer := range answers {
						answer.QuestionTextDescriptionId = subDescription.Id

						if len(questionInputAnswerTextList[struct {
							QuestionInputSubDescriptionIndex int
							QuestionInputAnswerIndex         int
						}{QuestionInputSubDescriptionIndex: *subDescription.Index, QuestionInputAnswerIndex: answer.AnswerIndex}]) > 1 {
							answer.Type = &constant.CorrectChoiceAmountMoreThanOne
						} else {
							answer.Type = &constant.CorrectChoiceAmountOne
						}

						questionInputAnswer, err := service.academicLevelStorage.QuestionInputAnswerCreate(tx, &answer)
						if err != nil {
							return nil, err
						}

						for j, answerText := range questionInputAnswerTextList[struct {
							QuestionInputSubDescriptionIndex int
							QuestionInputAnswerIndex         int
						}{QuestionInputSubDescriptionIndex: *subDescription.Index, QuestionInputAnswerIndex: answer.AnswerIndex}] {
							answerText.Index = j + 1
							answerText.QuestionInputAnswerId = questionInputAnswer.Id

							_, err := service.academicLevelStorage.QuestionInputAnswerTextCreate(tx, &answerText)
							if err != nil {
								return nil, err
							}
						}
					}
				}
			case constant.Learn:
				if currentLevel.LevelType != constant.PrePostTest && currentLevel.LevelType != constant.SubLessonPostTest && currentLevel.QuestionType != constant.Learn {
					msg := "Invalid question type of this level"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				if currentQuestionLearn.Url != nil && currentQuestionLearn.Text != nil {
					msg := "Questions of the 'learn' type cannot contain both text and video"
					return nil, helper.NewHttpError(http.StatusBadRequest, &msg)
				}

				_, err := service.academicLevelStorage.QuestionLearnCreate(tx, &currentQuestionLearn)
				if err != nil {
					return nil, err
				}
			}
		}
	}

	err = service.DownloadImageParallel(DownloadImageParallelInput{
		ImagesToDownload: imagesToDownload,
	})
	if err != nil {
		return nil, err
	}

	for key, value := range keysToAdd {
		err := service.cloudStorage.ObjectCreate(value.Bytes, key, value.FileType)
		if err != nil {
			return nil, err
		}
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{in.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &LevelCaseUploadCsvOutput{}, nil
}
