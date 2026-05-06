package constant

type AnnouncementResponse struct {
	AnnouncementId int     `db:"announcement_id" json:"announcement_id"`
	StartedAt      string  `db:"started_at" json:"started_at"`
	EndedAt        string  `db:"ended_at" json:"ended_at"`
	Title          string  `db:"title" json:"title"`
	Description    string  `db:"description" json:"description"`
	IsRead         bool    `json:"is_read"`
	ImageUrl       *string `db:"image_url" json:"image_url"`
}
