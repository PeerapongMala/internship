package service

import (
	"github.com/lib/pq"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LeaderboardListRequest struct {
	constant.LeaderBoardFilter
}

type LeaderboardListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       interface{}        `json:"data"`
	Message    string             `json:"message"`
}

func (api *APIStruct) LeaderBoardList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LeaderboardListRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	leaderboardListOutput, err := api.Service.LeaderBoardList(&LeaderboardListInput{
		LeaderboardListRequest: request,
		StudentId:              subjectId,
		Pagination:             pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(constant.ListResponseTitle{
		StatusCode: fiber.StatusOK,
		Pagination: pagination,
		Data: []interface{}{
			constant.LeaderboardEvent{
				EventTotal: leaderboardListOutput.EventCount,
				EventIds:   leaderboardListOutput.EventIds,
			},
			leaderboardListOutput.EventDetails,
			leaderboardListOutput.Stats,
		},
		Message: "Data retrieved",
	})
}

type LeaderboardListInput struct {
	*LeaderboardListRequest
	StudentId  string
	Pagination *helper.Pagination
}

type LeaderboardListOutput struct {
	EventCount   int
	EventIds     pq.Int64Array
	EventDetails *constant.LeaderBoardTitle
	Stats        []constant.LeaderBoardResponse
}

func (service *serviceStruct) LeaderBoardList(in *LeaderboardListInput) (*LeaderboardListOutput, error) {
	in.Pagination.Limit.Int64 = 10
	in.Pagination.LimitResponse = 10
	eventIds, eventDetails, stats, err := service.arcadeGameStorage.LeaderBoardList(in.StudentId, &in.LeaderBoardFilter, in.Pagination)
	if err != nil {
		return nil, err
	}

	for i, stat := range stats {
		if stat.StudentId == in.StudentId {
			stats[i].MeFlag = true
		}
		if stat.StudentImage != nil {
			url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(*stat.StudentImage)
			if err != nil {
				return nil, err
			}
			stats[i].StudentImage = url
		}
	}

	return &LeaderboardListOutput{
		EventCount:   len(eventIds),
		EventIds:     eventIds,
		EventDetails: eventDetails,
		Stats:        stats,
	}, nil
}
