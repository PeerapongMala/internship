package constant

type StudentScoreDataList []StudentScoreData

type StudentScoreData struct {
	EvaluationStudentID  int                    `json:"evaluation_student_id" db:"evaluation_student_id" validate:"required"`
	StudentIndicatorData []StudentIndicatorData `json:"student_indicator_data" db:"-" validate:"required,dive,required"`
}

type StudentIndicatorData struct {
	IndicatorID          *int    `json:"indicator_id" db:"indicator_id" validate:"required"`
	IndicatorGeneralName *string `json:"indicator_general_name" db:"indicator_general_name"`
	Value                float64 `json:"value,omitempty" db:"value" validate:"required"`
}
