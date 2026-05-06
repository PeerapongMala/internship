package service

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
	"github.com/gofiber/fiber/v2"
)

// //////////////////////////// DELETE ANNOUNCE ///////////////////////////////////////////////
func (api *APIStruct) DeleteAnnounce(context *fiber.Ctx) error {
	var body constant.DeleteRequest
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	error := api.Service.DeleteAnnounce(constant.DeleteRequest{
		AnnounceId: body.AnnounceId,
	})
	if error != nil {
		if error.Error() == "Announce Id is not exist" {
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
		Message:    "Announce Deleted",
	})
}

func (service *serviceStruct) DeleteAnnounce(c constant.DeleteRequest) error {
	err := service.announceStorage.DeleteAnnounce(c.AnnounceId)
	if err != nil {
		if err.Error() == "Announce Id is not exist" {
			return fmt.Errorf("Announce Id is not exist")
		}
		log.Printf("Error delete announce: %v", err)
		return err
	}

	return nil
}
