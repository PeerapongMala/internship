package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================
type HomeworkDetailListRequest struct {
	HomeworkId int `params:"homeworkId" validate:"required"`
	SchoolId   int `query:"schoolId"`
	Pagination *helper.Pagination
}

// ==================== Response ==========================
type HomeworkDetailListResponse struct {
	Pagination *helper.Pagination                `json:"_pagination"`
	Data       []constant.HomeworkDetailResponse `json:"data"`
	constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkDetailList(context *fiber.Ctx) error {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &HomeworkDetailListRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request.Pagination = pagination
	resp, err := api.Service.HomeworkDetailList(&HomeworkDetailListInput{HomeworkDetailListRequest: request, TeacherId: subjectId})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkDetailListResponse{
		Data:       resp.HomeworkDetails,
		Pagination: pagination,
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
	})
}

type HomeworkDetailListInput struct {
	*HomeworkDetailListRequest
	TeacherId string
}

type HomeworkDetailListOutput struct {
	HomeworkDetails []constant.HomeworkDetailResponse
}

// ==================== Service ==========================
func (service *serviceStruct) HomeworkDetailList(in *HomeworkDetailListInput) (*HomeworkDetailListOutput, error) {

	homeworkDetails, err := service.teacherHomeworkStorage.GetHomeworkDetailListByHomeworkId(in.HomeworkId, in.Pagination)
	if err != nil {
		return nil, err
	}

	assignedResp, err := service.teacherHomeworkStorage.GetHomeworkAssignedData(in.HomeworkId)
	if err != nil {
		return nil, err
	}

	schoolId, err := service.teacherHomeworkStorage.GetTeacherSchoolId(in.TeacherId)
	if err != nil {
		return nil, err
	}

	studentIds, err := service.teacherHomeworkStorage.GetAllStudentIds(assignedResp.SeedYearIds, assignedResp.StudyGroupIds, assignedResp.ClassIds, schoolId)
	if err != nil {
		return nil, err
	}

	resp := []constant.HomeworkDetailResponse{}
	for _, homeworkDetail := range homeworkDetails {

		avgStar := 0.00
		totalStar, _ := service.teacherHomeworkStorage.GetStarAvgByLevelIdAndHomeworkIdByStudentsIds(in.HomeworkId, helper.Deref(homeworkDetail.LevelId), studentIds)
		if len(studentIds) != 0 {
			avgStar = totalStar / float64(len(studentIds))
		}

		stat, err := service.teacherHomeworkStorage.StudentHomeworkStatGet(in.HomeworkId, helper.Deref(homeworkDetail.LevelId), studentIds)
		if err != nil {
			return nil, err
		}

		resp = append(resp, constant.HomeworkDetailResponse{
			SubLessonId:     homeworkDetail.SubLessonId,
			SubLessonName:   homeworkDetail.SubLessonName,
			LevelId:         homeworkDetail.LevelId,
			LevelIndex:      homeworkDetail.LevelIndex,
			LevelType:       homeworkDetail.LevelType,
			QuestionType:    homeworkDetail.QuestionType,
			LevelDifficulty: homeworkDetail.LevelDifficulty,
			HomeworkDetailStat: constant.HomeworkDetailStat{
				AvgStarCount:             helper.Round(avgStar),
				AvgMaxStarCount:          3,
				StudentDoneHomeworkCount: helper.Deref(stat.DistinctStudentCount),
				TotalStudentCount:        len(studentIds),
				DoneHomeworkCount:        helper.Deref(stat.TotalAttempts),
				AvgTimeUsed:              helper.Deref(stat.AvgTimeUsed),
				AvgCountDoHomework:       helper.Deref(stat.AvgAttemptsPerStudent),
				LatestDoHomeworkDate:     helper.Deref(stat.LastPlayedAt),
			},
		})
	}

	return &HomeworkDetailListOutput{
		HomeworkDetails: resp,
	}, nil
}
