package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"net/http"
	"slices"
)

type CheckLevelStatusInput struct {
	LevelId int
}

func (service *serviceStruct) CheckLevelStatus(in *CheckLevelStatusInput) error {
	status, err := service.gamificationStorage.LevelCaseGetStatus(in.LevelId)
	if err != nil {
		return err
	}

	if slices.Contains([]string{constant.Enabled, constant.Disabled}, *status) {
		msg := fmt.Sprintf(` Cannot edit level ID: %d (status = %s)`, in.LevelId, *status)
		return helper.NewHttpError(http.StatusBadRequest, &msg)
	}

	return nil
}
