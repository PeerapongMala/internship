package constant

import "time"

type Porphor6DataResponse struct {
	ID               int                    `json:"id"`
	LearningAreaName *string                `json:"learning_area_name,omitempty"`
	StudentID        *string                `json:"student_id,omitempty"`
	DataJSON         map[string]interface{} `json:"data_json"`
	CreatedAt        time.Time              `json:"created_at"`
}

type Porphor6ListResponse struct {
	ID               int                    `json:"id"`
	LearningAreaName *string                `json:"learning_area_name,omitempty"`
	StudentID        *string                `json:"student_id,omitempty"`
	Title            *string                `json:"title,omitempty"`
	FirstName        *string                `json:"first_name,omitempty"`
	LastName         *string                `json:"last_name,omitempty"`
	DataJSON         map[string]interface{} `json:"data_json"`
	CreatedAt        time.Time              `json:"created_at"`
}
