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

type getNotParticipateStudentsResponse struct {
	StatusCode int                         `json:"status_code"`
	Pagination helper.Pagination           `json:"_pagination"`
	Data       []notParticipateStudentData `json:"data"`
	Message    string                      `json:"message"`
}

type notParticipateStudentData struct {
	TotalStudent           int                    `json:"total_student"`
	NotParticipateStudents []noParticipateStudent `json:"not_participate_students"`
}

type noParticipateStudent struct {
	StudentId string `json:"student_id"`
	Name      string `json:"name"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetNotParticipateStudents(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetNotParticipateStudentsFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	pagination := helper.PaginationNew(context)
	result, err := api.service.GetNotParticipateStudents(&getNotParticipateStudentsInput{
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		StartAt:      filter.StartAt,
		EndAt:        filter.EndAt,
		Pagination:   pagination,
		LessonIds:    filter.LessonIds,
		SubLessonIds: filter.SubLessonIds,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(getNotParticipateStudentsResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       []notParticipateStudentData{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getNotParticipateStudentsInput struct {
	TeacherId    string
	StudyGroupId int
	StartAt      time.Time
	EndAt        time.Time
	Pagination   *helper.Pagination
	LessonIds    []int
	SubLessonIds []int
}

func (service serviceStruct) GetNotParticipateStudents(in *getNotParticipateStudentsInput) (out notParticipateStudentData, err error) {
	out = notParticipateStudentData{
		TotalStudent:           0,
		NotParticipateStudents: []noParticipateStudent{},
	}

	studyGroup, err := service.storage.GetStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("get study group from id error: %s", err.Error())
		return
	}

	studentUsers, err := service.storage.GetClassStudentUsers(studyGroup.ClassId)
	if err != nil {
		err = errors.Errorf("get student users error: %s", err.Error())
		return
	}

	notParticipateStudentsResult, err := service.storage.GetNotParticipateStudents(studyGroup.Id, in.Pagination, &constant.NotParticipateStudentsFilter{
		StartAt:      &in.StartAt,
		EndAt:        &in.EndAt,
		LessonIds:    in.LessonIds,
		SubLessonIds: in.SubLessonIds,
	})
	if err != nil {
		err = errors.Errorf("get not participate students error: %s", err.Error())
		return
	}

	mapStudentIdToStudentUser := make(map[string]constant.UserEntity)
	for _, u := range studentUsers {
		mapStudentIdToStudentUser[u.Id] = u
	}

	notParticipateStudents := []noParticipateStudent{}
	for _, s := range notParticipateStudentsResult {
		user, exist := mapStudentIdToStudentUser[s.StudentId]
		if exist {
			notParticipateStudents = append(notParticipateStudents, noParticipateStudent{
				StudentId: user.Id,
				Name:      fmt.Sprintf("%s %s %s", user.Title, user.FirstName, user.LastName),
			})
		}
	}

	out.TotalStudent = len(studentUsers)
	out.NotParticipateStudents = notParticipateStudents

	return
}
