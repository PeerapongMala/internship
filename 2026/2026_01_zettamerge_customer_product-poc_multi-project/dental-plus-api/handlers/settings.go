package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"dental-plus-api/config"
	"dental-plus-api/models"
)

// GetSettings returns the settings
func GetSettings(w http.ResponseWriter, r *http.Request) {
	var settings models.Settings
	err := config.DB.QueryRow(context.Background(),
		`SELECT id, COALESCE(intro_message, '') as intro_message FROM settings WHERE id = 1`,
	).Scan(&settings.ID, &settings.IntroMessage)

	if err != nil {
		// Return default settings if not found
		settings = models.Settings{ID: 1, IntroMessage: ""}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(settings)
}

// UpdateSettings updates the settings
func UpdateSettings(w http.ResponseWriter, r *http.Request) {
	var req models.UpdateSettingsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var settings models.Settings
	err := config.DB.QueryRow(context.Background(),
		`INSERT INTO settings (id, intro_message) VALUES (1, $1)
		 ON CONFLICT (id) DO UPDATE SET intro_message = $1
		 RETURNING id, COALESCE(intro_message, '') as intro_message`,
		req.IntroMessage,
	).Scan(&settings.ID, &settings.IntroMessage)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(settings)
}
