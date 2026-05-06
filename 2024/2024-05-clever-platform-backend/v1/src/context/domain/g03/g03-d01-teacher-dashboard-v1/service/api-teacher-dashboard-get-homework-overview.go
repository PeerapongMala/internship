package service

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"slices"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type HomeworkOverviewsResponse struct {
	StatusCode int                `json:"status_code"`
	Data       []homeworkOverview `json:"data"`
	Message    string             `json:"message"`
}

type homeworkOverview struct {
	TotalHomework int     `json:"total_homework"`
	NotStart      float64 `json:"not_start"`
	InProgress    float64 `json:"in_progress"`
	Done          float64 `json:"done"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) GetHomeworkOverview(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetHomeworkOverviewFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	if len(filter.LessonIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"lession_ids is empty"}[0]))
	}
	result, err := api.service.GetHomeworkOverview(&getHomeworkOverviewInput{
		TeacherId:         subjectId,
		StartAt:           filter.StartAt,
		EndAt:             filter.EndAt,
		LessonIds:         filter.LessonIds,
		ClassIds:          filter.ClassIds,
		StudyGroupIds:     filter.StudyGroupIds,
		StartDateStartAt:  filter.StartDateStartAt,
		StartDateEndAt:    filter.StartDateEndAt,
		DueDateStartAt:    filter.DueDateStartAt,
		DueDateEndAt:      filter.DueDateEndAt,
		ClosedDateStartAt: filter.ClosedDateStartAt,
		ClosedDateEndAt:   filter.ClosedDateEndAt,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(HomeworkOverviewsResponse{
		StatusCode: http.StatusOK,
		Data:       []homeworkOverview{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getHomeworkOverviewInput struct {
	// required
	TeacherId     string
	StartAt       time.Time
	EndAt         time.Time
	LessonIds     []int
	ClassIds      []int
	StudyGroupIds []int

	// optional
	StartDateStartAt  *time.Time
	StartDateEndAt    *time.Time
	DueDateStartAt    *time.Time
	DueDateEndAt      *time.Time
	ClosedDateStartAt *time.Time
	ClosedDateEndAt   *time.Time
}

func (service *serviceStruct) GetHomeworkOverview(in *getHomeworkOverviewInput) (outs homeworkOverview, err error) {
	outs = homeworkOverview{}

	homeworks, err := service.storage.GetHomeworksFromLessonIds(
		in.LessonIds,
		&constant.HomeworkFromLessonIdsFilter{
			StartDateStartAt:  in.StartDateStartAt,
			StartDateEndAt:    in.StartDateEndAt,
			DueDateStartAt:    in.DueDateStartAt,
			DueDateEndAt:      in.DueDateEndAt,
			ClosedDateStartAt: in.ClosedDateStartAt,
			ClosedDateEndAt:   in.ClosedDateEndAt,
		},
		in.TeacherId,
	)
	if err != nil {
		err = fmt.Errorf("get homeworks from lesson ids error: %s", err.Error())
		return
	}
	homeworkIds := []int{}
	homeworkTemplateIds := []int{}
	for _, h := range homeworks {
		homeworkIds = append(homeworkIds, h.Id)
		if !slices.Contains(homeworkTemplateIds, h.HomeworkTemplateId) {
			homeworkTemplateIds = append(homeworkTemplateIds, h.HomeworkTemplateId)
		}
	}

	classStudents, err := service.storage.GetClassStudents(in.ClassIds, in.StudyGroupIds)
	if err != nil {
		err = fmt.Errorf("get class students error: %s", err.Error())
		return
	}

	// subLessons, err := service.storage.GetSubLessonsFromLessonIds(in.LessonIds)
	// if err != nil {
	// 	err = fmt.Errorf("get sub lessons from lesson ids error: %s", err.Error())
	// 	return
	// }
	// subLessonIds := []int{}
	// for _, sl := range subLessons {
	// 	subLessonIds = append(subLessonIds, sl.Id)
	// }
	// levels, err := service.storage.GetLevelsFromSubLessonIds(subLessonIds)

	homeworkLevels, err := service.storage.GetLevelsFromHomeworkTemplateIds(homeworkIds)
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
		ClassIds:    in.ClassIds,
		HomeworkIds: homeworkIds,
		StartAt:     &in.StartAt,
		EndAt:       &in.EndAt,
	})
	if err != nil {
		err = fmt.Errorf("get level play logs error: %s", err.Error())
		return
	}

	// map[student_id] -> map[homework_id] -> map[level_id] to bool
	mapStudentToHomeworkStats := make(map[string]map[int]map[int]bool)
	for _, s := range classStudents {
		// map[student_id]
		_, mapStudentExists := mapStudentToHomeworkStats[s.StudentId]
		if !mapStudentExists {
			mapStudentToHomeworkStats[s.StudentId] = map[int]map[int]bool{}
		}
		for _, id := range homeworkIds {
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

	total := float64(len(homeworkIds) * len(classStudents))
	if total == 0 {
		return
	}

	outs.TotalHomework = len(homeworkIds)

	outs.Done = helper.Round(doneCount / total * 100)
	outs.InProgress = helper.Round(inProgressCount / total * 100)
	outs.NotStart = helper.Round(notStartCount / total * 100)

	sum := outs.Done + outs.InProgress + outs.NotStart
	if sum != 100 {
		maxVal := math.Max(math.Max(outs.Done, outs.InProgress), outs.NotStart)
		switch {
		case outs.Done == maxVal:
			outs.Done += 100 - sum
		case outs.InProgress == maxVal:
			outs.InProgress += 100 - sum
		default:
			outs.NotStart += 100 - sum
		}
	}
	return
}
