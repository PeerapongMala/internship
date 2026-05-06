package constant

import "time"

type AdminReportTeacherStats struct {
	TeacherId      *string `json:"teacher_id"`
	TeacherName    string  `json:"teacher_name"`
	ClassRoomCount int64   `json:"class_room_count"`
	HomeworkCount  int64   `json:"homework_count"`
	Progress       float64 `json:"progress"`
}

type ProgressReport struct {
	Scope      string  `json:"scope"`
	Progress   float64 `json:"progress"`
	TotalCount int     `json:"-" db:"total_count"`
}

type SchoolEntity struct {
	Id         int    `json:"id" db:"id"`
	Name       string `json:"name" db:"name"`
	TotalCount int    `json:"-" db:"total_count"`
}

type BestStudentEntity struct {
	SchoolCode       *string `json:"school_code" db:"school_code"`
	SchoolName       *string `json:"school_name" db:"school_name"`
	StudentId        *string `json:"student_id" db:"student_id"`
	StudentTitle     *string `json:"student_title" db:"student_title"`
	StudentFirstName *string `json:"student_first_name" db:"student_first_name"`
	StudentLastName  *string `json:"student_last_name" db:"student_last_name"`
	AcademicYear     *string `json:"academic_year" db:"academic_year"`
	Year             *string `json:"year" db:"year"`
	ClassName        *string `json:"class_name" db:"class_name"`
	Levels           *int    `json:"levels" db:"levels"`
	Stars            *int    `json:"stars" db:"stars"`
}

type BestTeacherListByClassStars struct {
	SchoolCode       *string  `json:"school_code" db:"school_code"`
	SchoolName       *string  `json:"school_name" db:"school_name"`
	TeacherId        *string  `json:"teacher_id" db:"teacher_id"`
	TeacherTitle     *string  `json:"teacher_title" db:"teacher_title"`
	TeacherFirstName *string  `json:"teacher_first_name" db:"teacher_first_name"`
	TeacherLastName  *string  `json:"teacher_last_name" db:"teacher_last_name"`
	ClassId          *int     `json:"class_id" db:"class_id"`
	AcademicYear     *string  `json:"academic_year" db:"academic_year"`
	Year             *string  `json:"year" db:"year"`
	ClassName        *string  `json:"class_name" db:"class_name"`
	StudentCount     *int     `json:"student_count" db:"student_count"`
	Levels           *float64 `json:"levels" db:"levels"`
	Stars            *float64 `json:"stars" db:"stars"`
	AllClassInUse    bool     `json:"all_class_in_use" db:"all_class_in_use"`
}

type BestTeacherListByStudyGroupStars struct {
	SchoolCode       *string  `json:"school_code" db:"school_code"`
	SchoolName       *string  `json:"school_name" db:"school_name"`
	TeacherId        *string  `json:"teacher_id" db:"teacher_id"`
	TeacherTitle     *string  `json:"teacher_title" db:"teacher_title"`
	TeacherFirstName *string  `json:"teacher_first_name" db:"teacher_first_name"`
	TeacherLastName  *string  `json:"teacher_last_name" db:"teacher_last_name"`
	ClassId          *int     `json:"class_id" db:"class_id"`
	AcademicYear     *string  `json:"academic_year" db:"academic_year"`
	Year             *string  `json:"year" db:"year"`
	ClassName        *string  `json:"class_name" db:"class_name"`
	StudyGroupId     *int     `json:"study_group_id" db:"study_group_id"`
	StudyGroupName   *string  `json:"study_group_name" db:"study_group_name"`
	StudentCount     *int     `json:"student_count" db:"student_count"`
	Levels           *float64 `json:"levels" db:"levels"`
	Stars            *float64 `json:"stars" db:"stars"`
	Attempts         *int     `json:"attempts" db:"attempts"`
	AvgTime          *float64 `json:"avg_time" db:"avg_time"`
}

type BestTeacherListByHomework struct {
	SchoolCode       *string    `json:"school_code" db:"school_code"`
	SchoolName       *string    `json:"school_name" db:"school_name"`
	TeacherId        *string    `json:"teacher_id" db:"teacher_id"`
	TeacherTitle     *string    `json:"teacher_title" db:"teacher_title"`
	TeacherFirstName *string    `json:"teacher_first_name" db:"teacher_first_name"`
	TeacherLastName  *string    `json:"teacher_last_name" db:"teacher_last_name"`
	HomeworkCount    *int       `json:"homework_count" db:"homework_count"`
	WeekCount        *int       `json:"week_count" db:"week_count"`
	LastLogin        *time.Time `json:"last_login" db:"last_login"`
}

type BestTeacherListByLesson struct {
	CurriculumGroupName *string  `json:"curriculum_group_name" db:"curriculum_group_name"`
	LessonName          *string  `json:"lesson_name" db:"lesson_name"`
	SubLessonName       *string  `json:"sub_lesson_name" db:"sub_lesson_name"`
	Levels              *float64 `json:"levels" db:"levels"`
	Stars               *float64 `json:"stars" db:"stars"`
	Attempts            *int     `json:"attempts" db:"attempts"`
	AvgTime             *float64 `json:"avg_time" db:"avg_time"`
	SchoolName          *string  `json:"school_name" db:"school_name"`
	AcademicYear        *string  `json:"academic_year" db:"academic_year"`
	Year                *string  `json:"year" db:"year"`
	ClassName           *string  `json:"class_name" db:"class_name"`
}

type BestSchoolListByAvgClassStars struct {
	SchoolCode         *string  `json:"school_code" db:"school_code"`
	SchoolName         *string  `json:"school_name" db:"school_name"`
	ClassCount         *int     `json:"class_count" db:"class_count"`
	TeacherCount       *int     `json:"teacher_count" db:"teacher_count"`
	StudentCount       *int     `json:"student_count" db:"student_count"`
	AvgStars           *float64 `json:"avg_stars" db:"avg_stars"`
	ActiveClassCount   *int     `json:"active_class_count" db:"active_class_count"`
	ActiveStudentCount *int     `json:"active_student_count" db:"active_student_count"`
}
