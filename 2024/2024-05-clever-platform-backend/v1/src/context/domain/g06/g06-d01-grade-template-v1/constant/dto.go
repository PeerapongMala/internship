package constant

type GradeTemplateWithSubject struct {
	Template        GradeTemplateEntity               `json:"template"`
	GeneralTemplate []TemplateGeneralEvaluationEntity `json:"general_templates"`
	Subject         []SubjectEntity                   `json:"subjects"`
}

type GradeSubjectWithIndicator struct {
	SubjectId               int                       `json:"subject_id"`
	SubjectName             string                    `json:"subject_name"`
	CleverSubjectTemplateId *int                      `json:"clever_subject_template_id"`
	Indicators              []TemplateIndicatorEntity `json:"indicator"`
}

type GradeIndicatorWithAssesmentSetting struct {
	IndicatorId         int                               `json:"indicator_id"`
	IndicatorName       string                            `json:"indicator_name"`
	MaxValue            float64                           `json:"total_value"`
	ScoreEvaluationType string                            `json:"score_evaluation_type"`
	CleverLessonId      *int                              `json:"clever_lesson_id"`
	CleverSubLessonId   *int                              `json:"clever_sub_lesson_id"`
	AssementSettings    []TemplateAssessmentSettingEntity `json:"data"`
}

type GeneralTemplateDropDown struct {
	TemplateType string                           `json:"template_type"`
	Template     []*GeneralTemplateDropDownDetail `json:"template"`
}

type GeneralTemplateDropDownDetail struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Status     string `json:"status"`
	ActiveFlag bool   `json:"active_flag"`
}
