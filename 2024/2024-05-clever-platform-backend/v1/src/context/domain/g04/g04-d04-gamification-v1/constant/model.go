package constant

type LevelRewardFilter struct {
	SeedSubjectGroupId int    `query:"seed_subject_group_id"`
	LevelType          string `query:"level_type"`
}

type LevelFilter struct {
	Id                int    `query:"id"`
	RewardAmount      *int   `query:"reward_amount"`
	CurriculumGroupId int    `query:"curriculum_group_id"`
	PlatformId        int    `query:"platform_id"`
	YearId            int    `query:"year_id"`
	SubjectGroupId    int    `query:"subject_group_id"`
	SubjectId         int    `query:"subject_id"`
	LessonId          int    `query:"lesson_id"`
	SubLessonId       int    `query:"sub_lesson_id"`
	Status            string `query:"status"`
}

type SubjectFilter struct {
	SubjectGroupId int `query:"subject_group_id"`
}

type LessonFilter struct {
	SubjectId int `query:"subject_id"`
}

type SubLessonFilter struct {
	LessonId int `query:"lesson_id"`
}

type ItemFilter struct {
	Type string `query:"type"`
}

type LevelSpecialRewardItemFilter struct {
	LevelId     int    `params:"levelId" validate:"required"`
	ItemId      int    `query:"item_id"`
	Type        string `query:"type"`
	Description string `query:"description"`
	Amount      int    `query:"amount"`
	Name        string `query:"name"`
}
