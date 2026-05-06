package constant

type AccountInfo struct {
	UserID     string `json:"user_id" db:"user_id"`
	FirstName  string `json:"first_name" db:"first_name"`
	LastNAme   string `json:"last_name" db:"last_name"`
	StudentID  string `json:"student_id " db:"student_id"`
	SchoolID   int    `json:"school_id" db:"school_id"`
	SchoolName string `json:"school_name" db:"school_name"`
}

type FamilyInfo struct {
	FamilyID   int    `json:"family_id" db:"family_id"`
	StudentUID string `json:"student_uid" db:"student_uid"`
	OwnerID    string `json:"user_id" db:"user_id"`
	FirstName  string `json:"first_name" db:"first_name"`
	LastNAme   string `json:"last_name" db:"last_name"`
}
