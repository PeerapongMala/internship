package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d06-bug-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
func (api *APIStruct) BugGet(context *fiber.Ctx) error {
	bugIDStr := context.Params("bug_id")
	bugID, err := strconv.Atoi(bugIDStr)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &errMsg))
	}

	data, err := api.Service.BugGet(bugID)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}

	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       data,
		Message:    "Data retrieved",
	})
}

func (service *serviceStruct) BugGet(bugID int) (*constant.Bug, error) {
	bug, err := service.bugReportStorage.BugGet(bugID)
	if err != nil {
		return nil, err
	}

	images, err := service.bugReportStorage.BugCaseListImage(bugID)
	if err != nil {
		return nil, err
	}

	bugImages := []string{}
	for _, imageUrl := range images {
		url, err := service.cloudStorage.ObjectCaseGenerateSignedUrl(imageUrl)
		if err != nil {
			return nil, err
		}
		if url == nil {
			continue
		}
		bugImages = append(bugImages, *url)
	}
	bug.Images = bugImages

	return bug, nil
}
