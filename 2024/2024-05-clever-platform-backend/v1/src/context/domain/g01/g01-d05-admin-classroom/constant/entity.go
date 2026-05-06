package constant

import "time"

// user.user
type UserEntity struct {
	Id        string     `json:"id" db:"id"`
	Email     *string    `json:"email" db:"email"`
	Title     *string    `json:"title" db:"title"`
	FirstName *string    `json:"first_name" db:"first_name"`
	LastName  *string    `json:"last_name" db:"last_name"`
	IdNumber  *string    `json:"id_number" db:"id_number"`
	ImageUrl  *string    `json:"image_url" db:"image_url"`
	Status    string     `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	CreatedBy *string    `json:"created_by" db:"created_by"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
}

// user.role
type RoleEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

// user.user_role
type UserRoleEntity struct {
	UserId string `json:"user_id" db:"user_id"`
	RoleId int    `json:"role_id" db:"role_id"`
}

// school.school
type SchoolEntity struct {
	Id                            int        `json:"id" db:"id"`
	ImageUrl                      *string    `json:"image_url" db:"image_url"`
	Name                          string     `json:"name" db:"name"`
	Address                       string     `json:"address" db:"address"`
	Region                        string     `json:"region" db:"region"`
	Province                      string     `json:"province" db:"province"`
	District                      string     `json:"district" db:"district"`
	SubDistrict                   string     `json:"sub_district" db:"sub_district"`
	PostCode                      string     `json:"post_code" db:"post_code"`
	Latitude                      *string    `json:"latitude" db:"latitude"`
	Longtitude                    *string    `json:"longtitude" db:"longtitude"`
	Director                      *string    `json:"director" db:"director"`
	DirectorPhoneNumber           *string    `json:"director_phone_number" db:"director_phone_number"`
	Registrar                     *string    `json:"registrar" db:"registrar"`
	RegistrarPhoneNumber          *string    `json:"registrar_phone_number" db:"registrar_phone_number"`
	AcademicAffairHead            *string    `json:"academic_affair_head" db:"academic_affair_head"`
	AcademicAffairHeadPhoneNumber *string    `json:"academic_affair_head_phone_number" db:"academic_affair_head_phone_number"`
	Advisor                       *string    `json:"advisor" db:"advisor"`
	AdvisorPhoneNumber            *string    `json:"advisor_phone_number" db:"advisor_phone_number"`
	Status                        string     `json:"status" db:"status"`
	CreatedAt                     time.Time  `json:"created_at" db:"created_at"`
	CreatedBy                     string     `json:"created_by" db:"created_by"`
	UpdatedAt                     *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy                     *string    `json:"updated_by" db:"updated_by"`
	Code                          *string    `json:"code" db:"code"`
}

// school.school_teacher
type SchoolTeacherEntity struct {
	SchoolId int    `json:"school_id" db:"school_id"`
	UserId   string `json:"user_id" db:"user_id"`
}

// class.class
type ClassEntity struct {
	Id           int         `json:"id" db:"id"`
	SchoolId     int         `json:"school_id" db:"school_id"`
	AcademicYear int         `json:"academic_year" db:"academic_year"`
	Year         string      `json:"year" db:"year"`
	Name         string      `json:"name" db:"name"`
	Status       ClassStatus `json:"status" db:"status"`
	CreatedAt    time.Time   `json:"created_at" db:"created_at"`
	CreatedBy    string      `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time  `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string     `json:"updated_by" db:"updated_by"`
	LineNumber   int         `json:"-"`
}

// school.class_teacher
type ClassTeacherEntity struct {
	ClassId   int    `json:"class_id" db:"class_id"`
	TeacherId string `json:"teacher_id" db:"teacher_id"`
}

// school.class_student
type ClassStudentEntity struct {
	ClassId   int    `json:"class_id" db:"class_id"`
	StudentId string `json:"student_id" db:"student_id"`
}

// user.student
type StudentEntity struct {
	UserId              string     `json:"user_id" db:"user_id"`
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
