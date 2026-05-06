package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"

	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) LeaderboardGet(context *fiber.Ctx) error {
	response, error := api.Service.LeaderboardGet()
	if error != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    error.Error(),
		})
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Total:      len(response),
		Data:       response,
	})
}

func (service *serviceStruct) LeaderboardGet() ([]constant.LeaderboardGetResponse, error) {
	response, err := service.leaderboardStorage.LeaderboardGet()
	if err != nil {
		log.Printf("Error Get Leaderboard: %v", err)
		return nil, err
	}

	return response, nil
}
