package constant

type StudentData struct {
	StudentGroupId []int    `json:"student_group_id"`
	ClassId        []int    `json:"class_id"`
	YearName       []string `json:"year_name"`
}

type GameLevelResponse struct {
	Id            *int         `json:"id"`
	Level         *int         `json:"level"`
	Difficulty    *string      `json:"difficulty"`
	QuestionCount *int         `json:"question_count"`
	Star          *int         `json:"star"`
	TimeUsed      *int         `json:"time_used"`
	Status        *string      `json:"status"`
	GameReward    []GameReward `json:"game_reward"`
	ArcadeCoin    string       `json:"arcade_coin" db:"arcade_coin"`
	GoldCoin      string       `json:"gold_coin" db:"gold_coin"`
}

type GameReward struct {
	Id               *int    `json:"id" db:"id"`
	Type             *string `json:"type" db:"type"`
	Name             *string `json:"name" db:"name"`
	Description      *string `json:"description" db:"description"`
	ImageUrl         *string `json:"image_url" db:"image_url"`
	TemplatePath     *string `json:"template_path" db:"template_path"`
	BadgeDescription *string `json:"badge_description" db:"badge_description"`
	Amount           *int    `json:"-" db:"amount"`
	AmountString     string  `json:"amount"`
}

type HomeWorkDTO struct {
	*HomeWorkListByUserDataEntity
	HomeworkIndex int   `json:"homework_index"`
	LevelIds      []int `json:"level_ids"`
	NextLevelId   int   `json:"next_level_id"`
	TotalLevel    int   `json:"total_level"`
	PassLevel     int   `json:"pass_level"`
}

type AchivementDTO struct {
	*SpecialRewardWithDataEntity
}
