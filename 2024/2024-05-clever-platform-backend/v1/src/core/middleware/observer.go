package middleware

import (
	"net/http"
	"slices"

	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	storageRepository "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/storage/storage-repository"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type ObserverMiddleware struct {
	ObserverMiddlewareStorage storageRepository.Repository
}

func ObserverMiddlewareNew(observerMiddlewareStorageInstance storageRepository.Repository) *ObserverMiddleware {
	return &ObserverMiddleware{
		ObserverMiddlewareStorage: observerMiddlewareStorageInstance,
	}
}

func (observerMiddleware *ObserverMiddleware) GetReportAccess() fiber.Handler {
	return func(context *fiber.Ctx) error {
		reportAccessEntity := observerConstant.ReportAccess{}
		context.Locals("reportAccess", &reportAccessEntity)

		roles := context.Locals("roles").([]int)
		if !slices.Contains(roles, int(constant.Admin)) && !slices.Contains(roles, int(constant.Observer)) {
			return context.Next()
		}

		subjectId, ok := context.Locals("subjectId").(string)
		if !ok {
			return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
		}

		err := observerMiddleware.ObserverMiddlewareStorage.ReportAccessGet(subjectId, &reportAccessEntity)
		if err != nil {
			return err
		}

		for _, districtZone := range reportAccessEntity.DistrictZones {
			for _, district := range observerConstant.Districts[districtZone] {
				if !slices.Contains(reportAccessEntity.Districts, district) {
					reportAccessEntity.Districts = append(reportAccessEntity.Districts, district)
				}
			}
		}

		if slices.Contains(roles, int(constant.Admin)) || slices.Contains(reportAccessEntity.AccessNames, observerConstant.MinistryExecutive) {
			reportAccessEntity.CanAccessAll = true
		}

		return context.Next()
	}
}
