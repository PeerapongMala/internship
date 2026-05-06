package service

import (
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type HomeworkListRequest struct {
	SchoolId   int `params:"schoolId"`
	SubjectId  int `params:"subjectid"`
	Pagination *helper.Pagination
	*constant.HomeWorkListFilter
}

// ==================== Response ==========================

type HomeworkListResponse struct {
	StatusCode int                           `json:"status_code"`
	Pagination *helper.Pagination            `json:"_pagination"`
	Data       []constant.HomeworkListEntity `json:"data"`
	Message    string                        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkList(context *fiber.Ctx) error {

	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &HomeworkListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	request.Pagination = pagination
	resp, err := api.Service.HomeworkList(&HomeworkListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       resp.Homeworks,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type HomeworkListInput struct {
	*HomeworkListRequest
}

type HomeworkListOutput struct {
	Homeworks []constant.HomeworkListEntity
}

func (service *serviceStruct) HomeworkList(in *HomeworkListInput) (*HomeworkListOutput, error) {
	homeworks, err := service.teacherHomeworkStorage.GetHomeworkBySchoolIdAndSubjectId(in.SchoolId, in.SubjectId, in.Pagination, in.HomeWorkListFilter)
	if err != nil {
		return nil, err
	}

	for idx, homework := range homeworks {
		var assginTargetLists []string
		seedYearIds := helper.ConvertPgtypeInt4ToInt(homework.SeedYearIds)
		classIds := helper.ConvertPgtypeInt4ToInt(homework.ClassIds)
		studentGroupIds := helper.ConvertPgtypeInt4ToInt(homework.StudyGroupIds)

		if len(seedYearIds) > 0 {
			seedYearShortNames, err := service.teacherHomeworkStorage.GetTargetsSeedYearShortNameByIds(seedYearIds)
			if err != nil {
				return nil, err
			}
			assginTargetLists = append(assginTargetLists, seedYearShortNames...)
		}

		if len(classIds) > 0 {
			classRoomNames, err := service.teacherHomeworkStorage.GetTargetsClassRoomNameByIds(classIds)
			if err != nil {
				return nil, err
			}
			assginTargetLists = append(assginTargetLists, classRoomNames...)
		}

		if len(studentGroupIds) > 0 {
			studentGroupNames, err := service.teacherHomeworkStorage.GetTargetsStudyGroupNameByIds(studentGroupIds)
			if err != nil {
				return nil, err
			}
			assginTargetLists = append(assginTargetLists, studentGroupNames...)
		}

		homeworkStatDTO, err := service.GetHomeworkStudentStat(*homework.HomeworkId, in.SchoolId, seedYearIds, studentGroupIds, classIds, *homework.DueAt)
		if err != nil {
			return nil, err
		}

		homeworks[idx].HomeworkStatDTO = homeworkStatDTO
		homeworks[idx].AssignTargetList = assginTargetLists
	}

	return &HomeworkListOutput{
		Homeworks: homeworks,
	}, nil
}

func (service *serviceStruct) GetHomeworkStudentStat(homeworkId int, schoolId int, seedYearIds, studentGroupIds, classIds []int, dueAt time.Time) (*constant.HomeworkStatDTO, error) {

	studentIds, err := service.teacherHomeworkStorage.GetAllStudentIds(seedYearIds, studentGroupIds, classIds, schoolId)
	if err != nil {
		return nil, err
	}

	levelCount, err := service.teacherHomeworkStorage.GetLevelTotalByHomeworkId(homeworkId)
	if err != nil {
		return nil, err
	}

	studentLevelCount, err := service.teacherHomeworkStorage.GetCountPassLevelByStudentId(homeworkId, studentIds)
	if err != nil {
		return nil, err
	}

	var onTimeStudentCount, lateStudentCount, doingStudentCount, notStartStudentCount int

	for _, studentLevelCount := range studentLevelCount {
		if helper.Deref(studentLevelCount.Count) >= levelCount && studentLevelCount.MaxPlayedAt != nil && studentLevelCount.MaxPlayedAt.Before(dueAt) {
			onTimeStudentCount++
		} else if helper.Deref(studentLevelCount.Count) >= levelCount && studentLevelCount.MaxPlayedAt != nil && studentLevelCount.MaxPlayedAt.After(dueAt) {
			lateStudentCount++
		} else if helper.Deref(studentLevelCount.Count) < levelCount && helper.Deref(studentLevelCount.Count) != 0 {
			doingStudentCount++
		} else if helper.Deref(studentLevelCount.Count) == 0 {
			notStartStudentCount++
		}
	}

	resp := &constant.HomeworkStatDTO{
		TotalStudentCount:    len(studentIds),
		OnTimeStudentCount:   onTimeStudentCount,
		DoingStudentCount:    doingStudentCount,
		NotStartStudentCount: notStartStudentCount,
		LateStudentCount:     lateStudentCount,
	}

	return resp, nil
}
