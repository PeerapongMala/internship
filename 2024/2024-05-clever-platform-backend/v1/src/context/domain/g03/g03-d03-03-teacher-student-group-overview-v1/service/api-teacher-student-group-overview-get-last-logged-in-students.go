package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type getLastLoggedInStudentsResponse struct {
	StatusCode int                       `json:"status_code"`
	Pagination helper.Pagination         `json:"_pagination"`
	Data       []lastLoggedInStudentData `json:"data"`
	Message    string                    `json:"message"`
}

type lastLoggedInStudentData struct {
	TotalStudent             int                   `json:"total_student"`
	LastLoggedInStudentCount int                   `json:"last_logged_in_student_count"`
	LastLoggedInStudents     []lastLoggedInStudent `json:"last_logged_in_students"`
}

type lastLoggedInStudent struct {
	StudentId string `json:"student_id"`
	Name      string `json:"name"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetLastLoggedInStudents(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetLastLoggedInStudentsFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	result, err := api.service.GetLastLoggedInStudents(&getLastLoggedInStudentsInput{
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		StartAt:      filter.StartAt,
		EndAt:        filter.EndAt,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(getLastLoggedInStudentsResponse{
		StatusCode: http.StatusOK,
		Data:       []lastLoggedInStudentData{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getLastLoggedInStudentsInput struct {
	TeacherId    string
	StudyGroupId int
	StartAt      time.Time
	EndAt        time.Time
}

func (service serviceStruct) GetLastLoggedInStudents(in *getLastLoggedInStudentsInput) (out lastLoggedInStudentData, err error) {
	out = lastLoggedInStudentData{
		TotalStudent:             0,
		LastLoggedInStudentCount: 0,
		LastLoggedInStudents:     []lastLoggedInStudent{},
	}

	studyGroup, err := service.storage.GetStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("get study group from id error: %s", err.Error())
		return
	}

	studentCount, err := service.storage.CountStudentsInStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("count study group by id error: %s", err.Error())
		return
	}

	lastLoggedInStudents, err := service.storage.GetLastLoggedInStudents(studyGroup.Id, in.StartAt, in.EndAt)
	if err != nil {
		err = errors.Errorf("get last logged in students error: %s", err.Error())
		return
	}

	items := []lastLoggedInStudent{}
	for _, llis := range lastLoggedInStudents {
		items = append(items, lastLoggedInStudent{
			StudentId: llis.Id,
			Name:      fmt.Sprintf("%s %s %s", llis.Title, llis.FirstName, llis.LastName),
		})
	}

	out.TotalStudent = studentCount
	out.LastLoggedInStudentCount = len(items)
	out.LastLoggedInStudents = items

	return
}
