package constant

import (
	"slices"
)

type ClassStatus string

const (
	Draft   ClassStatus = "draft"
	Enable  ClassStatus = "enabled"
	Disable ClassStatus = "disabled"
)

func (c ClassStatus) IsValid() bool {
	switch c {
	case Draft, Enable, Disable:
		return true
	default:
		return false
	}
}

var (
	StatusAfterDraft     = []ClassStatus{Enable, Disable, Draft}
	StatusAfterArchived  = []ClassStatus{}
	StatusAfterPublished = []ClassStatus{Disable, Enable}
)

func ValidateClassStatus(currentStatus ClassStatus, newStatus ClassStatus) bool {
	switch currentStatus {
	case Draft:
		return slices.Contains(StatusAfterDraft, newStatus)
	case Enable:
		return slices.Contains(StatusAfterPublished, newStatus)
	case Disable:
		return slices.Contains(StatusAfterArchived, newStatus)
	}
	return false
}
