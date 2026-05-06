package constant

type EventAnnounceResponse struct {
	AnnouncementId int     `db:"announcement_id" json:"announcement_id"`
	StartedAt      string  `db:"started_at" json:"started_at"`
	EndedAt        string  `db:"ended_at" json:"ended_at"`
	Title          string  `db:"title" json:"title"`
	Description    string  `db:"description" json:"description"`
	ImageUrl       *string `db:"image_url" json:"image_url"`
	ArcadeGameId   int     `db:"arcade_game_id" json:"arcade_game_id"`
	ArcadeGameName string  `db:"arcade_game_name" json:"arcade_game_name"`
	Isread         bool    `json:"is_read"`
}

type RewardAnnounceResponse struct {
	AnnouncementId int        `db:"announcement_id" json:"announcement_id"`
	StartedAt      string     `db:"started_at" json:"started_at"`
	EndedAt        string     `db:"ended_at" json:"ended_at"`
	Title          string     `db:"title" json:"title"`
	Description    string     `db:"description" json:"description"`
	ImageUrl       *string    `db:"image_url" json:"image_url"`
	ItemList       []ItemList `json:"item_list"`
	CoinList       *CoinInfo  `json:"coin_list"`
	Isread         bool       `json:"is_read"`
	IsReceived     bool       `json:"is_received"`
}

type ItemList struct {
	ItemId          int     `db:"item_id" json:"item_id"`
	ItemType        string  `db:"item_type" json:"item_type"`
	ItemName        string  `db:"item_name" json:"item_name"`
	ItemDescription *string `db:"item_description" json:"item_description"`
	ItemImage       *string `db:"item_image" json:"item_image"`
	Amount          int     `db:"amount" json:"amount"`
	ItemExpiredAt   string  `db:"item_expired_at" json:"item_expired_at"`
}

type SystemAnnouncement struct {
	AnnouncementId int     `db:"announcement_id" json:"announcement_id"`
	StartedAt      string  `db:"started_at" json:"started_at"`
	EndedAt        string  `db:"ended_at" json:"ended_at"`
	Title          string  `db:"title" json:"title"`
	Description    string  `db:"description" json:"description"`
	ImageUrl       *string `db:"image_url" json:"image_url"`
	Isread         bool    `json:"is_read"`
}

type AnnouncementStatus struct {
	UserId         string
	AnnouncementId int
	IsRead         bool
	IsDeleted      bool
	IsReceived     bool
}

type ItemInfo struct {
	ItemId int
	Amount int
}
type CoinInfo struct {
	GoldCoin   *int `json:"gold_coin"`
	ArcadeCoin *int `json:"arcade_coin"`
	Ice        *int `json:"ice"`
}
type TeacherRewardResponse struct {
	RewardId        int     `db:"reward_id" json:"reward_id"`
	ItemId          int     `db:"item_id" json:"item_id"`
	ItemType        string  `db:"type" json:"type"`
	ItemName        string  `db:"name" json:"name"`
	ItemDescription string  `db:"description" json:"description"`
	ImageUrl        *string `db:"image_url" json:"image_url"`
	Amount          int     `db:"amount" json:"amount"`
	SendedAt        string  `db:"sended_at" json:"sended_at"`
	SendedFrom      string  `db:"sended_from" json:"sended_from"`
	Status          string  `db:"status" json:"status"`
}
