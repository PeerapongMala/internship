package service

import (
	"log"
	"net/http"

	cloudStorageConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d03-cloud-storage-v1/constant"
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/valyala/fasthttp"
)

func (api *APIStruct) AddRewardAnnounce(context *fiber.Ctx) error {
	var body constant.CreateRewardAnnounceRequestService
	if err := context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request1234",
		})
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	roles, ok := context.Locals("roles").([]int)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	RolesCheck := constant.CheckRoleRequest{
		Roles:     roles,
		SubjectId: subjectId,
	}
	ImageFile, err := context.FormFile("announcement_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	body.ImageFile = ImageFile
	err = api.Service.AddRewardAnnounce(body, RolesCheck)
	if err != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Something went wrong try again",
		})
	}
	return context.Status(fiber.StatusCreated).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusCreated,
		Message:    "Announcement Created",
	})

}

func (service *serviceStruct) AddRewardAnnounce(c constant.CreateRewardAnnounceRequestService, Role constant.CheckRoleRequest) error {
	var key *string
	if c.ImageFile != nil {
		imageKey := uuid.NewString()
		key = &imageKey
		c.Image = key
	}

	if c.ImageFile != nil {
		err := service.cloudStorage.ObjectCreate(c.ImageFile, *key, cloudStorageConstant.Image)
		if err != nil {
			return err
		}
	}
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) {
			c.AdminLoginAs = &Role.SubjectId
			break
		}
	}
	c.CreatedBy = Role.SubjectId
	id, err := service.GmannounceStorage.AddRewardAnnounce(constant.CreateRewardAnnounceRequest{
		SchoolId:     c.SchoolId,
		Scope:        c.Scope,
		Type:         c.Type,
		StartAt:      c.StartAt,
		EndAt:        c.EndAt,
		Title:        c.Title,
		Description:  c.Description,
		Image:        c.Image,
		Status:       c.Status,
		CreatedBy:    c.CreatedBy,
		AcademicYear: c.AcademicYear,
		SubjectId:    c.SubjectId,
		AdminLoginAs: c.AdminLoginAs,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	for _, v := range c.Items {
		if v.ItemId != 0 {
			err = service.GmannounceStorage.AddRewardItem(constant.AddRewardItemRequest{
				ItemId:           v.ItemId,
				AnnounceRewardId: id,
				Amount:           v.Amount,
				ExpiredAt:        v.ExpiredAt,
			})
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}

	}
	if c.GoldCoin != nil || c.ArcadeCoin != nil || c.Ice != nil {
		err = service.GmannounceStorage.AddRewardCoinItem(constant.AddRewardCoinRequest{
			AnnnouncementId: id,
			GoldCoin:        c.GoldCoin,
			ArcadeCoin:      c.ArcadeCoin,
			Ice:             c.Ice,
		})
	}

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
