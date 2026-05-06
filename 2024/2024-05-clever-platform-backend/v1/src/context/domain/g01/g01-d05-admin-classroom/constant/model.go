package constant

import "time"

type ClassroomListFilter struct {
	Search            string    `query:"search"`
	Status            string    `query:"status"`
	Year              string    `query:"year"`
	AcademicYear      *int      `query:"academic_year"`
	StartUpdatedAtStr string    `query:"start_updated_at"`
	StartUpdatedAt    time.Time `query:"-"`
	EndUpdatedAtStr   string    `query:"end_updated_at"`
	EndUpdatedAt      time.Time `query:"-"`
}

type TeacherEntity struct {
	Id        string `json:"id" db:"id"`
	Title     string `json:"title" db:"title"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
	Status    string `json:"status" db:"status"`
}
type StudentSearchEntity struct {
	Id        string  `json:"id" db:"id"`
	StudentId *string `json:"student_id" db:"student_id"`
	Title     string  `json:"title" db:"title"`
	FirstName string  `json:"first_name" db:"first_name"`
	LastName  string  `json:"last_name" db:"last_name"`
	Status    string  `json:"status" db:"status"`
}

type TeacherClassroomEntity struct {
	Id        string     `json:"id" db:"id"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	Email     *string    `json:"email" db:"email"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
	Status    string     `json:"status" db:"status"`
}

type StudentClassroomEntity struct {
	Id        string     `json:"id" db:"id"`
	StudentId *string    `json:"student_id" db:"student_id"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	Email     *string    `json:"email" db:"email"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
	Status    string     `json:"status" db:"status"`
}

type Conflict struct {
	RecordId    int      `json:"record_id"`
	Name        string   `json:"name"`
	MessageList []string `json:"message_list"`
}
