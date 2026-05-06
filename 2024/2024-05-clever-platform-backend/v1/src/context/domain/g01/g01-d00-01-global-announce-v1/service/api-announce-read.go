package service

import (
	"database/sql"
	"errors"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
	"github.com/gofiber/fiber/v2"
)

// /////////////////// GET ANNOUNCE ///////////////////////////////////////
func (api *APIStruct) GetAnnounce(context *fiber.Ctx) error {
	response, error := api.Service.GetAnnounce()
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

func (service *serviceStruct) GetAnnounce() ([]constant.AnnounceResponse, error) {
	response, err := service.announceStorage.GetAnnounce()
	if err != nil {
		log.Printf("Error Get announce: %v", err)
		return nil, err
	}

	return response, nil
}

// ////////////////////// TEACHER ANNOUNCE ///////////////////////////////////
func (api *APIStruct) TeacherDailyAnnounce(context *fiber.Ctx) error {
	var body constant.GetDailyAnnounceResquest
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	response, error := api.Service.TeacherDailyAnnounce(constant.GetDailyAnnounceResquest{
		LoginTime: body.LoginTime,
		SchoolId:  body.SchoolId,
	})
	if error != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    error.Error(),
		})
	}
	if len(response) == 0 {
		return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusOK,
			Message:    "No announce from Teacher",
		})
	}

	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Total:      len(response),
		Data:       response,
	})
}
func (service *serviceStruct) TeacherDailyAnnounce(c constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error) {
	response, err := service.announceStorage.TeacherDailyAnnounce(constant.GetDailyAnnounceResquest{
		LoginTime: c.LoginTime,
		SchoolId:  c.SchoolId,
	})
	if err != nil {
		log.Printf("Error Get Teacher announce: %v", err)
	}
	if err == sql.ErrNoRows {
		return nil, errors.New("No Announce From Teacher")
	}

	return response, nil
}

// ////////////////////// SYSTEM ANNOUNCE ////////////////////////////////////////

func (api *APIStruct) SystemDailyAnnounce(context *fiber.Ctx) error {
	var body constant.GetDailyAnnounceResquest
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	response, error := api.Service.SystemDailyAnnounce(constant.GetDailyAnnounceResquest{
		LoginTime: body.LoginTime,
		SchoolId:  body.SchoolId,
	})
	if error != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    error.Error(),
		})
	}
	if len(response) == 0 {
		return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusOK,
			Message:    "No announce from system",
		})
	}

	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Total:      len(response),
		Data:       response,
	})
}
func (service *serviceStruct) SystemDailyAnnounce(c constant.GetDailyAnnounceResquest) ([]constant.DailyAnnounceResponse, error) {
	response, err := service.announceStorage.SystemDailyAnnounce(constant.GetDailyAnnounceResquest{
		LoginTime: c.LoginTime,
		SchoolId:  c.SchoolId,
	})
	if err != nil {
		log.Printf("Error Get System announce: %v", err)
	}
	if err == sql.ErrNoRows {
		return nil, errors.New("No Announce From System")
	}

	return response, nil
}
