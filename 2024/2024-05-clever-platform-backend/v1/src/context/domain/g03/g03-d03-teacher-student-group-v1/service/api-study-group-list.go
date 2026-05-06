package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type studyGroupListResponse struct {
	helper.PaginationResponse
	helper.BaseResponse
	StudyGroups []constant.StudyGroupList `json:"data"`
}

func (api *APIStruct) StudyGroupLists(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &constant.StudyGroupListReq{}, helper.ParseOptions{Query: true})
	if err != nil {
		return err
	}

	pagination := helper.PaginationNew(context)

	studyGroups, err := api.Service.StudyGroupLists(constant.StudyGroupListFilter{
		Pagination:        pagination,
		StudyGroupListReq: *request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(studyGroupListResponse{
		helper.NewPaginationResponse(pagination),
		helper.BaseResponse{
			StatusCode: fiber.StatusOK,
			Message:    "success",
		},
		studyGroups,
	})
}

func (service *serviceStruct) StudyGroupLists(filter constant.StudyGroupListFilter) ([]constant.StudyGroupList, error) {

	studyGroups, err := service.repository.StudyGroupList(filter)
	if err != nil {
		msg := err.Error()
		return []constant.StudyGroupList{}, helper.NewHttpErrorWithDetail(fiber.StatusInternalServerError, &msg, err)
	}

	return studyGroups, nil
}
