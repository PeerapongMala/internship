package service

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"

	"github.com/gofiber/fiber/v2"
)

// //////////////////////////// DELETE ANNOUNCE ///////////////////////////////////////////////
func (api *APIStruct) LeaderboardDelete(context *fiber.Ctx) error {
	var body constant.DeleteRequest
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	error := api.Service.LeaderboardDelete(constant.DeleteRequest{
		LeaderboardId: body.LeaderboardId,
	})
	if error != nil {
		if error.Error() == "Leaderboard Id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    error.Error(),
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    error.Error(),
		})
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Leaderboard Deleted",
	})
}

func (service *serviceStruct) LeaderboardDelete(c constant.DeleteRequest) error {
	err := service.leaderboardStorage.LeaderboardDelete(c.LeaderboardId)
	if err != nil {
		if err.Error() == "Leaderboard Id is not exist" {
			return fmt.Errorf("Leaderboard Id is not exist")
		}
		log.Printf("Error delete Leaderboard: %v", err)
		return err
	}

	return nil
}
