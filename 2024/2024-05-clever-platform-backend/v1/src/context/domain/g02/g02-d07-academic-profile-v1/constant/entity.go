package constant

import "time"

type UserEntity struct {
	Id        string     `json:"id" db:"id"`
	Email     *string    `json:"email" db:"email"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	IdNumber  *string    `json:"id_number" db:"id_number"`
	ImageUrl  *string    `json:"image_url" db:"image_url"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy *string    `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
}
