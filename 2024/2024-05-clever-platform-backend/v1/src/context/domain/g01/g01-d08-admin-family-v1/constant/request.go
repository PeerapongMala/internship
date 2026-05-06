package constant

import "time"

type FamilyResponse struct {
	FamilyID  int       `json:"family_id" db:"family_id" query:"family_id"`
	UserID    *string   `json:"user_id" db:"user_id" query:"user_id"`
	FirstName *string   `json:"first_name" db:"first_name" query:"first_name"`
	LastName  *string   `json:"last_name" db:"last_name" query:"last_name"`
	LineID    *string   `json:"line_id" db:"line_id" query:"line_id"`
	Member    int       `json:"member_count" db:"member_count" query:"member_count"`
	Status    string    `json:"status" db:"status" query:"status"`
	CreatedAt time.Time `json:"created_at" db:"created_at" query:"created_at"`
}

type ParentResponse struct {
	FamilyID  int       `json:"family_id" db:"family_id"`
	UserID    string    `json:"user_id" db:"user_id"`
	Title     string    `json:"title" db:"title"`
	FirstName string    `json:"first_name" db:"first_name"`
	LastName  string    `json:"last_name" db:"last_name"`
	LineID    *string   `json:"line_id" db:"line_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Parent struct {
	UserID    string    `json:"user_id" db:"user_id" query:"user_id"`
	Title     string    `json:"title" db:"title"`
	FirstName string    `json:"first_name" db:"first_name" query:"first_name"`
	LastName  string    `json:"last_name" db:"last_name" query:"last_name"`
	LineID    *string   `json:"line_id" db:"line_id" query:"line_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Student struct {
	UserID    string `json:"user_id" db:"user_id"`
	Title     string `json:"title" db:"title"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
}

type StudentResponse struct {
	School    string    `json:"school" db:"school"`
	FamilyID  int       `json:"family_id" db:"family_id"`
	UserID    string    `json:"user_id" db:"user_id"`
	Title     string    `json:"title" db:"title"`
	FirstName string    `json:"first_name" db:"first_name"`
	LastName  string    `json:"last_name" db:"last_name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
