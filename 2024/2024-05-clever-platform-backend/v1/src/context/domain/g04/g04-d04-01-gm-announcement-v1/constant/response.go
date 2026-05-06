package constant

type GlobalAnnounceResponse struct {
	Id           int     `json:"id" db:"id"`
	SchoolId     int     `json:"school_id" db:"school_id"`
	SchoolName   string  `json:"school_name" db:"school_name"`
	Scope        string  `json:"scope" db:"scope"`
	Type         string  `json:"type" db:"type"`
	Title        string  `json:"title" db:"title"`
	ImageUrl     *string `json:"image_url" db:"image_url"`
	Description  string  `json:"description" db:"description"`
	Status       string  `json:"status" db:"status"`
	StartAt      string  `json:"started_at" db:"started_at"`
	EndAt        string  `json:"ended_at" db:"ended_at"`
	CreatedAt    string  `json:"created_at" db:"created_at"`
	CreatedBy    string  `json:"created_by" db:"created_by"`
	UpdatedAt    *string `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string `json:"updated_by" db:"updated_by"`
	AdminLoginas *string `json:"admin_login_as" db:"admin_login_as"`
}

type EventAnnounceResponse struct {
	Id             int     `json:"id" db:"id"`
	SchoolId       int     `json:"school_id" db:"school_id"`
	SchoolName     string  `json:"school_name" db:"school_name"`
	SubjectId      int     `json:"subject_id" db:"subject_id"`
	SubjectName    string  `json:"subject_name" db:"subject_name"`
	AcademicYear   string  `json:"academic_year" db:"academic_year"`
	YearId         int     `json:"year_id" db:"year_id"`
	SeedYearName   string  `json:"seed_year_name" db:"seed_year_name"`
	Scope          string  `json:"scope" db:"scope"`
	Type           string  `json:"type" db:"type"`
	TiTle          string  `json:"title" db:"title"`
	ImageUrl       *string `json:"image_url" db:"image_url"`
	Description    string  `json:"description" db:"description"`
	Status         string  `json:"status" db:"status"`
	ArcadeGameId   int     `json:"arcade_game_id" db:"arcade_game_id"`
	ArcadeGameName string  `json:"arcade_game_name" db:"arcade_game_name"`
	StartAt        string  `json:"started_at" db:"started_at"`
	EndAt          string  `json:"ended_at" db:"ended_at"`
	CreatedAt      string  `json:"created_at" db:"created_at"`
	CreatedBy      string  `json:"created_by" db:"created_by"`
	UpdatedAt      *string `json:"updated_at" db:"updated_at"`
	UpdatedBy      *string `json:"updated_by" db:"updated_by"`
	AdminLoginAs   *string `json:"admin_login_as" db:"admin_login_as"`
}

type RewardAnnounceResponse struct {
	Id           int     `json:"id" db:"id"`
	SchoolId     int     `json:"school_id" db:"school_id"`
	SchoolName   string  `json:"school_name" db:"school_name"`
	Scope        string  `json:"scope" db:"scope"`
	Type         string  `json:"type" db:"type"`
	Title        string  `json:"title" db:"title"`
	ImageUrl     *string `json:"image_url" db:"image_url"`
	Description  string  `json:"description" db:"description"`
	SubjectId    int     `json:"subject_id" db:"subject_id"`
	SubjectName  string  `json:"subject_name" db:"subject_name"`
	AcademicYear int     `json:"academic_year" db:"academic_year"`
	YearId       int     `json:"year_id" db:"year_id"`
	SeedYearName string  `json:"seed_year_name" db:"seed_year_name"`
	// ItemId       *int    `json:"item_id" db:"item_id"`
	// ItemName     *string `json:"item_name" db:"item_name"`
	// Amount       *int    `json:"amount" db:"amount"`
	// ExpiredAt    *string `json:"expired_at" db:"expired_at"`
	Status       string  `json:"status" db:"status"`
	StartAt      string  `json:"started_at" db:"started_at"`
	EndAt        string  `json:"ended_at" db:"ended_at"`
	CreatedAt    string  `json:"created_at" db:"created_at"`
	CreatedBy    string  `json:"created_by" db:"created_by"`
	UpdatedAt    *string `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string `json:"admin_login_as" db:"admin_login_as"`
}
type RewardAnnounceResponseService struct {
	Id           int        `json:"id" db:"id"`
	SchoolId     int        `json:"school_id" db:"school_id"`
	SchoolName   string     `json:"school_name" db:"school_name"`
	Scope        string     `json:"scope" db:"scope"`
	Type         string     `json:"type" db:"type"`
	Title        string     `json:"title" db:"title"`
	ImageUrl     *string    `json:"image_url" db:"image_url"`
	Description  string     `json:"description" db:"description"`
	SubjectId    int        `json:"subject_id" db:"subject_id"`
	SubjectName  string     `json:"subject_name" db:"subject_name"`
	AcademicYear int        `json:"academic_year" db:"academic_year"`
	YearId       int        `json:"year_id" db:"year_id"`
	SeedYearName string     `json:"seed_year_name" db:"seed_year_name"`
	Items        []ItemList `json:"item_list"`
	Coins        *CoinList  `json:"coin_list"`
	Status       string     `json:"status" db:"status"`
	StartAt      string     `json:"started_at" db:"started_at"`
	EndAt        string     `json:"ended_at" db:"ended_at"`
	CreatedAt    string     `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *string    `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type NewsAnnounceResponse struct {
	Id           int     `json:"id" db:"id"`
	SchoolId     int     `json:"school_id" db:"school_id"`
	SchoolName   string  `json:"school_name" db:"school_name"`
	SubjectId    int     `json:"subject_id" db:"subject_id"`
	SubjectName  string  `json:"subject_name" db:"subject_name"`
	AcademicYear int     `json:"academic_year" db:"academic_year"`
	YearId       int     `json:"year_id" db:"year_id"`
	SeedYearName string  `json:"seed_year_name" db:"seed_year_name"`
	Scope        string  `json:"scope" db:"scope"`
	Type         string  `json:"type" db:"type"`
	Title        string  `json:"title" db:"title"`
	ImageUrl     *string `json:"image_url" db:"image_url"`
	Description  string  `json:"description" db:"description"`
	Status       string  `json:"status" db:"status"`
	StartAt      string  `json:"started_at" db:"started_at"`
	EndedAt      string  `json:"ended_at" db:"ended_at"`
	CreatedAt    string  `json:"created_at" db:"created_at"`
	CreatedBy    string  `json:"created_by" db:"created_by"`
	UpdatedAt    *string `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string `json:"admin_login_as" db:"admin_login_as"`
}

type SchoolList struct {
	SchoolId   int    `db:"id" json:"id"`
	SchoolName string `db:"name" json:"name"`
}
type ArcadeGameList struct {
	ArcadeGameId   int    `db:"id"`
	ArcadeGameName string `db:"name"`
}

type SubjectList struct {
	SubjectId   int    `db:"id" json:"id"`
	SubjectName string `db:"name"`
}

type YearList struct {
	YearId int    `db:"id" json:"id"`
	Name   string `db:"name" json:"name"`
}
type ItemList struct {
	ItemId    int     `db:"id" json:"item_id"`
	ItemName  string  `db:"name" json:"item_name"`
	Type      string  `db:"type" json:"type"`
	Amount    string  `db:"amount" json:"amount"`
	ExpiredAt string  `db:"expired_at" json:"expired_at"`
	ImageUrl  *string `db:"item_image_url" json:"item_image_url"`
	UpdatedAt *string `db:"updated_at" json:"updated_at"`
	UpdatedBy *string `db:"updated_by" json:"updated_by"`
}
type CoinList struct {
	Goldcoin   *int `db:"gold_coin" json:"gold_coin"`
	ArcadeCoin *int `db:"arcade_coin" json:"arcade_coin"`
	Ice        *int `db:"ice" json:"ice"`
}

type AcademicYearResponse struct {
	AcaademicYear int `db:"academic_year" json:"academic_year"`
}

type ItemListDropDown struct {
	Id          int     `db:"id" json:"id"`
	Type        string  `db:"type" json:"type"`
	Name        string  `db:"name" json:"name" `
	Description *string `db:"description" json:"description"`
	ImageUrl    *string `db:"image_url" json:"image_url"`
}
