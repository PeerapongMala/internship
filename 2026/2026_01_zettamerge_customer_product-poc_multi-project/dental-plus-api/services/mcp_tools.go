package services

import (
	"context"
	"fmt"
	"time"

	"dental-plus-api/config"
)

// MCPTools provides functions for dynamic data access
type MCPTools struct{}

// NewMCPTools creates a new MCP tools instance
func NewMCPTools() *MCPTools {
	return &MCPTools{}
}

// DoctorSchedule represents a doctor's schedule
type DoctorSchedule struct {
	DoctorName  string `json:"doctor_name"`
	Branch      string `json:"branch"`
	DayOfWeek   int    `json:"day_of_week"`
	DayName     string `json:"day_name"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
	IsAvailable bool   `json:"is_available"`
}

// Promotion represents a promotion
type Promotion struct {
	ID              int    `json:"id"`
	Title           string `json:"title"`
	Description     string `json:"description"`
	DiscountPercent int    `json:"discount_percent"`
	StartDate       string `json:"start_date"`
	EndDate         string `json:"end_date"`
}

// GetDoctorSchedule gets doctor schedules
func (m *MCPTools) GetDoctorSchedule(ctx context.Context, doctorName string, branch string) ([]DoctorSchedule, error) {
	dayNames := []string{"อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"}

	query := `
		SELECT doctor_name, branch, day_of_week, start_time, end_time, is_available
		FROM doctor_schedules
		WHERE is_available = true
	`
	args := []interface{}{}
	argCount := 0

	if doctorName != "" {
		argCount++
		query += fmt.Sprintf(" AND doctor_name ILIKE $%d", argCount)
		args = append(args, "%"+doctorName+"%")
	}

	if branch != "" {
		argCount++
		query += fmt.Sprintf(" AND branch ILIKE $%d", argCount)
		args = append(args, "%"+branch+"%")
	}

	query += " ORDER BY doctor_name, day_of_week"

	rows, err := config.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query schedules: %w", err)
	}
	defer rows.Close()

	var schedules []DoctorSchedule
	for rows.Next() {
		var s DoctorSchedule
		var startTime, endTime time.Time
		if err := rows.Scan(&s.DoctorName, &s.Branch, &s.DayOfWeek, &startTime, &endTime, &s.IsAvailable); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		s.StartTime = startTime.Format("15:04")
		s.EndTime = endTime.Format("15:04")
		s.DayName = dayNames[s.DayOfWeek]
		schedules = append(schedules, s)
	}

	return schedules, nil
}

// GetActivePromotions gets active promotions
func (m *MCPTools) GetActivePromotions(ctx context.Context) ([]Promotion, error) {
	rows, err := config.DB.Query(ctx, `
		SELECT id, title, description, discount_percent, start_date, end_date
		FROM promotions
		WHERE is_active = true
		  AND (start_date IS NULL OR start_date <= CURRENT_DATE)
		  AND (end_date IS NULL OR end_date >= CURRENT_DATE)
		ORDER BY discount_percent DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("failed to query promotions: %w", err)
	}
	defer rows.Close()

	var promos []Promotion
	for rows.Next() {
		var p Promotion
		var startDate, endDate *time.Time
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.DiscountPercent, &startDate, &endDate); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		if startDate != nil {
			p.StartDate = startDate.Format("2006-01-02")
		}
		if endDate != nil {
			p.EndDate = endDate.Format("2006-01-02")
		}
		promos = append(promos, p)
	}

	return promos, nil
}

// GetBranchInfo gets branch information
func (m *MCPTools) GetBranchInfo(ctx context.Context, branchName string) (map[string]interface{}, error) {
	// Hardcoded branch info for now (can be moved to DB later)
	branches := map[string]map[string]interface{}{
		"สาขาสยาม": {
			"name":         "สาขาสยาม",
			"address":      "ชั้น 4 สยามพารากอน ถนนพระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330",
			"phone":        "02-610-9999",
			"opening_hours": "10:00 - 21:00 น.",
			"services":     []string{"ทันตกรรมทั่วไป", "จัดฟัน", "รากฟันเทียม", "ฟอกสีฟัน"},
		},
		"สาขาทองหล่อ": {
			"name":         "สาขาทองหล่อ",
			"address":      "ซอยทองหล่อ 10 ถนนสุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
			"phone":        "02-392-9999",
			"opening_hours": "09:00 - 20:00 น.",
			"services":     []string{"ทันตกรรมทั่วไป", "จัดฟัน", "ผ่าฟันคุด", "อุดฟัน"},
		},
		"สาขาเซ็นทรัลลาดพร้าว": {
			"name":         "สาขาเซ็นทรัลลาดพร้าว",
			"address":      "ชั้น 3 เซ็นทรัลลาดพร้าว ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900",
			"phone":        "02-937-9999",
			"opening_hours": "10:00 - 21:00 น.",
			"services":     []string{"ทันตกรรมทั่วไป", "จัดฟัน", "ฟอกสีฟัน", "ครอบฟัน"},
		},
	}

	if branchName != "" {
		for name, info := range branches {
			if name == branchName {
				return info, nil
			}
		}
		return nil, fmt.Errorf("branch not found: %s", branchName)
	}

	// Return all branches
	result := map[string]interface{}{
		"branches": branches,
	}
	return result, nil
}

// GetToolDeclarations returns the MCP tool declarations for Gemini
func (m *MCPTools) GetToolDeclarations() []FunctionDeclaration {
	return []FunctionDeclaration{
		{
			Name:        "get_doctor_schedule",
			Description: "ดึงข้อมูลตารางเวลาทำงานของหมอฟัน สามารถระบุชื่อหมอหรือสาขาได้",
			Parameters: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"doctor_name": map[string]interface{}{
						"type":        "string",
						"description": "ชื่อหมอที่ต้องการค้นหา (ไม่จำเป็นต้องระบุ)",
					},
					"branch": map[string]interface{}{
						"type":        "string",
						"description": "ชื่อสาขาที่ต้องการค้นหา เช่น สาขาสยาม, สาขาทองหล่อ (ไม่จำเป็นต้องระบุ)",
					},
				},
			},
		},
		{
			Name:        "get_promotions",
			Description: "ดึงข้อมูลโปรโมชั่นที่กำลังใช้งานอยู่",
			Parameters: map[string]interface{}{
				"type":       "object",
				"properties": map[string]interface{}{},
			},
		},
		{
			Name:        "get_branch_info",
			Description: "ดึงข้อมูลสาขา เช่น ที่อยู่ เบอร์โทร เวลาเปิด-ปิด",
			Parameters: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"branch_name": map[string]interface{}{
						"type":        "string",
						"description": "ชื่อสาขาที่ต้องการข้อมูล (ไม่ระบุ = ทุกสาขา)",
					},
				},
			},
		},
		{
			Name:        "search_faq",
			Description: "ค้นหาคำถามที่พบบ่อย (FAQ) ที่เกี่ยวข้องกับคำถามของลูกค้า",
			Parameters: map[string]interface{}{
				"type": "object",
				"properties": map[string]interface{}{
					"query": map[string]interface{}{
						"type":        "string",
						"description": "คำถามหรือคำค้นหา",
					},
				},
				"required": []string{"query"},
			},
		},
	}
}
