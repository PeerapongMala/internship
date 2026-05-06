package service

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-leaderboard-v1/constant"

	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) LeaderboardUpdate(context *fiber.Ctx) error {
	var body constant.LeaderboardUpdateRequest
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}

	err := api.Service.LeaderboardUpdate(constant.LeaderboardUpdateRequest{
		Id:        body.Id,
		UserName:  body.UserName,
		PassWord:  body.PassWord,
		FirstName: body.FirstName,
		LastName:  body.LastName,
		Score:     body.Score,
		StartDate: body.StartDate,
		EndDate:   body.EndDate,
	})
	if err != nil {
		if err.Error() == "Leaderboard Id is not exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    err.Error(),
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Leaderboard updated",
	})
}
func (service *serviceStruct) LeaderboardUpdate(c constant.LeaderboardUpdateRequest) error {
	err := service.leaderboardStorage.LeaderboardUpdate(constant.LeaderboardUpdateRequest{
		Id:        c.Id,
		UserName:  c.UserName,
		PassWord:  c.PassWord,
		FirstName: c.FirstName,
		LastName:  c.LastName,
		Score:     c.Score,
		StartDate: c.StartDate,
		EndDate:   c.EndDate,
	})

	if err != nil {
		if err.Error() == "Leaderboard Id is not exist" {
			return fmt.Errorf("Leaderboard Id is not exist")
		}
		log.Printf("Error update Leaderboard: %v", err)
		return err
	}

	return nil
}
