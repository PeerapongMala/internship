package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

func (api *APIStruct) RewardReadReceivedAll(context *fiber.Ctx) error {
	SubjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	err = api.Service.RewardReadReceivedAll(subjectId, SubjectId)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	return context.Status(http.StatusOK).JSON(constant.StatusResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Announcements Read",
	})
}
func (service *serviceStruct) RewardReadReceivedAll(userId string, subjectId int) error {
	schoolId, err := service.mailBoxStorage.GetSchoolByStudentId(userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	req := constant.AnnouncementListRequest{
		UserId:    userId,
		SchoolId:  schoolId,
		SubjectId: subjectId,
	}
	pagination := helper.PaginationDefault()
	AnnouncementList, _, err := service.mailBoxStorage.RewardAnnounceList(req, pagination)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err

	}
	inventoryId, err := service.mailBoxStorage.GetinventoryId(userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	for _, announcement := range AnnouncementList {
		received, err := service.mailBoxStorage.CheckItemReceived(announcement.AnnouncementId, userId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if received {
			continue
		}

		itemexist, err := service.mailBoxStorage.CheckItemExist(announcement.AnnouncementId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		itemInfo := []constant.ItemInfo{}
		if itemexist {
			itemInfo, err = service.mailBoxStorage.GetItemInfoByAnnouncementId(announcement.AnnouncementId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			if len(itemInfo) != 0 {
				for _, v := range itemInfo {
					ItemRequest := constant.ItemReceivedRequest{
						ItemId:      v.ItemId,
						Amount:      v.Amount,
						InventoryId: inventoryId,
					}
					exist, err := service.mailBoxStorage.CheckItemInventoryExist(inventoryId, v.ItemId)
					if err != nil {
						log.Printf("%+v", errors.WithStack(err))
						return err
					}
					if exist {
						itemAmount, err := service.mailBoxStorage.GetInventoryItemAmountById(inventoryId, v.ItemId)
						if err != nil {
							log.Printf("%+v", errors.WithStack(err))
							return err
						}
						totalAmount := v.Amount + itemAmount
						err = service.mailBoxStorage.UpdateUserItemAmount(inventoryId, totalAmount, v.ItemId)
						if err != nil {
							log.Printf("%+v", errors.WithStack(err))
							return err
						}
					} else {
						err = service.mailBoxStorage.ItemReceived(ItemRequest)
						if err != nil {
							log.Printf("%+v", errors.WithStack(err))
							return err
						}
					}

					req := constant.RewardLogRequest{
						UserId:     userId,
						ItemId:     &v.ItemId,
						ItemAmount: &v.Amount,
					}
					err = service.mailBoxStorage.RewardLogCreate(req)
					if err != nil {
						log.Printf("%+v", errors.WithStack(err))
						return err
					}
				}
			}

		}
		exist, err := service.mailBoxStorage.CheckCoinExist(announcement.AnnouncementId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		if exist {
			CoinInfo, err := service.mailBoxStorage.GetCoinInfoByAnnouncementId(announcement.AnnouncementId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			UserCoin, err := service.mailBoxStorage.GetUserCoin(userId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			var TotalGoldCoin, TotalArcadeCoin, TotalIce int

			if CoinInfo.GoldCoin != nil && UserCoin.GoldCoin != nil {
				TotalGoldCoin = *CoinInfo.GoldCoin + *UserCoin.GoldCoin
			} else if CoinInfo.GoldCoin != nil {
				TotalGoldCoin = *CoinInfo.GoldCoin
			} else if UserCoin.GoldCoin != nil {
				TotalGoldCoin = *UserCoin.GoldCoin
			}

			if CoinInfo.ArcadeCoin != nil && UserCoin.ArcadeCoin != nil {
				TotalArcadeCoin = *CoinInfo.ArcadeCoin + *UserCoin.ArcadeCoin
			} else if CoinInfo.ArcadeCoin != nil {
				TotalArcadeCoin = *CoinInfo.ArcadeCoin
			} else if UserCoin.ArcadeCoin != nil {
				TotalArcadeCoin = *UserCoin.ArcadeCoin
			}

			if CoinInfo.Ice != nil && UserCoin.Ice != nil {
				TotalIce = *CoinInfo.Ice + *UserCoin.Ice
			} else if CoinInfo.Ice != nil {
				TotalIce = *CoinInfo.Ice
			} else if UserCoin.Ice != nil {
				TotalIce = *UserCoin.Ice
			}

			req := constant.CoinInfo{
				GoldCoin:   &TotalGoldCoin,
				ArcadeCoin: &TotalArcadeCoin,
				Ice:        &TotalIce,
			}
			err = service.mailBoxStorage.UserInventoryUpdate(userId, req)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			LogReq := constant.RewardLogRequest{
				UserId:           userId,
				GoldCoinAmount:   CoinInfo.GoldCoin,
				ArcadeCoinAmount: CoinInfo.ArcadeCoin,
				IceAmount:        CoinInfo.Ice,
			}
			err = service.mailBoxStorage.RewardLogCreate(LogReq)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}

		}

		read, err := service.mailBoxStorage.CheckRead(announcement.AnnouncementId, userId)
		if err != nil {
			return err
		}

		if !read && !received {
			err = service.mailBoxStorage.AnnouncementRead(constant.AnnouncementReadRequest{
				UserId:         userId,
				AnnouncementId: announcement.AnnouncementId,
			})
			if err != nil {
				return err
			}
			err = service.mailBoxStorage.UserAnnouncementReceived(announcement.AnnouncementId, userId)
			if err != nil {
				return err
			}
		} else if read && !received {
			err = service.mailBoxStorage.UserAnnouncementReceived(announcement.AnnouncementId, userId)
			if err != nil {
				return err
			}
		}

	}
	return nil
}
