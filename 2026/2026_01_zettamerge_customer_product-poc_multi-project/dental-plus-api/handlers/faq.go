package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"dental-plus-api/config"
	"dental-plus-api/models"
	"dental-plus-api/services"

	"github.com/go-chi/chi/v5"
)

var faqGeminiService = services.NewGeminiService()

// GetFAQs returns all FAQs with optional filtering
func GetFAQs(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	search := r.URL.Query().Get("search")

	query := `SELECT id, question, answer, COALESCE(category, '') as category, views, created_at, updated_at FROM faqs WHERE 1=1`
	args := []interface{}{}
	argCount := 0

	if category != "" {
		argCount++
		query += ` AND category = $` + strconv.Itoa(argCount)
		args = append(args, category)
	}

	if search != "" {
		argCount++
		query += ` AND (question ILIKE $` + strconv.Itoa(argCount) + ` OR answer ILIKE $` + strconv.Itoa(argCount) + `)`
		args = append(args, "%"+search+"%")
	}

	query += ` ORDER BY created_at DESC`

	rows, err := config.DB.Query(context.Background(), query, args...)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	faqs := []models.FAQ{}
	for rows.Next() {
		var faq models.FAQ
		err := rows.Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.Views, &faq.CreatedAt, &faq.UpdatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		faqs = append(faqs, faq)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(faqs)
}

// GetFAQ returns a single FAQ by ID
func GetFAQ(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var faq models.FAQ
	err := config.DB.QueryRow(context.Background(),
		`SELECT id, question, answer, COALESCE(category, '') as category, views, created_at, updated_at FROM faqs WHERE id = $1`,
		id,
	).Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.Views, &faq.CreatedAt, &faq.UpdatedAt)

	if err != nil {
		http.Error(w, "FAQ not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(faq)
}

// CreateFAQ creates a new FAQ
func CreateFAQ(w http.ResponseWriter, r *http.Request) {
	var req models.CreateFAQRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Question == "" || req.Answer == "" {
		http.Error(w, "Question and answer are required", http.StatusBadRequest)
		return
	}

	var faq models.FAQ
	err := config.DB.QueryRow(context.Background(),
		`INSERT INTO faqs (question, answer, category) VALUES ($1, $2, $3)
		 RETURNING id, question, answer, COALESCE(category, '') as category, views, created_at, updated_at`,
		req.Question, req.Answer, nullIfEmpty(req.Category),
	).Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.Views, &faq.CreatedAt, &faq.UpdatedAt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Generate embedding in background
	go func() {
		if err := faqGeminiService.UpdateFAQEmbedding(context.Background(), faq.ID, faq.Question, faq.Answer); err != nil {
			fmt.Printf("Failed to generate embedding for FAQ %d: %v\n", faq.ID, err)
		}
	}()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(faq)
}

// UpdateFAQ updates an existing FAQ
func UpdateFAQ(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req models.UpdateFAQRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var faq models.FAQ
	err := config.DB.QueryRow(context.Background(),
		`UPDATE faqs SET question = $1, answer = $2, category = $3 WHERE id = $4
		 RETURNING id, question, answer, COALESCE(category, '') as category, views, created_at, updated_at`,
		req.Question, req.Answer, nullIfEmpty(req.Category), id,
	).Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.Views, &faq.CreatedAt, &faq.UpdatedAt)

	if err != nil {
		http.Error(w, "FAQ not found", http.StatusNotFound)
		return
	}

	// Regenerate embedding in background
	go func() {
		if err := faqGeminiService.UpdateFAQEmbedding(context.Background(), faq.ID, faq.Question, faq.Answer); err != nil {
			fmt.Printf("Failed to regenerate embedding for FAQ %d: %v\n", faq.ID, err)
		}
	}()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(faq)
}

// DeleteFAQ deletes a FAQ
func DeleteFAQ(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	result, err := config.DB.Exec(context.Background(), `DELETE FROM faqs WHERE id = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, "FAQ not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// IncrementFAQView increments the view count
func IncrementFAQView(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	result, err := config.DB.Exec(context.Background(),
		`UPDATE faqs SET views = views + 1 WHERE id = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, "FAQ not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "View count incremented"})
}

// nullIfEmpty returns nil for empty strings (for nullable columns)
func nullIfEmpty(s string) interface{} {
	if s == "" {
		return nil
	}
	return s
}
