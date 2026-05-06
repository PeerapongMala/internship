package constant

import (
	"time"
)

type UserEntity struct {
	Id               string     `json:"id" db:"id"`
	Email            *string    `json:"email" db:"email"`
	Title            string     `json:"title" db:"title"`
	FirstName        string     `json:"first_name" db:"first_name"`
	LastName         string     `json:"last_name" db:"last_name"`
	IdNumber         *string    `json:"id_number" db:"id_number"`
	ImageUrl         *string    `json:"image_url" db:"image_url"`
	Status           string     `json:"status" db:"status"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	CreatedBy        *string    `json:"created_by" db:"created_by"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by" db:"updated_by"`
	LastLogin        *time.Time `json:"last_login" db:"last_login"`
	AccessToken      string     `json:"access_token,omitempty"`
	SchoolId         *int       `json:"school_id,omitempty" db:"school_id"`
	SchoolName       *string    `json:"school_name,omitempty" db:"school_name"`
	SchoolImage      *string    `json:"school_image,omitempty" db:"school_image"`
	SchoolCode       *string    `json:"school_code,omitempty" db:"school_code"`
	Roles            []int      `json:"roles"`
	TeacherRoles     []int      `json:"teacher_roles"`
	IsSubjectTeacher bool       `json:"is_subject_teacher"`
	Subject          []Subject  `json:"subject"`
	AcademicYear     *int       `json:"academic_year"`
}

type Subject struct {
	Id       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	YearId   int    `json:"year_id" db:"year"`
	YearName string `json:"year_name" db:"year_name"`
}

type User struct {
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

type ParentEntity struct {
	UserId       string     `json:"user_id" db:"user_id"`
	Relationship string     `json:"relationship" db:"relationship"`
	PhoneNumber  string     `json:"phone_number" db:"phone_number"`
	BirthDate    *time.Time `json:"birth_date" db:"birth_date"`
}

type StudentEntity struct {
	UserId      string  `json:"id,omitempty" db:"user_id"`
	Status      string  `json:"-" db:"status"`
	StudentId   string  `json:"student_id,omitempty" db:"student_id"`
	SchoolId    string  `json:"school_id,omitempty" db:"school_id"`
	SchoolName  string  `json:"school_name,omitempty" db:"school_name"`
	SchoolImage *string `json:"school_image,omitempty" db:"school_image"`
	SchoolCode  string  `json:"school_code,omitempty" db:"school_code"`
	FamilyId    *int    `json:"family_id,omitempty" db:"family_id"`
	FamilyOwner *string `json:"family_owner,omitempty" db:"family_owner"`
	Title       string  `json:"title" db:"title"`
	FirstName   string  `json:"first_name" db:"first_name"`
	LastName    string  `json:"last_name" db:"last_name"`
	ImagePath   *string `json:"image_url" db:"image_url"`
	AccessToken string  `json:"access_token,omitempty"`
}

type PreLoginStudentEntity struct {
	Title     string  `json:"title"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	ImagePath *string `json:"image_path"`
}

type AdminLoginAsEntity struct {
	*StudentEntity
	AdminId        string `json:"admin_id"`
	AdminTitle     string `json:"admin_title"`
	AdminFirstName string `json:"admin_first_name"`
	AdminLastName  string `json:"admin_last_name"`
}

type AuthPinEntity struct {
	UserId string `json:"user_id" db:"user_id"`
	Pin    string `json:"pin" db:"pin"`
}

type AuthOauthEntity struct {
	Provider  string `json:"provider" db:"provider"`
	UserId    string `json:"user_id" db:"user_id"`
	SubjectId string `json:"subject_id" db:"subject_id"`
}

type AuthEmailPasswordEntity struct {
	UserId       string `db:"user_id"`
	PasswordHash string `db:"password_hash"`
}

type GameAssetEntity struct {
	ModelVersionId *string `json:"model_version_id" db:"version"`
	ModelId        *string `json:"model_id" db:"model_id"`
	Url            *string `json:"url" db:"url"`
}
