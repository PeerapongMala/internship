package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"dental-plus-api/config"
	"dental-plus-api/models"

	"github.com/go-chi/chi/v5"
)

// GetCategories returns all categories
func GetCategories(w http.ResponseWriter, r *http.Request) {
	rows, err := config.DB.Query(context.Background(),
		`SELECT id, name FROM faq_categories ORDER BY name`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	categories := []models.Category{}
	for rows.Next() {
		var c models.Category
		err := rows.Scan(&c.ID, &c.Name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, c)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

// CreateCategory creates a new category
func CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req models.CreateCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.ID == "" || req.Name == "" {
		http.Error(w, "ID and name are required", http.StatusBadRequest)
		return
	}

	_, err := config.DB.Exec(context.Background(),
		`INSERT INTO faq_categories (id, name) VALUES ($1, $2)`,
		req.ID, req.Name)
	if err != nil {
		http.Error(w, "Category already exists or invalid data", http.StatusConflict)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.Category{ID: req.ID, Name: req.Name})
}

// DeleteCategory deletes a category
func DeleteCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	result, err := config.DB.Exec(context.Background(), `DELETE FROM faq_categories WHERE id = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		http.Error(w, "Category not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
