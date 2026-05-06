package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
	"log"
	"net/http"
	"time"
)

type TeacherShopUpdateRequest struct {
	StoreItemId int `params:"storeItemId" validate:"required"`
	*constant.ShopItemRequest
}

type TeacherShopUpdateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

func (api *APIStruct) TeacherShopUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &TeacherShopUpdateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId := context.Locals("subjectId").(string)

	image, err := context.FormFile("image")
	if err != nil && err != fasthttp.ErrMissingFile {
		return helper.RespondHttpError(context, err)
	}
	request.Image = image

	err = api.Service.TeacherShopUpdate(&TeacherShopUpdateInput{
		TeacherShopUpdateRequest: request,
		SubjectId:                subjectId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(TeacherShopUpdateResponse{
		StatusCode: http.StatusOK,
		Message:    "Updated",
	})
}

type TeacherShopUpdateInput struct {
	*TeacherShopUpdateRequest
	SubjectId string
}

func (service *serviceStruct) TeacherShopUpdate(in *TeacherShopUpdateInput) (err error) {
	tx, err := service.TeacherShopStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	shopItem, err := service.TeacherShopStorage.TeacherShopItemGet(in.StoreItemId)
	if err != nil {
		return err
	}

	in.InitialStock = in.Stock
	if in.OpenDate == nil {
		now := time.Now().UTC()
		in.OpenDate = &now
	}

	keyToAdd, keyToDelete := "", ""
	if in.Image != nil {
		keyToAdd = uuid.NewString()
		if shopItem.ImageKey != nil {
			keyToDelete = *shopItem.ImageKey
		}
		in.ImageKey = &keyToAdd
	}

	err = service.TeacherShopStorage.TeacherShopUpdate(tx, in.StoreItemId, shopItem.ItemId, *in.ShopItemRequest)
	if err != nil {
		return err
	}

	if keyToAdd != "" {
		err = service.cloudStorage.ObjectCreate(in.Image, keyToAdd, constant2.Image)
		if err != nil {
			return err
		}
	}

	if keyToDelete != "" {
		err = service.cloudStorage.ObjectDelete(keyToDelete)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
