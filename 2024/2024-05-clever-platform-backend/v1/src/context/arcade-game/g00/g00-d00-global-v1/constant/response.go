package constant

type TokenResponse struct {
	PlayToken *string `json:"play_token"`
}

type StudentCoinResponse struct {
	ArcadeCoin int `db:"arcade_coin"`
}

type ArcadeCoinCostResponse struct {
	ArcadeCoinCost int `db:"arcade_coin_cost"`
}
type AvatarResponse struct {
	AvatarId    int    `db:"avatar_id" json:"avatar_id"`
	ModelId     string `db:"model_id" json:"model_id"`
	LevelId     int    `db:"level_id" json:"level_id"`
	Is_equipped bool   `db:"is_equipped" json:"is_equipped"`
}

type ArcadeGameConfig struct {
	ArcadeGameId  int    `db:"arcade_game_id"`
	ArcadeGameUrl string `db:"url"`
	ConfigId      int    `db:"config_id"`
}

type GameDataResponse struct {
	StudentId     string          `db:"student_id" json:"student_id"`
	ModelData     *AvatarResponse `json:"model_data"`
	ArcadeGameId  int             `db:"arcade_game_id" json:"arcade_game_id"`
	ArcadeGameUrl string          `db:"url" json:"arcade_game_url"`
	ConfigId      int             `db:"config_id" json:"config_id"`
}

type PlayIdResponse struct {
	PlayId int `db:"play_id"`
}

type SessionResponse struct {
	Session bool    `json:"play_id_exist"`
	PlayId  *string `json:"play_token"`
}

type AssetResponse struct {
	ModelId string  `json:"model_id"`
	Asset   *string `json:"asset"`
}
