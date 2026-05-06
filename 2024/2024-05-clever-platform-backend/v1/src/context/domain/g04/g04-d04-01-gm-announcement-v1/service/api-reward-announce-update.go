package service

import (
	"fmt"
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

func (api *APIStruct) UpdateRewardAnnounce(context *fiber.Ctx) error {
	var body constant.UpdateRewardAnnounceRequestService
	announceId, err := context.ParamsInt("announceId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(fiber.StatusBadRequest, nil))
	}
	if err = context.BodyParser(&body); err != nil {
		return context.Status(fiber.StatusBadRequest).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusBadRequest,
			Message:    "bad request",
		})
	}
	ImageFile, err := context.FormFile("announcement_image")
	if err != nil && err != fasthttp.ErrMissingFile {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
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
	body.ImageFile = ImageFile
	body.Id = announceId
	err = api.Service.UpdateRewardAnnounce(body, RolesCheck)
	if err != nil {
		if err.Error() == "Announce id is not Exist" {
			return context.Status(fiber.StatusNotFound).JSON(constant.StatusResponse{
				StatusCode: fiber.StatusNotFound,
				Message:    "Announcement Id is not exist",
			})
		}
		return context.Status(fiber.StatusInternalServerError).JSON(constant.StatusResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Something went wrong try again",
		})
	}
	return context.Status(fiber.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcement Updated",
	})
}
func (service *serviceStruct) UpdateRewardAnnounce(c constant.UpdateRewardAnnounceRequestService, Role constant.CheckRoleRequest) error {
	response, err := service.GmannounceStorage.GetRewardAnnounceById(c.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	var key *string
	if c.ImageFile != nil {
		imageKey := uuid.NewString()
		key = &imageKey
		c.Image = key
	}

	if c.ImageFile != nil && response.ImageUrl != nil {
		err := service.cloudStorage.ObjectDelete(*response.ImageUrl)
		if err != nil {
			return nil
		}
	}

	if key != nil {
		err := service.cloudStorage.ObjectCreate(c.ImageFile, *key, cloudStorageConstant.Image)
		if err != nil {
			return nil
		}
	}
	for _, role := range Role.Roles {
		if role == int(userConstant.Admin) {
			c.AdminLoginAs = &Role.SubjectId
			break
		}
	}
	c.UpdatedBy = Role.SubjectId
	err = service.GmannounceStorage.UpdateRewardAnnounce(constant.UpdateRewardAnnounceRequest{
		Id:           c.Id,
		SchoolId:     c.SchoolId,
		Scope:        c.Scope,
		Type:         c.Type,
		StartAt:      c.StartAt,
		EndAt:        c.EndAt,
		Title:        c.Title,
		Description:  c.Description,
		Image:        c.Image,
		Status:       c.Status,
		UpdatedBy:    c.UpdatedBy,
		AcademicYear: c.AcademicYear,
		SubjectId:    c.SubjectId,
		AdminLoginAs: c.AdminLoginAs,
	})
	if err != nil {
		if err.Error() == "Announce id is not Exist" {
			return fmt.Errorf("Announce id is not Exist")
		}
		log.Printf("%+v", errors.WithStack(err))
		return err

	}
	ItemsInfo, err := service.GmannounceStorage.AnnouncementItemList(c.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	existItem := make(map[int]constant.ItemList)
	for _, item := range ItemsInfo {
		existItem[item.ItemId] = item
	}

	for _, newItem := range c.ItemList {
		if _, found := existItem[newItem.ItemId]; found {
			err := service.GmannounceStorage.UpdateRewardItem(constant.UpdateRewardItemRequest{
				ItemId:           newItem.ItemId,
				AnnounceRewardId: c.Id,
				Amount:           newItem.Amount,
				ExpiredAt:        newItem.ExpiredAt,
			})
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			delete(existItem, newItem.ItemId)
		} else if newItem.ItemId != 0 {
			err := service.GmannounceStorage.AddRewardItem(constant.AddRewardItemRequest{
				ItemId:           newItem.ItemId,
				AnnounceRewardId: c.Id,
				Amount:           newItem.Amount,
				ExpiredAt:        newItem.ExpiredAt,
			})
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}

	}
	exist, err := service.GmannounceStorage.CheckCoinExist(c.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	//if c.GoldCoin == nil && c.ArcadeCoin == nil && c.Ice == nil {
	//	err = service.GmannounceStorage.DeleteCoinReward(c.Id)
	//	if err != nil {
	//		log.Printf("%+v", errors.WithStack(err))
	//		return err
	//	}
	//}
	if exist {
		err = service.GmannounceStorage.UpdateRewardCoinItem(constant.UpdateRewardCoinRequest{
			AnnnouncementId: c.Id,
			GoldCoin:        c.GoldCoin,
			ArcadeCoin:      c.ArcadeCoin,
			Ice:             c.Ice,
		})
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	} else if !exist && c.ArcadeCoin != nil || c.GoldCoin != nil || c.Ice != nil {
		err = service.GmannounceStorage.AddRewardCoinItem(constant.AddRewardCoinRequest{
			AnnnouncementId: c.Id,
			GoldCoin:        c.GoldCoin,
			ArcadeCoin:      c.ArcadeCoin,
			Ice:             c.Ice,
		})
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
