package service

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
	"github.com/gofiber/fiber/v2"
)

///////////////////////  CREATE ANNOUNCE //////////////////////////////

func (api *APIStruct) CreateAnnounce(context *fiber.Ctx) error {

	var body constant.CreateAnnounceRequest

	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.ErrBadRequest.Code,
			Message:    err.Error(),
		})
	}

	err := api.Service.CreateAnnounce(body)
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Cannot Create Announce",
		})
	}

	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Announce Created",
	})
}

func (service *serviceStruct) CreateAnnounce(req constant.CreateAnnounceRequest) error {
	err := service.announceStorage.CreateAnnounce(req)
	if err != nil {
		log.Printf("Error creating announcement: %v", err)
		return err
	}

	return nil
}
