package constant

type GetTokenRequest struct {
	UserId       string
	ArcadeGameId int
}
type GetGameDataRequest struct {
	Token        string
	UserId       string
	ArcadeGameId int
}
type CreatePlayIdRequest struct {
	PlayId       string
	UserId       string
	ArcadeGameId int
}

type ScoreRequest struct {
	ClassId      int
	StudentId    string
	ArcadeGameId int
	Score        int
	TimeUse      int
	Wave         int
	PlayToken    string
}

type StatRequest struct {
	Score     int    `json:"score"`
	TimeUse   int    `json:"time_used"`
	Wave      int    `json:"wave"`
	PlayToken string `json:"play_token"`
}

type CheckPlayIdRequest struct {
	PlayId       string `db:"play_id"`
	UserId       string `db:"user_Id"`
	ArcadeGameId int    `db:"arcade_game_id"`
}
type Session struct {
	Session string `query:"session"`
}

type GetSessionRequest struct {
	UserId       string `json:"user_id"`
	ArcadeGameId int
}
type UserRequest struct {
	UserId string `json:"user_id"`
}
type IncreaseCoinRequest struct {
	ArcadeCoin int    `json:"arcade_coin"`
	UserId     string `json:"-"`
}
