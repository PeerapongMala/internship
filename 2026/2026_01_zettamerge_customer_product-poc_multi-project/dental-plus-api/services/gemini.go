package services

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"dental-plus-api/config"
)

const (
	GeminiEmbeddingURL = "https://generativelanguage.googleapis.com/v1/models/text-embedding-004:embedContent"
	GeminiChatURL      = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
)

// EmbeddingRequest represents request to Gemini embedding API
type EmbeddingRequest struct {
	Content struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"content"`
}

// EmbeddingResponse represents response from Gemini embedding API
type EmbeddingResponse struct {
	Embedding struct {
		Values []float32 `json:"values"`
	} `json:"embedding"`
}

// ChatRequest represents request to Gemini chat API
type ChatRequest struct {
	Contents       []ChatContent  `json:"contents"`
	SystemInstruct *SystemInstruct `json:"systemInstruction,omitempty"`
	Tools          []Tool         `json:"tools,omitempty"`
}

type SystemInstruct struct {
	Parts []ContentPart `json:"parts"`
}

type ChatContent struct {
	Role  string        `json:"role"`
	Parts []ContentPart `json:"parts"`
}

type ContentPart struct {
	Text         string        `json:"text,omitempty"`
	FunctionCall *FunctionCall `json:"functionCall,omitempty"`
	FunctionResponse *FunctionResponse `json:"functionResponse,omitempty"`
}

type FunctionCall struct {
	Name string                 `json:"name"`
	Args map[string]interface{} `json:"args"`
}

type FunctionResponse struct {
	Name     string      `json:"name"`
	Response interface{} `json:"response"`
}

type Tool struct {
	FunctionDeclarations []FunctionDeclaration `json:"functionDeclarations"`
}

type FunctionDeclaration struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters,omitempty"`
}

// ChatResponse represents response from Gemini chat API
type ChatResponse struct {
	Candidates []struct {
		Content struct {
			Parts []ContentPart `json:"parts"`
			Role  string        `json:"role"`
		} `json:"content"`
		FinishReason string `json:"finishReason"`
	} `json:"candidates"`
}

// GeminiService handles Gemini API calls
type GeminiService struct {
	apiKey string
}

// NewGeminiService creates a new Gemini service
func NewGeminiService() *GeminiService {
	return &GeminiService{
		apiKey: os.Getenv("GEMINI_API_KEY"),
	}
}

// GetEmbedding generates embedding for text using Gemini
func (s *GeminiService) GetEmbedding(ctx context.Context, text string) ([]float32, error) {
	reqBody := EmbeddingRequest{}
	reqBody.Content.Parts = []struct {
		Text string `json:"text"`
	}{{Text: text}}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	url := fmt.Sprintf("%s?key=%s", GeminiEmbeddingURL, s.apiKey)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s", string(body))
	}

	var embResp EmbeddingResponse
	if err := json.Unmarshal(body, &embResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return embResp.Embedding.Values, nil
}

// SearchSimilarFAQs searches for similar FAQs using vector search
func (s *GeminiService) SearchSimilarFAQs(ctx context.Context, query string, limit int) ([]FAQ, error) {
	// Generate embedding for the query
	queryEmbedding, err := s.GetEmbedding(ctx, query)
	if err != nil {
		// Fallback to text search if embedding fails
		return s.searchFAQsTextFallback(ctx, query, limit)
	}

	// Convert embedding to PostgreSQL array format
	embStr := make([]string, len(queryEmbedding))
	for i, v := range queryEmbedding {
		embStr[i] = fmt.Sprintf("%f", v)
	}
	embArray := "[" + strings.Join(embStr, ",") + "]"

	// Search using vector similarity (cosine distance)
	rows, err := config.DB.Query(ctx, `
		SELECT id, question, answer, COALESCE(category, '') as category, views,
			   1 - (embedding <=> $1::vector) as similarity
		FROM faqs
		WHERE embedding IS NOT NULL
		ORDER BY embedding <=> $1::vector
		LIMIT $2
	`, embArray, limit)
	if err != nil {
		// Fallback to text search if vector search fails
		return s.searchFAQsTextFallback(ctx, query, limit)
	}
	defer rows.Close()

	var faqs []FAQ
	for rows.Next() {
		var faq FAQ
		if err := rows.Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.Views, &faq.Similarity); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		faqs = append(faqs, faq)
	}

	// If no results with embeddings, fallback to text search
	if len(faqs) == 0 {
		return s.searchFAQsTextFallback(ctx, query, limit)
	}

	return faqs, nil
}

// searchFAQsTextFallback searches FAQs using text search as fallback
func (s *GeminiService) searchFAQsTextFallback(ctx context.Context, query string, limit int) ([]FAQ, error) {
	searchQuery := "%" + strings.ToLower(query) + "%"

	rows, err := config.DB.Query(ctx, `
		SELECT id, question, answer, COALESCE(category, '') as category, views
		FROM faqs
		WHERE LOWER(question) LIKE $1 OR LOWER(answer) LIKE $1
		ORDER BY
			CASE WHEN LOWER(question) LIKE $1 THEN 0 ELSE 1 END,
			views DESC
		LIMIT $2
	`, searchQuery, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to search FAQs: %w", err)
	}
	defer rows.Close()

	var faqs []FAQ
	for rows.Next() {
		var faq FAQ
		if err := rows.Scan(&faq.ID, &faq.Question, &faq.Answer, &faq.Category, &faq.Views); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		faq.Similarity = 0.5 // Lower similarity for text search fallback
		faqs = append(faqs, faq)
	}

	return faqs, nil
}

// FAQ represents FAQ with similarity score
type FAQ struct {
	ID         int     `json:"id"`
	Question   string  `json:"question"`
	Answer     string  `json:"answer"`
	Category   string  `json:"category"`
	Views      int     `json:"views"`
	Similarity float64 `json:"similarity,omitempty"`
}

// Chat sends a message to Gemini and returns the response
func (s *GeminiService) Chat(ctx context.Context, messages []ChatContent, systemPrompt string, tools []Tool) (*ChatResponse, error) {
	reqBody := ChatRequest{
		Contents: messages,
		Tools:    tools,
	}

	if systemPrompt != "" {
		reqBody.SystemInstruct = &SystemInstruct{
			Parts: []ContentPart{{Text: systemPrompt}},
		}
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	url := fmt.Sprintf("%s?key=%s", GeminiChatURL, s.apiKey)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error: %s", string(body))
	}

	var chatResp ChatResponse
	if err := json.Unmarshal(body, &chatResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &chatResp, nil
}

// UpdateFAQEmbedding updates the embedding for a FAQ
func (s *GeminiService) UpdateFAQEmbedding(ctx context.Context, faqID int, question, answer string) error {
	// Combine question and answer for better embedding
	text := fmt.Sprintf("คำถาม: %s\nคำตอบ: %s", question, answer)

	embedding, err := s.GetEmbedding(ctx, text)
	if err != nil {
		return fmt.Errorf("failed to get embedding: %w", err)
	}

	// Convert embedding to PostgreSQL array format
	embStr := make([]string, len(embedding))
	for i, v := range embedding {
		embStr[i] = fmt.Sprintf("%f", v)
	}
	embArray := "[" + strings.Join(embStr, ",") + "]"

	_, err = config.DB.Exec(ctx, `
		UPDATE faqs SET embedding = $1::vector WHERE id = $2
	`, embArray, faqID)
	if err != nil {
		return fmt.Errorf("failed to update embedding: %w", err)
	}

	return nil
}
