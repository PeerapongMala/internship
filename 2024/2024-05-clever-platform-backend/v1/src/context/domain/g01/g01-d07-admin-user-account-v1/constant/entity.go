package constant

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
)

type UserEntity struct {
	Id           string     `json:"id" db:"id"`
	Email        *string    `json:"email" db:"email"`
	Title        string     `json:"title" db:"title"`
	FirstName    string     `json:"first_name" db:"first_name"`
	LastName     string     `json:"last_name" db:"last_name"`
	IdNumber     *string    `json:"id_number" db:"id_number"`
	ImageUrl     *string    `json:"image_url" db:"image_url"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    *string    `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	LastLogin    *time.Time `json:"last_login" db:"last_login"`
	HavePassword *bool      `json:"have_password" db:"have_password"`
}

type StudentEntity struct {
	UserId              string     `json:"-" db:"user_id"`
	SchoolId            int        `json:"school_id" db:"school_id"`
	StudentId           string     `json:"student_id" db:"student_id"`
	Year                string     `json:"year" db:"year"`
	BirthDate           *time.Time `json:"birth_date" db:"birth_date"`
	Nationality         *string    `json:"nationality" db:"nationality"`
	Ethnicity           *string    `json:"ethnicity" db:"ethnicity"`
	Religion            *string    `json:"religion" db:"religion"`
	FatherTitle         *string    `json:"father_title" db:"father_title"`
	FatherFirstName     *string    `json:"father_first_name" db:"father_first_name"`
	FatherLastName      *string    `json:"father_last_name" db:"father_last_name"`
	MotherTitle         *string    `json:"mother_title" db:"mother_title"`
	MotherFirstName     *string    `json:"mother_first_name" db:"mother_first_name"`
	MotherLastName      *string    `json:"mother_last_name" db:"mother_last_name"`
	ParentRelationship  *string    `json:"parent_relationship" db:"parent_relationship"`
	ParentTitle         *string    `json:"parent_title" db:"parent_title"`
	ParentFirstName     *string    `json:"parent_first_name" db:"parent_first_name"`
	ParentLastName      *string    `json:"parent_last_name" db:"parent_last_name"`
	HouseNumber         *string    `json:"house_number" db:"house_number"`
	Moo                 *string    `json:"moo" db:"moo"`
	District            *string    `json:"district" db:"district"`
	SubDistrict         *string    `json:"sub_district" db:"sub_district"`
	Province            *string    `json:"province" db:"province"`
	PostCode            *string    `json:"post_code" db:"post_code"`
	ParentMaritalStatus *string    `json:"parent_marital_status" db:"parent_marital_status"`
}

type StudentDataEntity struct {
	*UserEntity
	*StudentEntity
}

type StudentDataWithOAuth struct {
	*StudentDataEntity
	Oauth []constant.AuthOAuthEntity `json:"oauth"`
}

type ObserverWithAccesses struct {
	*UserEntity
	ObserverAccesses []ObserverAccessEntity `json:"observer_accesses"`
}

type ParentEntity struct {
	UserId       string    `json:"-" db:"user_id"`
	Relationship string    `json:"relationship" db:"relationship"`
	PhoneNumber  *string   `json:"phone_number" db:"phone_number"`
	BirthDate    time.Time `json:"birth_date" db:"birth_date"`
}

type ParentDataEntity struct {
	UserEntity
	ParentEntity
}

type RoleEntity struct {
	Id   int    `db:"id"`
	Name string `db:"name"`
}

type UserWithRolesEntity struct {
	UserEntity
	LineSubjectId *string `json:"line_user_id" db:"line_user_id"`
	Roles         []int   `json:"roles" db:"roles"`
}

type SchoolAnnouncerEntity struct {
	SchoolId int
	UserId   string
}

type ObserverAccessEntity struct {
	ObserverAccessId int        `json:"observer_access_id" db:"observer_access_id"`
	Name             string     `json:"name" db:"name"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by" db:"updated_by"`
}

type AuthEmailPasswordEntity struct {
	UserId       string `json:"user_id" db:"user_id"`
	PasswordHash string `json:"password_hash" db:"password_hash"`
}

type AuthOAuthEntity struct {
	Provider  string `json:"provider" db:"provider"`
	UserId    string `json:"user_id" db:"user_id"`
	SubjectId string `json:"subject_id" db:"subject_id"`
}
