package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"

	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) LeaderboardCreate(context *fiber.Ctx) error {

	var body constant.LeaderboardCreateRequest

	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.ErrBadRequest.Code,
			Message:    err.Error(),
		})
	}

	err := api.Service.LeaderboardCreate(body)
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Cannot Create Leaderboard",
		})
	}

	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Leaderboard Created",
	})
}
func (service *serviceStruct) LeaderboardCreate(req constant.LeaderboardCreateRequest) error {
	err := service.leaderboardStorage.LeaderboardCreate(req)
	if err != nil {
		log.Printf("Error Get Leaderboard: %v", err)
		return err
	}

	return nil
}
