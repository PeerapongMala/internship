package constant

type StudentScoreDataList []StudentScoreData

type StudentScoreData struct {
	EvaluationStudentID  int                    `json:"evaluation_student_id" db:"evaluation_student_id" validate:"required"`
	StudentIndicatorData []StudentIndicatorData `json:"student_indicator_data" db:"-" validate:"required,dive,required"`
	AdditionalFields     map[string]interface{} `json:"additional_fields,omitempty" db:"additional_fields"`
}

type StudentIndicatorData struct {
	IndicatorID          *int                   `json:"indicator_id" db:"indicator_id"`
	IndicatorGeneralName *string                `json:"indicator_general_name" db:"indicator_general_name"`
	Value                any                    `json:"value" db:"value" validate:"required"`
	AdditionalFields     map[string]interface{} `json:"additional_fields,omitempty" db:"additional_fields"`
}
