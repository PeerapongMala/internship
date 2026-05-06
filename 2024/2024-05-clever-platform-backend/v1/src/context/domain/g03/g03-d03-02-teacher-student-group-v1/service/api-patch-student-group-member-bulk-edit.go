package service

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api apiStruct) PatchStudentGroupMemberByID(c *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(c, &constant.PatchStudentGroupMemberBulkEditBody{}, helper.ParseOptions{
		Params: true,
		Body:   true,
	})
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	err = api.service01.CheckStudyGroup(c, request.StudyGroupID)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	err = api.service.PatchStudentGroupMemberByID(request.StudyGroupID, request.Body)
	if err != nil {
		return helper.RespondHttpError(c, err)
	}

	return c.Status(200).JSON(fiber.Map{
		"status_code": fiber.StatusOK,
		"message":     "update study group member success",
	})
}

// ==================== Service ==========================
func (service serviceStruct) PatchStudentGroupMemberByID(studentGroupID int, items []constant.PatchStudentGroupMemberBulkEditItem) error {
	var insertItems []constant.StudyGroupStudent
	var deleteItems []constant.StudyGroupStudent
	studyGroup, err := service.storage.StudyGroupGet(studentGroupID)
	if err != nil {
		return err
	}

	for _, item := range items {
		studyGroupStudent := constant.StudyGroupStudent{
			StudyGroupID: studentGroupID,
			StudentID:    item.StudentID,
		}
		if item.IsMember {
			isExists, err := service.storage.StudyGroupStudentCheck(studyGroup.ClassId, studyGroup.SubjectId, item.StudentID)
			if err != nil {
				return err
			}
			if isExists {
				return helper.NewHttpError(http.StatusConflict, &constant.DuplicateStudyGroupStudent)
			}
			insertItems = append(insertItems, studyGroupStudent)
			continue
		}
		deleteItems = append(deleteItems, studyGroupStudent)
	}

	errChan := make(chan error, 2)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		err := service.storage.InsertMemberToStudyGroupByID(insertItems)
		if err != nil {
			errChan <- err
		}
	}()
	go func() {
		defer wg.Done()
		err := service.storage.DeleteStudyGroupMemberByID(deleteItems)
		if err != nil {
			errChan <- err
		}
	}()

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			return fmt.Errorf("error occurred: %w", err)
		}
	}

	return nil
}
