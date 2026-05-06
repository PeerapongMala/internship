package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"dental-plus-api/config"
	"dental-plus-api/models"

	"github.com/go-chi/chi/v5"
)

// GetChatQuestions returns all chat questions
func GetChatQuestions(w http.ResponseWriter, r *http.Request) {
	channel := r.URL.Query().Get("channel")

	query := `SELECT id, question, COALESCE(customer_name, '') as customer_name, COALESCE(channel, '') as channel, frequency, created_at FROM chat_questions WHERE 1=1`
	args := []interface{}{}

	if channel != "" {
		query += ` AND channel = $1`
		args = append(args, channel)
	}

	query += ` ORDER BY created_at DESC`

	rows, err := config.DB.Query(context.Background(), query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	questions := []models.ChatQuestion{}
	for rows.Next() {
		var q models.ChatQuestion
		err := rows.Scan(&q.ID, &q.Question, &q.CustomerName, &q.Channel, &q.Frequency, &q.CreatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		questions = append(questions, q)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(questions)
}

// CreateChatQuestion creates a new chat question
func CreateChatQuestion(w http.ResponseWriter, r *http.Request) {
	var req models.CreateChatQuestionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Question == "" {
		http.Error(w, "Question is required", http.StatusBadRequest)
		return
	}

	var q models.ChatQuestion
	err := config.DB.QueryRow(context.Background(),
		`INSERT INTO chat_questions (question, customer_name, channel) VALUES ($1, $2, $3)
		 RETURNING id, question, COALESCE(customer_name, '') as customer_name, COALESCE(channel, '') as channel, frequency, created_at`,
		req.Question, nullIfEmpty(req.CustomerName), nullIfEmpty(req.Channel),
	).Scan(&q.ID, &q.Question, &q.CustomerName, &q.Channel, &q.Frequency, &q.CreatedAt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(q)
}

// DeleteChatQuestion deletes a chat question
func DeleteChatQuestion(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	result, err := config.DB.Exec(context.Background(), `DELETE FROM chat_questions WHERE id = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, "Chat question not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// BulkDeleteChatQuestions deletes multiple chat questions
func BulkDeleteChatQuestions(w http.ResponseWriter, r *http.Request) {
	var req models.BulkDeleteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if len(req.IDs) == 0 {
		http.Error(w, "No IDs provided", http.StatusBadRequest)
		return
	}

	// Build query with IN clause
	result, err := config.DB.Exec(context.Background(),
		`DELETE FROM chat_questions WHERE id = ANY($1)`, req.IDs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int64{"deleted": result.RowsAffected()})
}
