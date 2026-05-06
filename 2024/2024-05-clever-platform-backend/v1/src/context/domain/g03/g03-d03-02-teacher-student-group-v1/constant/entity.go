package constant

import "time"

type StudentGroupMember struct {
	AcademicYear    int          `json:"academic_year" db:"academic_year"`
	Year            string       `json:"year" db:"year"`
	Room            int          `json:"room" db:"room"`
	StudentUserUUID string       `json:"student_user_uuid" db:"student_user_uuid"`
	StudentID       string       `json:"student_id" db:"student_id"`
	Title           string       `json:"title" db:"title"`
	FirstName       string       `json:"first_name" db:"first_name"`
	LastName        string       `json:"last_name" db:"last_name"`
	LatestLogin     *time.Time   `json:"latest_login_at" db:"latest_login_at"`
	StudyGroups     []StudyGroup `json:"study_groups"`
	IsMember        bool         `json:"is_member" db:"is_member"`
}

type StudyGroup struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	SubjectId int    `json:"-" db:"subject_id"`
	ClassId   int    `json:"-" db:"class_id"`
}
