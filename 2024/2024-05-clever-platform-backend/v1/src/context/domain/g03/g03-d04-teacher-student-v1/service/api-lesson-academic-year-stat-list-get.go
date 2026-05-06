package service

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

type LessonStatAcademicYearListGetRequest struct {
	AcademicYear int `json:"academic_year" validate:"required"`
}

type LessonStatAcademicYearListGetResponse struct {
	StatusCode int                         `json:"status_code"`
	Message    string                      `json:"message"`
	Pagination *helper.Pagination          `json:"_pagination"`
	Data       []constant.StudentLevelStat `json:"data"`
}

func (api *APIStruct) LessonStatAcademicYearListGet(context *fiber.Ctx) error {
	teacherId, ok := context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	filter := constant.LessonStatAcademicYearListFilter{}
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LessonStatAcademicYearListGetRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.GetLessonStatsByTeacherAndYear(teacherId, request.AcademicYear, filter, pagination)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(LessonStatAcademicYearListGetResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Pagination: pagination,
		Data:       data,
	})
}

func (service *serviceStruct) GetLessonStatsByTeacherAndYear(
	teacherId string,
	academicYear int,
	filter constant.LessonStatAcademicYearListFilter,
	pagination *helper.Pagination,
) ([]constant.StudentLevelStat, error) {
	studentList, err := service.StudentListByTeacherId(teacherId, pagination, constant.StudentListByTeacherIdFilter{
		AcademicYear: fmt.Sprintf("%d", academicYear),
		Year:         filter.Year,
		Name:         filter.Name,
		Search:       filter.Search,
	})
	if err != nil {
		return nil, err
	}

	classDetailTasks, levelStatTasks, questionPlayLogStatTasks := service.prepareStudentTasks(studentList, academicYear)

	classDetails, err := service.collectClassDetails(classDetailTasks)
	if err != nil {
		return nil, err
	}

	levelStats, err := service.collectLevelStats(levelStatTasks)
	if err != nil {
		return nil, err
	}

	if err := service.enrichLevelStatsWithLogData(levelStats, questionPlayLogStatTasks); err != nil {
		return nil, err
	}

	academicYearList, err := service.repositoryTeacherStudent.TeacherAcademicYearList(teacherId, &helper.Pagination{LimitResponse: -1})
	if err != nil {
		return nil, err
	}

	if len(academicYearList) == 0 {
		log.Printf("%+v", errors.WithStack(fmt.Errorf("academic Year List Should Be Not Empty")))
		return nil, fmt.Errorf("academic Year List Should Be Not Empty")
	}

	return service.buildStudentLevelStats(studentList, classDetails, levelStats, academicYearList), nil
}

func (service *serviceStruct) prepareStudentTasks(studentList []constant.StudentEntity, academicYear int) (
	[]func() (constant.ClassEntity, error),
	[]func() (constant.LevelStatEntity, error),
	[]func() (constant.QuestionPlayLogStatEntity, error),
) {
	var (
		classDetailTasks         []func() (constant.ClassEntity, error)
		levelStatTasks           []func() (constant.LevelStatEntity, error)
		questionPlayLogStatTasks []func() (constant.QuestionPlayLogStatEntity, error)
	)

	for _, student := range studentList {
		classDetailTasks = append(classDetailTasks, func() (constant.ClassEntity, error) {
			return service.repositoryTeacherStudent.ClassDetailStudentByUserIdAndAcademicYear(student.Id, academicYear)
		})
		levelStatTasks = append(levelStatTasks, func() (constant.LevelStatEntity, error) {
			return service.repositoryTeacherStudent.LevelLogStatGetByUserIdAndAcademicYear(student.Id, academicYear)
		})
		questionPlayLogStatTasks = append(questionPlayLogStatTasks, func() (constant.QuestionPlayLogStatEntity, error) {
			return service.repositoryTeacherStudent.QuestionPlayLogStatGetByUserIdAndAcademicYear(student.Id, academicYear)
		})
	}

	return classDetailTasks, levelStatTasks, questionPlayLogStatTasks
}

func (service *serviceStruct) collectClassDetails(tasks []func() (constant.ClassEntity, error)) ([]constant.ClassDetail, error) {
	results := AwaitGroup(tasks)
	classDetails := make([]constant.ClassDetail, len(results))

	for i, result := range results {
		if result.Error != nil {
			return nil, result.Error
		}
		classDetails[i] = constant.ClassDetail{
			Id:           result.Result.Id,
			Year:         result.Result.Year,
			Name:         result.Result.Name,
			AcademicYear: result.Result.AcademicYear,
		}
	}

	return classDetails, nil
}

func (service *serviceStruct) collectLevelStats(tasks []func() (constant.LevelStatEntity, error)) ([]constant.LevelStat, error) {
	results := AwaitGroup(tasks)
	levelStats := make([]constant.LevelStat, len(results))

	for i, result := range results {
		if result.Error != nil {
			return nil, result.Error
		}
		levelStats[i] = constant.LevelStat{
			TotalPassed:  result.Result.TotalPassed,
			TotalStar:    result.Result.TotalStar,
			TotalLevel:   result.Result.TotalLevel,
			TotalAttempt: result.Result.TotalAttempt,
			LastPlayed:   result.Result.LastPlayed,
		}
	}

	return levelStats, nil
}

func (service *serviceStruct) enrichLevelStatsWithLogData(
	levelStats []constant.LevelStat,
	tasks []func() (constant.QuestionPlayLogStatEntity, error),
) error {
	results := AwaitGroup(tasks)

	for i, result := range results {
		if result.Error != nil {
			return result.Error
		}
		levelStats[i].AvgTimeUsed = result.Result.AvgTimeUsed
	}

	return nil
}

func (service *serviceStruct) buildStudentLevelStats(
	studentList []constant.StudentEntity,
	classDetails []constant.ClassDetail,
	levelStats []constant.LevelStat,
	academicYearList []int,
) []constant.StudentLevelStat {
	maxAcademicYear := academicYearList[0]
	studentLevelStats := make([]constant.StudentLevelStat, len(studentList))

	for i, student := range studentList {
		studentLevelStats[i] = constant.StudentLevelStat{
			Student: constant.StudentDetail{
				Id:        student.StudentId,
				Title:     student.Title,
				FirstName: student.FirstName,
				LastName:  student.LastName,
				LastLogin: student.LastLogin,
			},
			Class: classDetails[i],
			LevelPassed: constant.LevelStatistics{
				Value: float32(levelStats[i].TotalPassed),
				Total: levelStats[i].TotalLevel,
			},
			TotalScore: constant.LevelStatistics{
				Value: float32(levelStats[i].TotalStar),
				Total: levelStats[i].TotalLevel * constant.MAX_STAR_PER_LEVEL,
			},
			TotalAttempt: levelStats[i].TotalAttempt,
			AvgTimeUsed:  levelStats[i].AvgTimeUsed,
			LastPlayed:   levelStats[i].LastPlayed,

			IsEnableViewDetail: (maxAcademicYear - classDetails[i].AcademicYear) < service.config.viewableYearPastConfig,
		}
	}

	return studentLevelStats
}

type TaskResult[T any] struct {
	Index  int
	Result T
	Error  error
}

func AwaitGroup[T any](tasks []func() (T, error)) []TaskResult[T] {
	var wg sync.WaitGroup
	results := make([]TaskResult[T], len(tasks))
	resultChan := make(chan TaskResult[T], len(tasks))

	for i, task := range tasks {
		wg.Add(1)
		go func(index int, task func() (T, error)) {
			defer wg.Done()
			res, err := task()
			resultChan <- TaskResult[T]{Index: index, Result: res, Error: err}
		}(i, task)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for result := range resultChan {
		results[result.Index] = result
	}

	return results
}
