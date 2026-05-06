package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"dental-plus-api/config"
	"dental-plus-api/services"
)

var (
	geminiService *services.GeminiService
	mcpTools      *services.MCPTools
	initOnce      sync.Once
)

func initServices() {
	initOnce.Do(func() {
		geminiService = services.NewGeminiService()
		mcpTools = services.NewMCPTools()
	})
}

const systemPrompt = `คุณเป็นผู้ช่วยของ Dental Plus คลินิกทันตกรรม คุณมีหน้าที่ตอบคำถามลูกค้าเกี่ยวกับ:
- บริการทันตกรรม (จัดฟัน, ถอนฟัน, ขูดหินปูน, ฟอกสีฟัน ฯลฯ)
- ราคาค่าบริการ
- ตารางหมอและการนัดหมาย
- โปรโมชั่นและส่วนลด
- ข้อมูลสาขา

กฎการตอบ:
1. ตอบเป็นภาษาไทยที่สุภาพ ใช้คำว่า "ค่ะ" หรือ "ครับ" ลงท้าย
2. ถ้าต้องการข้อมูลแบบ dynamic ให้ใช้ tools ที่มีให้
3. ถ้าคำถามเกี่ยวกับ FAQ ให้ใช้ search_faq เพื่อค้นหาคำตอบ
4. ถ้าข้อมูลซับซ้อนมาก ให้แนะนำลูกค้าดูข้อมูลเพิ่มเติมที่เว็บไซต์
5. ตอบสั้นกระชับ ไม่เกิน 3-4 ประโยค
6. ถ้าไม่แน่ใจ ให้แนะนำติดต่อเจ้าหน้าที่

ลิงก์สำคัญ:
- FAQ ทั้งหมด: /faq-all
- นัดหมาย: /booking
- ราคาบริการ: /price-list`

// ChatRequest represents a chat request
type ChatMessageRequest struct {
	SessionID string `json:"session_id"`
	Message   string `json:"message"`
}

// ChatMessageResponse represents a chat response
type ChatMessageResponse struct {
	Response  string                   `json:"response"`
	Sources   []map[string]interface{} `json:"sources,omitempty"`
	ToolsUsed []string                 `json:"tools_used,omitempty"`
}

// HandleChat handles AI chat requests
func HandleChat(w http.ResponseWriter, r *http.Request) {
	initServices()

	var req ChatMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Message == "" {
		http.Error(w, "Message is required", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	// Build tools
	tools := []services.Tool{
		{FunctionDeclarations: mcpTools.GetToolDeclarations()},
	}

	// Build messages
	messages := []services.ChatContent{
		{
			Role: "user",
			Parts: []services.ContentPart{
				{Text: req.Message},
			},
		},
	}

	// Call Gemini
	resp, err := geminiService.Chat(ctx, messages, systemPrompt, tools)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to call Gemini: %v", err), http.StatusInternalServerError)
		return
	}

	// Process response
	response, toolsUsed, sources, err := processGeminiResponse(ctx, resp, messages)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to process response: %v", err), http.StatusInternalServerError)
		return
	}

	// Return response
	chatResp := ChatMessageResponse{
		Response:  response,
		ToolsUsed: toolsUsed,
		Sources:   sources,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(chatResp)
}

// processGeminiResponse processes Gemini response and handles tool calls
func processGeminiResponse(ctx context.Context, resp *services.ChatResponse, messages []services.ChatContent) (string, []string, []map[string]interface{}, error) {
	if len(resp.Candidates) == 0 {
		return "ขออภัยค่ะ ไม่สามารถประมวลผลได้ในขณะนี้", nil, nil, nil
	}

	candidate := resp.Candidates[0]
	var toolsUsed []string
	var sources []map[string]interface{}

	// Check for function calls
	for _, part := range candidate.Content.Parts {
		if part.FunctionCall != nil {
			// Execute function call
			toolsUsed = append(toolsUsed, part.FunctionCall.Name)
			result, err := executeFunctionCall(ctx, part.FunctionCall)
			if err != nil {
				fmt.Printf("Function call error: %v\n", err)
				continue
			}

			// Add source
			sources = append(sources, map[string]interface{}{
				"tool":   part.FunctionCall.Name,
				"result": result,
			})

			// Add function response to messages and call Gemini again
			messages = append(messages, services.ChatContent{
				Role: "model",
				Parts: []services.ContentPart{
					{FunctionCall: part.FunctionCall},
				},
			})
			messages = append(messages, services.ChatContent{
				Role: "user",
				Parts: []services.ContentPart{
					{FunctionResponse: &services.FunctionResponse{
						Name:     part.FunctionCall.Name,
						Response: result,
					}},
				},
			})

			// Call Gemini again with function result
			resp2, err := geminiService.Chat(ctx, messages, systemPrompt, nil)
			if err != nil {
				return "", toolsUsed, sources, err
			}

			if len(resp2.Candidates) > 0 && len(resp2.Candidates[0].Content.Parts) > 0 {
				return resp2.Candidates[0].Content.Parts[0].Text, toolsUsed, sources, nil
			}
		}

		// Return text response
		if part.Text != "" {
			return part.Text, toolsUsed, sources, nil
		}
	}

	return "ขออภัยค่ะ ไม่สามารถประมวลผลได้ในขณะนี้", toolsUsed, sources, nil
}

// executeFunctionCall executes a function call
func executeFunctionCall(ctx context.Context, fc *services.FunctionCall) (interface{}, error) {
	switch fc.Name {
	case "get_doctor_schedule":
		doctorName, _ := fc.Args["doctor_name"].(string)
		branch, _ := fc.Args["branch"].(string)
		return mcpTools.GetDoctorSchedule(ctx, doctorName, branch)

	case "get_promotions":
		return mcpTools.GetActivePromotions(ctx)

	case "get_branch_info":
		branchName, _ := fc.Args["branch_name"].(string)
		return mcpTools.GetBranchInfo(ctx, branchName)

	case "search_faq":
		query, _ := fc.Args["query"].(string)
		if query == "" {
			return nil, fmt.Errorf("query is required")
		}
		return geminiService.SearchSimilarFAQs(ctx, query, 3)

	default:
		return nil, fmt.Errorf("unknown function: %s", fc.Name)
	}
}

// GenerateEmbeddings generates embeddings for all FAQs
func GenerateEmbeddings(w http.ResponseWriter, r *http.Request) {
	initServices()
	ctx := r.Context()

	// Get all FAQs without embeddings
	rows, err := config.DB.Query(ctx, `
		SELECT id, question, answer FROM faqs WHERE embedding IS NULL
	`)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query FAQs: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type faqItem struct {
		ID       int
		Question string
		Answer   string
	}

	var faqs []faqItem
	for rows.Next() {
		var f faqItem
		if err := rows.Scan(&f.ID, &f.Question, &f.Answer); err != nil {
			http.Error(w, fmt.Sprintf("Failed to scan row: %v", err), http.StatusInternalServerError)
			return
		}
		faqs = append(faqs, f)
	}

	// Generate embeddings
	updated := 0
	for _, f := range faqs {
		if err := geminiService.UpdateFAQEmbedding(ctx, f.ID, f.Question, f.Answer); err != nil {
			fmt.Printf("Failed to update embedding for FAQ %d: %v\n", f.ID, err)
			continue
		}
		updated++
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": fmt.Sprintf("Updated %d/%d FAQ embeddings", updated, len(faqs)),
	})
}
