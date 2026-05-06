package service

import (
	"log"
	"net/http"
	"os"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-helper-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type HelperCaseReInitializeDatabaseResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) HelperCaseReInitializeDatabase(context *fiber.Ctx) error {
	err := api.Service.HelperCaseReInitializeDatabase()
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(HelperCaseReInitializeDatabaseResponse{
		StatusCode: http.StatusOK,
		Message:    "Re-Initialized",
	})
}

// ==================== Service ==========================

func (service *serviceStruct) HelperCaseReInitializeDatabase() error {
	env := os.Getenv("ENV")
	if env != constant.TEST {
		msg := "This isn't test environment"
		return helper.NewHttpError(http.StatusConflict, &msg)
	}

	tx, err := service.helperStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	err = service.helperStorage.HelperCaseClearDatabaseData(tx)
	if err != nil {
		return err
	}

	err = service.helperStorage.HelperCaseSeedRole(tx)
	if err != nil {
		return err
	}

	err = service.helperStorage.HelperCaseSeedPlatform(tx)
	if err != nil {
		return err
	}

	err = service.helperStorage.HelperCaseSeedAdmin(tx)
	if err != nil {
		return err
	}

	err = service.helperStorage.HelperCaseSeedSubjectGroup(tx)
	if err != nil {
		return err
	}

	err = service.helperStorage.HelperCaseMockQuestionDemo(tx)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
