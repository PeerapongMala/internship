package constant

import (
	"slices"
)

type ContractStatus string

const (
	Draft    ContractStatus = "draft"
	Enabled  ContractStatus = "enabled"
	Disabled ContractStatus = "disabled"
)

var (
	StatusAfterDraft    []ContractStatus = []ContractStatus{Enabled, Disabled, Draft}
	StatusAfterDisabled []ContractStatus = []ContractStatus{Enabled, Disabled}
	StatusAfterEnabled  []ContractStatus = []ContractStatus{Disabled, Enabled}
)

func ValidateContractStatus(currentStatus ContractStatus, newStatus ContractStatus) bool {
	switch currentStatus {
	case Draft:
		return slices.Contains(StatusAfterDraft, newStatus)
	case Enabled:
		return slices.Contains(StatusAfterEnabled, newStatus)
	case Disabled:
		return slices.Contains(StatusAfterDisabled, newStatus)
	}
	return false
}
