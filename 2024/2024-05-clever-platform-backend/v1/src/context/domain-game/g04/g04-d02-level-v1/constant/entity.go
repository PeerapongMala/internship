package constant

type LevelWithDataEntity struct {
	LevelId       *int    `json:"level_id" db:"level_id"`
	Index         *int    `json:"index" db:"index"`
	LevelType     *string `json:"level_type" db:"level_type"`
	Difficulty    *string `json:"difficulty" db:"difficulty"`
	LockNextLevel *bool   `json:"lock_next_level" db:"lock_next_level"`
	IsUnlocked    *bool   `json:"is_unlocked" db:"is_unlocked"`
	TimerType     *string `json:"timer_type" db:"timer_type"`
	TimerTime     *int    `json:"timer_time" db:"timer_time"`
	BloomType     *int    `json:"bloom_type" db:"bloom_type"`
	Star          *int    `json:"star" db:"star"`
	TimeUsed      *int    `json:"time_used" db:"time_used"`
	QuestionCount *int    `json:"question_count" db:"question_count"`
}

type InventoryEntity struct {
	Id         *int    `json:"id" db:"id"`
	StudentId  *string `json:"student_id" db:"student_id"`
	GoldCoin   *int    `json:"gold_coin" db:"gold_coin"`
	ArcadeCoin *int    `json:"arcade_coin" db:"arcade_coin"`
	Ice        *int    `json:"ice" db:"ice"`
}

type HomeWorkListByUserDataEntity struct {
	HomeworkId         *int    `json:"homework_id" db:"homework_id"`
	SubjectId          *int    `json:"subject_id" db:"subject_id"`
	HomeworkTemplateId *int    `json:"homework_template_id" db:"homework_template_id"`
	HomeWorkName       *string `json:"home_work_name" db:"home_work_name"`
	DueAt              *string `json:"due_at" db:"due_at"`
	ClosedAt           *string `json:"closed_at" db:"closed_at"`
}

type StudentDataEntity struct {
	ClassId        *int    `json:"class_id" db:"class_id"`
	StudentGroupId *int    `json:"student_group_id" db:"student_group_id"`
	YearName       *string `json:"year_name" db:"year_name"`
}

type SpecialRewardWithDataEntity struct {
	LevelSpecialRewardId *int    `json:"level_special_reward_id" db:"level_special_reward_id"`
	Amount               *int    `json:"amount" db:"amount"`
	Type                 *string `json:"type" db:"type"`
	Name                 *string `json:"name" db:"name"`
	Description          *string `json:"description" db:"description"`
	ImageUrl             *string `json:"image_url" db:"image_url"`
	TemplatePath         *string `json:"template_url" db:"template_path"`
	BadgeDescription     *string `json:"badge_description" db:"badge_description"`
	ReceivedAt           *string `json:"received_at" db:"received_at"`
	ReceivedStatus       bool    `json:"received_status"`
	LessonId             *int    `json:"lesson_id" db:"lesson_id"`
	LessonName           *string `json:"lesson_name" db:"lesson_name"`
	SubLessonId          *int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName        *string `json:"sub_lesson_name" db:"sub_lesson_name"`
	LevelId              *int    `json:"level_id" db:"level_id"`
	LeveIndex            *int    `json:"level_index" db:"level_index"`
}

type LeaderBoardDataEntity struct {
	No           int     `json:"no" db:"global_rank"`
	LevelId      *int    `json:"level_id" db:"level_id"`
	UserId       *string `json:"user_id" db:"user_id"`
	UserName     *string `json:"user_name" db:"user_name"`
	UserImageUrl *string `json:"user_image_url" db:"user_image_url"`
	Star         *int    `json:"star" db:"star"`
	TimeUsed     *int    `json:"time_used" db:"time_used"`
	MeFlag       bool    `json:"me_flag"`
}

type StudentDataDetailEntity struct {
	ClassId             *int `json:"class_id" db:"class_id"`
	SchoolId            *int `json:"school_id" db:"school_id"`
	SchoolAffiliationId *int `json:"school_affiliation_id" db:"school_affiliation_id"`
}

type GameRewardEntity struct {
	StarRequired *int `db:"star_required"`
	GoldCoin     *int `db:"gold_coin"`
	ArcadeCoin   *int `db:"arcade_coin"`
}

type LastPlayLevelEntity struct {
	LevelId     int `json:"level_id" db:"level_id"`
	SubLessonId int `json:"sub_lesson_id" db:"sub_lesson_id"`
	LessonId    int `json:"lesson_id" db:"lesson_id"`
	SubjectId   int `json:"subject_id" db:"subject_id"`
}
