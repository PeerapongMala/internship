package constant

type UserStatus string

const (
	Draft    UserStatus = "draft"
	Enabled  UserStatus = "enabled"
	Disabled UserStatus = "disabled"
)

var (
	UserStatusList = []UserStatus{Draft, Enabled, Disabled}
)
