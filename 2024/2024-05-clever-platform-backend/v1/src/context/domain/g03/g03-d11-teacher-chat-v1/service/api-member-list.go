package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

type MemberListRequest struct {
	RoomType     string `query:"room_type" validate:"required"`
	RoomId       int    `params:"roomId" validate:"required"`
	SchoolId     int    `query:"school_id"`
	AcademicYear int    `query:"academic_year"`
	SearchText   string `query:"search_text"`
}

type MemberListResponse struct {
	Pagination *helper.Pagination `json:"_pagination"`
	StatusCode int                `json:"status_code"`
	Data       []constant.Member  `json:"data"`
	Message    string             `json:"message"`
}

func (api *APIStruct) MemberList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	request, err := helper.ParseAndValidateRequest(context, &MemberListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	memberListOutput, err := api.Service.MemberList(&MemberListInput{
		MemberListRequest: request,
		Pagination:        pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(MemberListResponse{
		Pagination: pagination,
		StatusCode: http.StatusOK,
		Data:       memberListOutput.Members,
		Message:    "Data retrieved",
	})
}

type MemberListInput struct {
	*MemberListRequest
	Pagination *helper.Pagination
}

type MemberListOutput struct {
	Members []constant.Member
}

func (service *serviceStruct) MemberList(in *MemberListInput) (*MemberListOutput, error) {
	members := []constant.Member{}
	switch in.RoomType {
	case "class":
		students, err := service.teacherChatStorage.ClassListStudent(in.RoomId, in.AcademicYear, in.SearchText, in.Pagination)
		if err != nil {
			return nil, err
		}
		members = students
	case "group":
		students, err := service.teacherChatStorage.GroupListStudent(in.RoomId, in.AcademicYear, in.SearchText, in.Pagination)
		if err != nil {
			return nil, err
		}
		members = students
	case "subject":
		students, err := service.teacherChatStorage.SubjectListStudent(in.RoomId, in.AcademicYear, in.SchoolId, in.SearchText, in.Pagination)
		if err != nil {
			return nil, err
		}
		members = students
	}

	for i, member := range members {
		if member.ImageUrl != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*member.ImageUrl)
			if err != nil {
				return nil, err
			}
			members[i].ImageUrl = url
		}
	}

	return &MemberListOutput{
		Members: members,
	}, nil
}
