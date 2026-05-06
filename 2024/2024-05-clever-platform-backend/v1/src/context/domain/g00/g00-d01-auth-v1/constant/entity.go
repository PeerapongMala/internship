package constant

import (
	"time"
)

type AuthEmailPasswordEntity struct {
	UserId       string `db:"user_id"`
	PasswordHash string `db:"password_hash"`
}

type AuthOAuthEntity struct {
	Provider  *string `json:"provider" db:"provider"`
	UserId    *string `json:"-" db:"user_id"`
	SubjectId *string `json:"subject_id" db:"subject_id"`
}

type ObserverAccessEntity struct {
	Id                  int        `json:"id" db:"id"`
	AccessName          string     `json:"access_name" db:"access_name"`
	Name                *string    `json:"name" db:"name"`
	AreaOffice          *string    `json:"area_office" db:"area_office"`
	DistrictGroup       *string    `json:"district_group" db:"district_group"`
	District            *string    `json:"district" db:"district"`
	SchoolAffiliationId *int       `json:"school_affiliation_id" db:"school_affiliation_id"`
	Status              string     `json:"status" db:"status"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           *string    `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
}

type ObserverAccessWithSchoolsEntity struct {
	ObserverAccessEntity
	Schools []int `json:"schools" db:"schools"`
}

type UserEntity struct {
	Id        string     `json:"id" db:"id"`
	Email     string     `json:"email" db:"email"`
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
