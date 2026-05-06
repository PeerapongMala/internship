package constant

type OptionTypeEnum string

const (
	OptionTypeEnum_AcademicYear OptionTypeEnum = "academic-year"
	// OptionTypeEnum_CurriculumGroup OptionTypeEnum = "curriculum-group"
	// OptionTypeEnum_SeedYear        OptionTypeEnum = "seed-year"
	OptionTypeEnum_Subject   OptionTypeEnum = "subject"
	OptionTypeEnum_Lesson    OptionTypeEnum = "lesson"
	OptionTypeEnum_SubLesson OptionTypeEnum = "sub-lesson"
	// OptionTypeEnum_Level           OptionTypeEnum = "level"
)

func (s OptionTypeEnum) IsValid() bool {
	switch s {
	case
		OptionTypeEnum_AcademicYear,
		// OptionTypeEnum_CurriculumGroup,
		// OptionTypeEnum_SeedYear,
		OptionTypeEnum_Subject,
		OptionTypeEnum_Lesson,
		OptionTypeEnum_SubLesson:
		// OptionTypeEnum_Level:
		return true
	}

	return false
}
