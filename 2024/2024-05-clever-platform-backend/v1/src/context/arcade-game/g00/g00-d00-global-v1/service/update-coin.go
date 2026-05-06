package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (service *serviceStruct) UpdateCoin(ArcadeGameId int, userId string) error {
	arcadeCost, err := service.ArcadeGameStorage.GetArcadeCoinCost(ArcadeGameId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	userCoin, err := service.ArcadeGameStorage.GetStudentArcadeCoinById(userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if userCoin < arcadeCost {
		msg := "Insufficient coin"
		return helper.NewHttpError(http.StatusInsufficientStorage, &msg)
	}

	totalCoin := userCoin - arcadeCost
	err = service.ArcadeGameStorage.UpdateStudentCoin(userId, totalCoin)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
