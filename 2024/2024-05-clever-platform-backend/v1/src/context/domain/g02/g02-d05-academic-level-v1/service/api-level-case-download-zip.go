package service

import (
	"archive/zip"
	"bytes"
	"compress/flate"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LevelCaseDownloadZipRequest struct {
	SubLessonId int  `params:"subLessonId" validate:"required"`
	NoQuestion  bool `query:"no_question"`
	*constant.LevelFilter
}

// ==================== Response ==========================

type LevelCaseDownloadZipResponse struct {
	StatusCode int                            `json:"status_code"`
	Pagination *helper.Pagination             `json:"_pagination"`
	Data       []constant.LevelListDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseDownloadZip(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseDownloadZipRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	pagination := helper.PaginationNew(context)

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

	levelListOutput, err := api.Service.LevelCaseDownloadZip(&LevelCaseDownloadZipInput{
		Roles:                       roles,
		SubjectId:                   subjectId,
		Pagination:                  pagination,
		LevelCaseDownloadZipRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	data, err := json.Marshal(levelListOutput.Levels)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	//jsonSize := len(data)

	zipBuffer := new(bytes.Buffer)
	zipWriter := zip.NewWriter(zipBuffer)

	zipWriter.RegisterCompressor(zip.Deflate, func(w io.Writer) (io.WriteCloser, error) {
		return flate.NewWriter(w, flate.BestCompression)
	})

	zipFile, err := zipWriter.Create("levels.json")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	_, err = zipFile.Write(data)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	err = zipWriter.Close()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "application/zip")
	context.Set("Content-Disposition", fmt.Sprintf("attachment; filename=sub-lesson-id-%d.zip", request.SubLessonId))
	//zipSize := zipBuffer.Len()

	//log.Printf("Original JSON: %d bytes", jsonSize)
	//log.Printf("Compressed ZIP: %d bytes", zipSize)
	//log.Printf("Compression Ratio: %.2f%%", 100*float64(zipSize)/float64(jsonSize))
	return context.Status(http.StatusOK).Send(zipBuffer.Bytes())
}

// ==================== Service ==========================

type LevelCaseDownloadZipInput struct {
	Roles      []int
	SubjectId  string
	Pagination *helper.Pagination
	*LevelCaseDownloadZipRequest
}

type LevelCaseDownloadZipOutput struct {
	Meta                  *constant.SubLessonMetaEntity  `json:"meta"`
	SubLessonId           int                            `json:"sub_lesson_id"`
	UpdatedAt             *time.Time                     `json:"updated_at"`
	Levels                []constant.LevelListDataEntity `json:"levels"`
	LessonCount           int                            `json:"lesson_count"`
	SubjectSubLessonCount int                            `json:"subject_sub_lesson_count"`
	LessonSubLessonCount  int                            `json:"lesson_sub_lesson_count"`
	LessonIds             []int                          `json:"lesson_ids"`
}

func (service *serviceStruct) LevelCaseDownloadZip(in *LevelCaseDownloadZipInput) (*LevelCaseDownloadZipOutput, error) {
	//curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
	//if err != nil {
	//	return nil, err
	//}
	//
	//if !slices.Contains(in.Roles, int(userConstant.Student)) {
	//	err = service.CheckContentCreator(&CheckContentCreatorInput{
	//		SubjectId:         in.SubjectId,
	//		Roles:             in.Roles,
	//		CurriculumGroupId: *curriculumGroupId,
	//	})
	//	if err != nil {
	//		return nil, err
	//	}
	//}

	levels, err := service.academicLevelStorage.LevelList(in.SubLessonId, in.LevelFilter, in.Pagination, true)
	if err != nil {
		return nil, err
	}

	if !in.NoQuestion {
		var wg sync.WaitGroup
		wg.Add(len(levels))

		var mu sync.Mutex

		errChan := make(chan error, len(levels))

		for i := range levels {
			go func(idx int) {
				defer wg.Done()

				level := levels[idx]

				questions, err := service.academicLevelStorage.QuestionCaseListByLevelId(level.Id, nil)
				if err != nil {
					errChan <- err
					return
				}

				getFullQuestionsOutput, err := service.GetFullQuestions(&GetFullQuestionsInput{
					questions,
				})
				if err != nil {
					errChan <- err
					return
				}

				mu.Lock()
				levels[idx].Questions = getFullQuestionsOutput.FullQuestions
				mu.Unlock()
			}(i)
		}

		go func() {
			wg.Wait()
			close(errChan)
		}()

		for err := range errChan {
			if err != nil {
				return nil, err
			}
		}
	}

	meta, err := service.academicLevelStorage.SubLessonCaseGetMeta(in.SubLessonId)
	if err != nil {
		return nil, err
	}

	return &LevelCaseDownloadZipOutput{
		Meta:   meta,
		Levels: levels,
	}, nil
}
