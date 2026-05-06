package constant

import "time"

type InventoryEntity struct {
	Id         *int    `db:"id" json:"id"`
	StudentId  *string `db:"student_id" json:"student_id"`
	GoldCoin   *int    `db:"gold_coin" json:"gold_coin"`
	ArcadeCoin *int    `db:"arcade_coin" json:"arcade_coin"`
	Ice        *int    `db:"ice" json:"ice"`
	Stars      *int    `db:"stars" json:"stars"`
}

type AnnouncementList struct {
	SchoolID       int       `json:"school_id" db:"school_id"`
	AnnouncementID int       `json:"announcement_id" db:"announcement_id"`
	Scope          string    `json:"scope" db:"scope"`
	Type           string    `json:"type" db:"type"`
	Title          string    `json:"title" db:"title"`
	StartDate      time.Time `json:"started_at" db:"started_at"`
	EndDate        time.Time `json:"ended_at" db:"ended_at"`
}

type InventoryProfile struct {
	AvatarID         *int    `json:"avatar_id" db:"avatar_id"`
	AvatarModelID    *string `json:"model_id_avatar" db:"model_id_avatar"`
	PetID            *int    `json:"pet_id" db:"pet_id"`
	PetModelID       *string `json:"model_id_pet" db:"model_id_pet"`
	TemplatePath     *string `json:"template_path" db:"template_path"`
	BadgeDescription *string `json:"badge_description" db:"badge_description"`
}

type Account struct {
	UserID     string `json:"user_id" db:"user_id"`
	SchoolID   int    `json:"school_id" db:"school_id"`
	SchoolName string `json:"school_name" db:"school_name"`
	FirstName  string `json:"first_name" db:"first_name"`
	LastName   string `json:"last_name" db:"last_name"`
}
