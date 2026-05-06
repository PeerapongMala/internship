package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"dental-plus-api/config"
	"dental-plus-api/handlers"
	"dental-plus-api/middleware"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	godotenv.Load()

	// Connect to database
	if err := config.ConnectDatabase(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer config.CloseDatabase()

	// Create router
	r := chi.NewRouter()

	// Middleware
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(middleware.CORS)

	// API routes
	r.Route("/api", func(r chi.Router) {
		// FAQs
		r.Route("/faqs", func(r chi.Router) {
			r.Get("/", handlers.GetFAQs)
			r.Post("/", handlers.CreateFAQ)
			r.Get("/{id}", handlers.GetFAQ)
			r.Put("/{id}", handlers.UpdateFAQ)
			r.Delete("/{id}", handlers.DeleteFAQ)
			r.Post("/{id}/view", handlers.IncrementFAQView)
		})

		// Chat Questions
		r.Route("/chat-questions", func(r chi.Router) {
			r.Get("/", handlers.GetChatQuestions)
			r.Post("/", handlers.CreateChatQuestion)
			r.Delete("/", handlers.BulkDeleteChatQuestions)
			r.Delete("/{id}", handlers.DeleteChatQuestion)
		})

		// Categories
		r.Route("/categories", func(r chi.Router) {
			r.Get("/", handlers.GetCategories)
			r.Post("/", handlers.CreateCategory)
			r.Delete("/{id}", handlers.DeleteCategory)
		})

		// Settings
		r.Get("/settings", handlers.GetSettings)
		r.Put("/settings", handlers.UpdateSettings)

		// AI Chat
		r.Post("/chat", handlers.HandleChat)
		r.Post("/embeddings/generate", handlers.GenerateEmbeddings)
	})

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// Get port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
