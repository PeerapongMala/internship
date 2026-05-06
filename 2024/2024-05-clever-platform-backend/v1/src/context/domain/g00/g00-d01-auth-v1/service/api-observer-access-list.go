package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================

type ObserverAccessListResponse struct {
	StatusCode int                                         `json:"status_code"`
	Pagination *helper.Pagination                          `json:"_pagination"`
	Data       []constant2.ObserverAccessWithSchoolsEntity `json:"data"`
	Message    string                                      `json:"message"`
}

// ==================== Endpoint ==========================

// @Id ObserverAccessList
// @Tags Auth
// @Summary List observer access
// @Description List observer access
// @Security BearerAuth
// @Produce json
// @Param page query int false "page number"
// @Param limit query int false "limit of items per page"
// @Param access_name query string false "access name"
// @Success 200 {object} ObserverAccessListResponse
// @Failure 400 {object} helper.HttpErrorResponse
// @Failure 401 {object} helper.HttpErrorResponse
// @Failure 403 {object} helper.HttpErrorResponse
// @Failure 409 {object} helper.HttpErrorResponse
// @Failure 500 {object} helper.HttpErrorResponse
// @Router /auth/v1/observer-access [get]
func (api *APIStruct) ObserverAccessList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)
	filter := constant2.ObserverAccessFilter{}
	err := context.QueryParser(&filter)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	observerAccessList, err := api.Service.ObserverAccessList(&ObserverAccessListInput{
		Pagination: pagination,
		Filter:     &filter,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ObserverAccessListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       observerAccessList.List,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ObserverAccessListInput struct {
	Filter     *constant2.ObserverAccessFilter
	Pagination *helper.Pagination
}

type ObserverAccessListOutput struct {
	List []constant2.ObserverAccessWithSchoolsEntity
}

func (service *serviceStruct) ObserverAccessList(in *ObserverAccessListInput) (*ObserverAccessListOutput, error) {
	observerAccessList, err := service.authStorage.ObserverAccessList(in.Filter, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &ObserverAccessListOutput{List: observerAccessList}, nil
}
