package constant

import (
	"time"

	"github.com/lib/pq"
)

type UserEntity struct {
	Id             string     `json:"id" db:"id"`
	ScId           *int       `json:"school_id" db:"school_id"`
	SchoolName     *string    `json:"school_name" db:"school_name"`
	SchoolCode     *string    `json:"school_code" db:"school_code"`
	SchoolImageUrl *string    `json:"school_image_url" db:"school_image_url"`
	Email          *string    `json:"email" db:"email"`
	Title          string     `json:"title" db:"title"`
	FirstName      string     `json:"first_name" db:"first_name"`
	LastName       string     `json:"last_name" db:"last_name"`
	IdNumber       *string    `json:"id_number" db:"id_number"`
	ImageUrl       *string    `json:"image_url" db:"image_url"`
	Status         string     `json:"status" db:"status"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	CreatedBy      *string    `json:"created_by" db:"created_by"`
	UpdatedAt      *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy      *string    `json:"updated_by" db:"updated_by"`
	LastLogin      *time.Time `json:"last_login" db:"last_login"`
	HavePassword   *bool      `json:"have_password" db:"have_password"`
}

type UserWithTeacherAccesses struct {
	*UserEntity
	TeacherAccesses pq.Int32Array `json:"teacher_accesses" db:"teacher_accesses"`
}

type TeacherEntity struct {
	*UserEntity
	LineUserId   *string       `json:"line_user_id" db:"line_user_id"`
	TeacherRoles pq.Int32Array `json:"teacher_roles" db:"teacher_roles"`
}

type TeacherAccessEntity struct {
	TeacherAccessId int    `json:"teacher_access_id" db:"teacher_access_id"`
	AccessName      string `json:"access_name" db:"access_name"`
}

type TeachingLogEntity struct {
	AcademicYear    int    `json:"academic_year" db:"academic_year"`
	CurriculumGroup string `json:"curriculum_group_name" db:"curriculum_group_name"`
	Subject         string `json:"subject" db:"subject"`
	Year            string `json:"year" db:"year"`
}

type ClassEntity struct {
	Id           int        `json:"id,omitempty" db:"id"`
	SchoolId     int        `json:"school_id,omitempty" db:"school_id"`
	AcademicYear int        `json:"academic_year,omitempty" db:"academic_year"`
	Year         string     `json:"year,omitempty" db:"year"`
	Name         string     `json:"name,omitempty" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
}

type ClassLogEntity struct {
	ClassId   int    `json:"class_id" db:"class_id"`
	ClassYear string `json:"class_year" db:"class_year"`
	ClassName string `json:"class_name" db:"class_name"`
}

type ObserverWithAccesses struct {
	*UserEntity
	ObserverAccesses []ObserverAccessEntity `json:"observer_accesses"`
}

type ObserverAccessEntity struct {
	ObserverAccessId int    `json:"observer_access_id" db:"observer_access_id"`
	AccessName       string `json:"access_name" db:"access_name"`
}

type AuthEmailPasswordEntity struct {
	UserId       string `db:"user_id"`
	PasswordHash string `db:"password_hash"`
}

type SchoolAnnouncerEntity struct {
	SchoolId int
	UserId   string
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
	ParentMaritalStatus *string    `json:"parent_marital_status" db:"parent_marital_status"`
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
}

type StudentDataEntity struct {
	*UserEntity
	*StudentEntity
}

type StudentDataWithOauthEntity struct {
	*StudentDataEntity
	Oauth []AuthOauthEntity `json:"oauth"`
}

type AuthOauthEntity struct {
	Provider  *string `json:"provider" db:"provider"`
	UserId    *string `json:"user_id" db:"user_id"`
	SubjectId *string `json:"subject_id" db:"subject_id"`
}

type AuthPinEntity struct {
	UserId string `json:"user_id" db:"user_id"`
	Pin    string `json:"pin" db:"pin"`
}

type LessonPlayLogEntity struct {
	AcademicYear       int        `json:"academic_year" db:"academic_year"`
	Year               string     `json:"year" db:"year"`
	Class              string     `json:"class" db:"class"`
	CurriculumGroup    string     `json:"curriculum_group" db:"curriculum_group"`
	Subject            string     `json:"subject" db:"subject"`
	Lesson             string     `json:"lesson" db:"lesson"`
	PassedLevelCount   int        `json:"passed_level_count" db:"passed_level_count"`
	TotalLevelCount    int        `json:"total_level_count" db:"total_level_count"`
	PointCount         int        `json:"point_count" db:"point_count"`
	TotalPoint         int        `json:"total_point" db:"total_point"`
	PlayCount          int        `json:"play_count" db:"play_count"`
	AvgTimePerQuestion float32    `json:"avg_time_per_question" db:"avg_time_per_question"`
	LastPlayedAt       *time.Time `json:"last_played" db:"last_played_at"`
}

type FamilyEntity struct {
	Id    int    `json:"id" db:"id"`
	Owner string `json:"owner" db:"owner"`
}

type CurriculumGroupEntity struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	ShortName string `json:"short_name" db:"short_name"`
}

type SubjectEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type LessonEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type SubLessonEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type TeacherNoteEntity struct {
	Teacher        string    `json:"teacher" db:"teacher"`
	ImageUrl       *string   `json:"image_url" db:"image_url"`
	AcademicYear   string    `json:"academic_year" db:"academic_year"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	Year           string    `json:"year" db:"year"`
	Subject        string    `json:"subject" db:"subject"`
	Lesson         string    `json:"lesson" db:"lesson"`
	LessonIndex    int       `json:"lesson_index" db:"lesson_index"`
	SubLesson      string    `json:"sub_lesson" db:"sub_lesson"`
	SubLessonIndex int       `json:"sub_lesson_index" db:"sub_lesson_index"`
	LevelIndex     int       `json:"level_index" db:"level_index"`
	Text           string    `json:"text" db:"text"`
}

type InventoryEntity struct {
	Id         int    `json:"id" db:"id"`
	StudentId  string `json:"student_id" db:"student_id"`
	GoldCoin   int    `json:"gold_coin" db:"gold_coin"`
	ArcadeCoin int    `json:"arcade_coin" db:"arcade_coin"`
	Ice        int    `json:"ice" db:"ice"`
}

type SeedYearEntity struct {
	Id        int        `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	ShortName string     `json:"short_name" db:"short_name"`
	Status    string     `json:"-" db:"status"`
	CreatedAt time.Time  `json:"-" db:"created_at"`
	CreatedBy string     `json:"-" db:"created_by"`
	UpdatedAt *time.Time `json:"-" db:"updated_at"`
	UpdatedBy *string    `json:"-" db:"updated_by"`
}

type Subject struct {
	Id       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Year     int    `json:"year_id" db:"year"`
	YearName string `json:"year_name" db:"year_name"`
}
