package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type LastestHomeworkOverview struct {
	StatusCode int                           `json:"status_code"`
	Data       []lastestHomeworkOverviewData `json:"data"`
	Message    string                        `json:"message"`
}

type lastestHomeworkOverviewData struct {
	HomeworkName     string    `json:"homework_name"`
	HomeworkLevelIds []int     `json:"homework_level_ids"`
	StartedAt        time.Time `json:"started_at"`
	ClosedAt         time.Time `json:"closed_at"`
	DueAt            time.Time `json:"due_at"`
	NotStart         int       `json:"not_start"`
	InProgress       int       `json:"in_progress"`
	Submitted        int       `json:"submitted"`
	SubmittedLate    int       `json:"submitted_late"`
	TotalSubmission  int       `json:"total_submission"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetLatestHomeworkOverview(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetLatestHomeworkOverviewFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	result, err := api.service.GetLatestHomeworkOverview(&getLatestHomeworkOverviewInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		Year:          filter.Year,
		ClassIds:      filter.ClassIds,
		LessonId:      filter.LessonId,
		StartDate:     filter.StartDate,
		EndDate:       filter.EndDate,
		StudyGroupIds: filter.StudyGroupsIds,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(LastestHomeworkOverview{
		StatusCode: http.StatusOK,
		Data:       []lastestHomeworkOverviewData{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getLatestHomeworkOverviewInput struct {
	TeacherId     string
	AcademicYear  int
	Year          string
	ClassIds      []int
	LessonId      int
	StartDate     *time.Time
	EndDate       *time.Time
	StudyGroupIds []int
}

func (service serviceStruct) GetLatestHomeworkOverview(in *getLatestHomeworkOverviewInput) (out lastestHomeworkOverviewData, err error) {
	out = lastestHomeworkOverviewData{}
	homeworks, err := service.storage.GetHomeworks(&constant.HomeworkFilter{
		Year:          in.Year,
		ClassIds:      in.ClassIds,
		Limit:         &[]int{1}[0],
		LessonId:      in.LessonId,
		TeacherId:     in.TeacherId,
		StartDate:     in.StartDate,
		EndDate:       in.EndDate,
		StudyGroupIds: in.StudyGroupIds,
	})
	if err != nil {
		err = fmt.Errorf("get latest homework error: %s", err.Error())
		return
	}
	if len(homeworks) <= 0 {
		return
	}
	homework := homeworks[0]
	out.HomeworkName = homework.Name
	out.StartedAt = homework.StartedAt
	out.DueAt = homework.DueAt
	out.ClosedAt = homework.ClosedAt

	// TODO: Implement study_group_ids from request
	classStudents, err := service.storage.GetClassStudents(in.ClassIds, []int{})
	if err != nil {
		err = fmt.Errorf("get class students error: %s", err.Error())
		return
	}

	homeworkLevels, err := service.storage.GetLevelsFromHomeworkTemplateIds([]int{homework.Id})
	if err != nil {
		err = fmt.Errorf("get homework levels error: %s", err.Error())
		return
	}
	mapHomeworkLevels := make(map[int][]int, len(homeworkLevels))
	for _, hl := range homeworkLevels {
		levelIds := helper.ConvertPgInt64ToInt(hl.Levels)
		mapHomeworkLevels[hl.HomeworkId] = levelIds
	}

	levelPlayLogs, err := service.storage.GetLevelPlayLogs(&constant.LevelPlayLogFilter{
		HomeworkIds: []int{homework.Id},
		ClassIds:    in.ClassIds,
	})
	if err != nil {
		err = fmt.Errorf("get levels error: %s", err.Error())
		return
	}

	mapStudentIdToLevels := make(map[string][]constant.LevelPlayLogEntity)
	for _, level := range levelPlayLogs {
		_, exist := mapStudentIdToLevels[level.StudentId]
		if !exist {
			mapStudentIdToLevels[level.StudentId] = []constant.LevelPlayLogEntity{level}
			continue
		}
		mapStudentIdToLevels[level.StudentId] = append(mapStudentIdToLevels[level.StudentId], level)
	}

	mapStudentToHomeworkStats := make(map[string]map[int]map[int]bool)
	for _, s := range classStudents {
		// map[student_id]
		_, mapStudentExists := mapStudentToHomeworkStats[s.StudentId]
		if !mapStudentExists {
			mapStudentToHomeworkStats[s.StudentId] = map[int]map[int]bool{}
		}
		for _, id := range []int{homework.Id} {
			// map[homework]
			_, mapHomeworkExists := mapStudentToHomeworkStats[s.StudentId][id]
			if !mapHomeworkExists {
				mapStudentToHomeworkStats[s.StudentId][id] = map[int]bool{}
			}
			for _, l := range mapHomeworkLevels[id] {
				// map[level]
				_, mapLevelExists := mapStudentToHomeworkStats[s.StudentId][id][l]
				if !mapLevelExists {
					mapStudentToHomeworkStats[s.StudentId][id][l] = false
				}
			}
		}
	}

	for _, lpl := range levelPlayLogs {
		if lpl.HomeworkId == nil {
			continue
		}
		_, studentExist := mapStudentToHomeworkStats[lpl.StudentId]
		if !studentExist {
			continue
		}
		_, homeworkExist := mapStudentToHomeworkStats[lpl.StudentId][*lpl.HomeworkId]
		if !homeworkExist {
			continue
		}
		_, levelExist := mapStudentToHomeworkStats[lpl.StudentId][*lpl.HomeworkId][lpl.LevelId]
		if !levelExist {
			continue
		}
		mapStudentToHomeworkStats[lpl.StudentId][*lpl.HomeworkId][lpl.LevelId] = true
	}

	// log.Println(mapStudentToHomeworkStats)
	doneCount := float64(0)
	inProgressCount := float64(0)
	notStartCount := float64(0)
	for _, mapHomework := range mapStudentToHomeworkStats {
		for _, mapLevel := range mapHomework {
			done, inProgress := true, false
			for _, v := range mapLevel {
				if v {
					inProgress = true
				} else {
					done = false
				}
			}
			if done {
				doneCount++
				continue
			}
			if inProgress {
				inProgressCount++
				continue
			}
			notStartCount++
		}
	}

	out.TotalSubmission = len(classStudents)
	out.Submitted = int(doneCount)
	out.InProgress = int(inProgressCount)
	out.NotStart = int(notStartCount)

	return
}
