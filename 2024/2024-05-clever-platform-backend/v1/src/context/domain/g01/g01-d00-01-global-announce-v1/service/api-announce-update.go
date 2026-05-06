package service

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) UpdateAnnounce(context *fiber.Ctx) error {
	var body constant.UpdateAnnounceRequest
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}

	err := api.Service.UpdateAnnounce(constant.UpdateAnnounceRequest{
		Id:          body.Id,
		SchoolId:    body.SchoolId,
		Scope:       body.Scope,
		Type:        body.Type,
		StartAt:     body.StartAt,
		EndAt:       body.EndAt,
		Title:       body.Title,
		Description: body.Description,
		Image:       body.Image,
		Status:      body.Status,
		UpdatedAt:   body.UpdatedAt,
		UpdatedBy:   body.UpdatedBy,
	})
	if err != nil {
		if err.Error() == "Announce Id is not exist" {
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
		Message:    "Announcement updated",
	})
}
func (service *serviceStruct) UpdateAnnounce(c constant.UpdateAnnounceRequest) error {
	err := service.announceStorage.UpdateAnnounce(constant.UpdateAnnounceRequest{
		Id:          c.Id,
		SchoolId:    c.SchoolId,
		Scope:       c.Scope,
		Type:        c.Type,
		StartAt:     c.StartAt,
		EndAt:       c.EndAt,
		Title:       c.Title,
		Description: c.Description,
		Image:       c.Image,
		Status:      c.Status,
		UpdatedAt:   c.UpdatedAt,
		UpdatedBy:   c.UpdatedBy,
	})

	if err != nil {
		if err.Error() == "Announce Id is not exist" {
			return fmt.Errorf("Announce Id is not exist")
		}
		log.Printf("Error update announce: %v", err)
		return err
	}

	return nil
}
