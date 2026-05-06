package constant

import (
	"fmt"
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

type Status string

const (
	Draft    Status = "draft"
	Enabled  Status = "enabled"
	Disabled Status = "disabled"
)

var (
	StatusList          []Status = []Status{Enabled, Disabled, Draft}
	StatusAfterDraft    []Status = []Status{Enabled, Disabled, Draft}
	StatusAfterDisabled []Status = []Status{Enabled, Disabled}
	StatusAfterEnabled  []Status = []Status{Disabled, Enabled}
)

func ValidateStatus(status string) error {
	if status == "" {
		return nil
	}
	if !slices.Contains(StatusList, Status(status)) {
		msg := "Invalid status"
		err := helper.NewHttpError(http.StatusBadRequest, &msg)
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}

func ValidateNewStatus(currentStatus string, newStatus string) error {
	if newStatus == "" {
		return nil
	}
	switch Status(currentStatus) {
	case Draft:
		if slices.Contains(StatusAfterDraft, Status(newStatus)) {
			return nil
		}
	case Enabled:
		if slices.Contains(StatusAfterEnabled, Status(newStatus)) {
			return nil
		}
	case Disabled:
		if slices.Contains(StatusAfterDisabled, Status(newStatus)) {
			return nil
		}
	}
	msg := fmt.Sprintf(`Cannot change status from %s to %s`, currentStatus, newStatus)
	err := helper.NewHttpError(http.StatusBadRequest, &msg)
	log.Printf("%+v", errors.WithStack(err))
	return err
}
