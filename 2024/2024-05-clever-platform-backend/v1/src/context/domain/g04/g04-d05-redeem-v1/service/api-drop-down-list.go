package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type DropDownListRequest struct {
	Type string `param:"type"`
}

// ==================== Response =========================
type DropDownListResponse struct {
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) DropDownList(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &DropDownListRequest{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp, err := api.Service.DropDownList(&DropDownListInput{
		Type: request.Type,
	})

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(DropDownListResponse{
		StatusCode: http.StatusOK,
		Data:       resp.DropDownData,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type DropDownListInput struct {
	Type string
}

type DropDownListOutput struct {
	DropDownData interface{}
}

func (service *serviceStruct) DropDownList(in *DropDownListInput) (*DropDownListOutput, error) {

	if in.Type == "avatar" {
		entities, err := service.redeemStorage.GetAvatarList()
		if err != nil {
			return nil, err
		}
		return &DropDownListOutput{
			DropDownData: entities,
		}, nil
	} else if in.Type == "pet" {
		entities, err := service.redeemStorage.GetPetList()
		if err != nil {
			return nil, err
		}
		return &DropDownListOutput{
			DropDownData: entities,
		}, nil
	}

	return nil, errors.New("Invalid type")
}
