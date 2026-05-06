package service

import (
	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"net/http"
	"slices"
)

// ==================== Service ==========================

type CheckContentCreatorInput struct {
	SubjectId         string
	Roles             []int
	CurriculumGroupId int
}

func (service *serviceStruct) CheckContentCreator(in *CheckContentCreatorInput) error {
	contentCreators, err := service.academicLevelStorage.CurriculumGroupCaseListContentCreator(in.CurriculumGroupId)
	if err != nil {
		return err
	}
	if !slices.Contains(in.Roles, int(userConstant.Admin)) {
		isValid := false
		for _, contentCreator := range contentCreators {
			if contentCreator.Id == in.SubjectId {
				isValid = true
				break
			}
		}
		if !isValid || len(contentCreators) == 0 {
			msg := "User isn't content creator of this curriculum group"
			return helper.NewHttpError(http.StatusForbidden, &msg)
		}
	}

	return nil
}
