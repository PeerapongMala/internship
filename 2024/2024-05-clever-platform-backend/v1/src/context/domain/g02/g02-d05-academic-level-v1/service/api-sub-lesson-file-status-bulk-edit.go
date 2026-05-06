package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"sync"
	"time"
)

// ==================== Request ==========================

type SubLessonFileStatusBulkEditRequest struct {
	LessonIds []int `json:"lesson_ids" validate:"required"`
}

// ==================== Response ==========================

type SubLessonFileStatusBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubLessonFileStatusBulkEdit(context *fiber.Ctx) error {
	start := time.Now()
	request, err := helper.ParseAndValidateRequest(context, &SubLessonFileStatusBulkEditRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.SubLessonFileStatusBulkEdit(&SubLessonFileStatusBulkEditInput{
		SubjectId:                          subjectId,
		SubLessonFileStatusBulkEditRequest: request,
	})

	log.Println(time.Since(start))
	return context.Status(http.StatusOK).JSON(SubLessonFileStatusBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type SubLessonFileStatusBulkEditInput struct {
	SubjectId string
	*SubLessonFileStatusBulkEditRequest
}

func (service *serviceStruct) SubLessonFileStatusBulkEdit(in *SubLessonFileStatusBulkEditInput) error {
	subLessonIds, err := service.academicLevelStorage.LessonCaseListSubLesson(nil, in.LessonIds)
	if err != nil {
		return err
	}

	workerPool := make(chan struct{}, 10)
	var wg sync.WaitGroup
	var mu sync.Mutex
	var firstErr error

	for _, subLessonId := range subLessonIds {
		wg.Add(1)
		workerPool <- struct{}{}

		go func(id int) {
			defer func() {
				<-workerPool
				wg.Done()
			}()

			err := service.UpdateSubLessonFile(&UpdateSubLessonFileInput{
				subjectId:   in.SubjectId,
				subLessonId: id,
			})

			mu.Lock()
			if err != nil && firstErr == nil {
				firstErr = err
			}
			mu.Unlock()
		}(subLessonId)
	}

	wg.Wait()
	close(workerPool)

	return firstErr
}
