package constant

import "time"

type CurriculumGroupEntity struct {
	Id        int        `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	ShortName string     `json:"short_name" db:"short_name"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy string     `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
}

type AuthEmailPasswordEntity struct {
	UserId       string `json:"user_id" db:"user_id"`
	PasswordHash string `json:"password_hash" db:"password_hash"`
}

type UserEntity struct {
	Id             string     `json:"id" db:"id"`
	Email          string     `json:"email" db:"email"`
	Title          string     `json:"title" db:"title"`
	FirstName      string     `json:"first_name" db:"first_name"`
	LastName       string     `json:"last_name" db:"last_name"`
	IdNumber       *string    `json:"id_number" db:"id_number"`
	ImageUrl       *string    `json:"image_url" db:"image_url"`
	SchoolId       *string    `json:"school_id" db:"school_id"`
	SchoolCode     *string    `json:"school_code" db:"school_code"`
	SchoolName     *string    `json:"school_name" db:"school_name"`
	SchoolImageUrl *string    `json:"school_image_url" db:"school_image_url"`
	Status         string     `json:"status" db:"status"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	CreatedBy      *string    `json:"created_by" db:"created_by"`
	UpdatedAt      *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy      *string    `json:"updated_by" db:"updated_by"`
	LastLogin      *time.Time `json:"last_login" db:"last_login"`
}

type Subject struct {
	Id       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Year     int    `json:"year_id" db:"year"`
	YearName string `json:"year_name" db:"year_name"`
}
