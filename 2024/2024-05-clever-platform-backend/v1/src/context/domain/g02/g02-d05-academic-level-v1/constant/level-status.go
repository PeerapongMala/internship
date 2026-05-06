package constant

import (
	"fmt"
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

const (
	Setting     string = "setting"
	Question    string = "question"
	Translation string = "translation"
	Speech      string = "speech"
	Enabled     string = "enabled"
	Disabled    string = "disabled"
)

var (
	StatusList          []string = []string{Setting, Question, Translation, Speech, Enabled, Disabled}
	StatusAfterEnabled  []string = []string{Disabled, Enabled}
	StatusAfterDisabled []string = []string{Disabled}
)

func ValidateStatus(status string) error {
	if status == "" {
		return nil
	}
	if !slices.Contains(StatusList, status) {
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
	switch currentStatus {
	case Setting, Question, Translation, Speech:
		if slices.Contains(StatusList, newStatus) {
			return nil
		}
	case Enabled:
		if slices.Contains(StatusAfterEnabled, newStatus) {
			return nil
		}
	case Disabled:
		if slices.Contains(StatusAfterDisabled, newStatus) {
			return nil
		}
	}
	msg := fmt.Sprintf(`Cannot change status from %s to %s`, currentStatus, newStatus)
	err := helper.NewHttpError(http.StatusBadRequest, &msg)
	log.Printf("%+v", errors.WithStack(err))
	return err
}
