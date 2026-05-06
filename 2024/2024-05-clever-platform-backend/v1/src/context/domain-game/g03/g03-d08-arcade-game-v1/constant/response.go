package constant

import "github.com/lib/pq"

type ArcadeGameResponse struct {
	Id             int    `db:"id" json:"id"`
	Name           string `db:"name" json:"name"`
	ImageUrl       string `db:"image_url" json:"image_url"`
	ArcadeCoinCost int    `db:"arcade_coin_cost" json:"arcade_coin_cost"`
}

type LeaderBoardResponse struct {
	No           int     `json:"no" db:"global_rank"`
	StudentImage *string `db:"student_image" json:"student_image"`
	StudentId    string  `db:"student_id" json:"student_id"`
	StudentName  string  `db:"student_name" json:"student_name"`
	TotalScore   int     `db:"total_score" json:"total_score"`
	TotalTime    int     `db:"total_time" json:"total_time"`
	MeFlag       bool    `json:"me_flag"`
	Type         string  `json:"-"`
	Name         string  `json:"-"`
	StartDate    *string `json:"-"`
	EndDate      *string `json:"-"`
	EventTotal   int     `json:"-"`
}

type LeaderboardEvent struct {
	EventTotal int           `json:"event_total"`
	EventIds   pq.Int64Array `json:"event_ids"`
}

type LeaderBoardTitle struct {
	Type       string `json:"type"`
	Name       string `json:"title" db:"title"`
	StartDate  string `json:"start_date" db:"started_at"`
	EndDate    string `json:"end_date" db:"ended_at"`
	EventTotal int    `json:"-"`
}
type EventTotal struct {
	EventTotal int `json:"event_total"`
}
type EventTimeResponse struct {
	StartDate string
	EndDate   string
}

type ClassId struct {
	Id int
}

type SchoolId struct {
	Id int
}

type ArcadeGameInfo struct {
	ArcadeGameId   int     `db:"id" json:"id"`
	ArcadeGameName string  `db:"name" json:"name"`
	ImageUrl       *string `db:"image_url" json:"image_url"`
}

type UserResponse struct {
	UserId         string  `db:"id" json:"id"`
	UserName       string  `db:"first_name" json:"first_name"`
	UserImage      *string `db:"image_url" json:"image_url"`
	UserArcadeCoin string  `db:"arcade_coin" json:"arcade_coin"`
}
