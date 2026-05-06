package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================
type HomeworkAssignToTargetListRequest struct {
	SchoolId  int `params:"schoolId"`
	SubjectId string
}

// ==================== Response ==========================

type HomeworkAssignToTargetListResponse struct {
	StatusCode int                                      `json:"status_code"`
	Data       []constant.GetAssignToTargetListResponse `json:"data"`
	Message    string                                   `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) HomeworkAssignToTargetList(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &HomeworkAssignToTargetListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	teacherId := context.Locals("subjectId").(string)

	request.SubjectId = teacherId
	resp, err := api.Service.HomeworkAssignToTargetList(&HomeworkAssignToTargetListInput{request})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeworkAssignToTargetListResponse{
		StatusCode: http.StatusOK,
		Data:       resp.HomeworkAssignToTargets,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type HomeworkAssignToTargetListInput struct {
	*HomeworkAssignToTargetListRequest
}

type HomeworkAssignToTargetListOutput struct {
	HomeworkAssignToTargets []constant.GetAssignToTargetListResponse
}

func (service *serviceStruct) HomeworkAssignToTargetList(in *HomeworkAssignToTargetListInput) (*HomeworkAssignToTargetListOutput, error) {
	subjectId, err := service.teacherHomeworkStorage.TeacherSubjectGet(in.SubjectId)
	if err != nil {
		return nil, err
	}

	assignedToData, err := service.teacherHomeworkStorage.GetAssignToDataBySchoolId(in.SchoolId, in.SubjectId, subjectId)
	if err != nil {
		return nil, err
	}

	resp := ConvertAssignToDataEntityToResponse(assignedToData)

	return &HomeworkAssignToTargetListOutput{
		HomeworkAssignToTargets: resp,
	}, nil
}

func ConvertAssignToDataEntityToResponse(assignments []constant.AssignToDataEntity) []constant.GetAssignToTargetListResponse {

	result := []constant.GetAssignToTargetListResponse{}
	for _, assignment := range assignments {
		if !containsSeedYearId(result, assignment.SeedYearId) {
			result = append(result, constant.GetAssignToTargetListResponse{
				SeedYearId:        assignment.SeedYearId,
				SeedYearShortName: assignment.SeedYearShortName,
				Class:             []constant.ClassResponse{},
			})
		}

		if assignment.ClassId != nil {
			for i := range result {
				if !containsClassId(result[i].Class, assignment.ClassId) && helper.Deref(result[i].SeedYearId) == helper.Deref(assignment.SeedYearId) {
					result[i].Class = append(result[i].Class, constant.ClassResponse{
						ClassId:    assignment.ClassId,
						ClassName:  assignment.ClassName,
						StudyGroup: []constant.StudyGroupResponse{},
					})
					break
				}
			}
		}

		if assignment.StudyGroupId != nil {
			for i := range result {
				for j := range result[i].Class {
					if helper.Deref(result[i].Class[j].ClassId) == helper.Deref(assignment.ClassId) {
						result[i].Class[j].StudyGroup = append(result[i].Class[j].StudyGroup, constant.StudyGroupResponse{
							StudyGroupId:   assignment.StudyGroupId,
							StudyGroupName: assignment.StudyGroupName,
						})
						break
					}
				}
			}
		}
	}

	return result
}

func containsSeedYearId(result []constant.GetAssignToTargetListResponse, seedYearId *int) bool {
	return slices.ContainsFunc(result, func(r constant.GetAssignToTargetListResponse) bool {
		return helper.Deref(r.SeedYearId) == helper.Deref(seedYearId)
	})
}

func containsClassId(result []constant.ClassResponse, classId *int) bool {
	return slices.ContainsFunc(result, func(r constant.ClassResponse) bool {
		return helper.Deref(r.ClassId) == helper.Deref(classId)
	})
}
