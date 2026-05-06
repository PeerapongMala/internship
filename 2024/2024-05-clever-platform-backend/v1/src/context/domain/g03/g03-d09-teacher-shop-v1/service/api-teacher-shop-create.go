package service

import (
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
	"log"
	"time"

	rewardConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) TeacherShopCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.ShopItemRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	image, err := context.FormFile("image")
	if err != nil && err != fasthttp.ErrMissingFile {
		return helper.RespondHttpError(context, err)
	}
	request.Image = image

	adminId := context.Locals("subjectId").(string)
	request.CreatedBy = &adminId
	response, err := api.Service.TeacherShopCreate(*request, adminId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusCreated).JSON(TeacherShopResponse[constant.ShopItemEntity]{
		Data:       *response,
		Message:    "success",
		StatusCode: fiber.StatusCreated,
	})
}

func (service *serviceStruct) TeacherShopCreate(c constant.ShopItemRequest, teacherId string) (r *constant.ShopItemEntity, err error) {
	tx, err := service.TeacherShopStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var key *string
	isNew := false
	if c.Image != nil {
		tmp := uuid.NewString()
		key = &tmp
		isNew = true
	} else {
		key = c.ImageKey
	}

	itemId, err := service.TeacherShopStorage.ItemCreate(tx, rewardConstant.ItemEntity{
		Type:        "coupon",
		Name:        c.Name,
		Description: c.Description,
		ImageUrl:    key,
		Status:      "enabled",
		CreatedAt:   time.Now().UTC(),
		CreatedBy:   teacherId,
	})
	if err != nil {
		return nil, err
	}

	if c.OpenDate == nil {
		now := time.Now().UTC()
		c.OpenDate = &now
	}

	c.ItemId = itemId
	item, err := service.TeacherShopStorage.TeacherShopCreate(tx, c, teacherId)
	if err != nil {
		return nil, err
	}

	for _, classId := range c.ClassIds {
		err = service.TeacherShopStorage.ClassTeacherShopCreate(tx, item.Id, classId)
		if err != nil {
			return nil, err
		}
	}

	for _, studyGroupId := range c.StudyGroupIds {
		err = service.TeacherShopStorage.StudyGroupTeacherShopCreate(tx, item.Id, studyGroupId)
		if err != nil {
			return nil, err
		}
	}

	for _, studentId := range c.StudentIds {
		err = service.TeacherShopStorage.StudentTeacherShopCreate(tx, item.Id, studentId)
		if err != nil {
			return nil, err
		}
	}

	if key != nil && isNew {
		err = service.cloudStorage.ObjectCreate(c.Image, *key, constant2.Image)
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return item, nil
}
