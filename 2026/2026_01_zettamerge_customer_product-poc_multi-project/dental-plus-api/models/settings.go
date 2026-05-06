package models

type Settings struct {
	ID           int    `json:"id"`
	IntroMessage string `json:"intro_message"`
}

type UpdateSettingsRequest struct {
	IntroMessage string `json:"intro_message"`
}
