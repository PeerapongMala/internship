package constant

type Config struct {
	ChatLevel string `json:"chat_level" db:"chat_level"`
	Status    bool   `json:"status" db:"is_enabled"`
}
