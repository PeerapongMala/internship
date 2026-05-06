package constant

type GradeEvaluationAdditionalPersonData struct {
	Id              *int                                   `json:"id"`
	Type            *string                                `json:"type"`
	Name            *string                                `json:"name"`
	CleverSubjectId *int                                   `json:"clever_subject_id"`
	PersonData      []AdditionalPersonWithPersonDataEntity `json:"person_data"`
}
