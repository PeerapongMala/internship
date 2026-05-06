package constant

import "time"

// ==================== Transport ==========================

type QuizSubmitResultRequest struct {
	HomeworkId   *int       `json:"homework_id"`
	Star         int        `json:"star"`
	TimeUsed     int        `json:"time_used"`
	PlayedAt     time.Time  `json:"played_at"`
	AdminLoginAs *string    `json:"admin_login_as"`
	Questions    []Question `json:"questions"`
}

type Question struct {
	QuestionId   int                      `json:"question_id"`
	QuestionType QuestionType             `json:"question_type"`
	IsCorrect    bool                     `json:"is_correct"`
	TimeUsed     int                      `json:"time_used"`
	Data         []map[string]interface{} `json:"data"`
}

type QuestionInputData struct {
	QuestionInputAnswerId int    `json:"question_input_answer_id"`
	AnswerIndex           int    `json:"answer_index"`
	Answer                string `json:"answer"`
}

type QuestionMultipleChoiceData struct {
	QuestionMultipleChoiceTextChoiceId  *int `json:"question_multiple_choice_text_choice_id"`
	QuestionMultipleChoiceImageChoiceId *int `json:"question_multiple_choice_image_choice_id"`
}

type QuestionSortData struct {
	QuestionSortTextChoiceId int `json:"question_sort_text_choice_id"`
	Index                    int `json:"index"`
}

type QuestionGroupData struct {
	QuestionGroupChoiceId int `json:"question_group_choice_id"`
	QuestionGroupGroupId  int `json:"question_group_group_id"`
}

type QuestionPlaceholderData struct {
	QuestionPlaceholderAnswerId     int `json:"question_placeholder_answer_id"`
	QuestionPlaceholderTextChoiceId int `json:"question_placeholder_text_choice_id"`
}

func (s *QuestionInputData) ToStorageEntity() StudentInputAnswerEntity {
	return StudentInputAnswerEntity{
		Id:                    0,
		QuestionPlayLogId:     0,
		QuestionInputAnswerId: s.QuestionInputAnswerId,
		AnswerIndex:           s.AnswerIndex,
		Answer:                s.Answer,
	}
}

func (s *QuestionMultipleChoiceData) ToStorageEntity() StudentMultipleChoiceAnswerEntity {
	return StudentMultipleChoiceAnswerEntity{
		QuestionMultipleChoiceTextChoiceId:  s.QuestionMultipleChoiceTextChoiceId,
		QuestionMultipleChoiceImageChoiceId: s.QuestionMultipleChoiceImageChoiceId,
	}
}

func (s *QuestionSortData) ToStorageEntity() StudentSortAnswerEntity {
	return StudentSortAnswerEntity{
		QuestionSortTextChoiceId: s.QuestionSortTextChoiceId,
		Index:                    s.Index,
	}
}

func (s *QuestionGroupData) ToStorageEntity() StudentGroupAnswerEntity {
	return StudentGroupAnswerEntity{
		QuestionGroupChoiceId: s.QuestionGroupChoiceId,
		QuestionGroupGroupId:  s.QuestionGroupGroupId,
	}
}

func (s *QuestionPlaceholderData) ToStorageEntity() StudentPlaceholderAnswerEntity {
	return StudentPlaceholderAnswerEntity{
		QuestionPlaceholderAnswerId:     s.QuestionPlaceholderAnswerId,
		QuestionPlaceholderTextChoiceId: s.QuestionPlaceholderTextChoiceId,
	}
}

// ==================== Storage ==========================

type LevelPlayLogEntity struct {
	Id           int       `db:"id"`
	ClassId      *int      `db:"class_id"`
	StudentId    string    `db:"student_id"`
	LevelId      int       `db:"level_id"`
	HomeworkId   *int      `db:"homework_id"`
	PlayedAt     time.Time `db:"played_at"`
	Star         int       `db:"star"`
	TimeUsed     int       `db:"time_used"`
	AdminLoginAs *string   `db:"admin_login_as"`
}

type QuestionPlayLogEntity struct {
	Id             int  `db:"id"`
	LevelPlayLogId int  `db:"level_play_log_id"`
	QuestionId     int  `db:"question_id"`
	IsCorrect      bool `db:"is_correct"`
	TimeUsed       *int `db:"time_used"`
}

type StudentInputAnswerEntity struct {
	Id                    int    `db:"id"`
	QuestionPlayLogId     int    `db:"question_play_log_id"`
	QuestionInputAnswerId int    `db:"question_input_answer_id"`
	AnswerIndex           int    `db:"answer_index"`
	Answer                string `db:"answer"`
}

type StudentMultipleChoiceAnswerEntity struct {
	Id                                  int  `db:"id"`
	QuestionPlayLogId                   int  `db:"question_play_log_id"`
	QuestionMultipleChoiceTextChoiceId  *int `db:"question_multiple_choice_text_choice_id"`
	QuestionMultipleChoiceImageChoiceId *int `db:"question_multiple_choice_image_choice_id"`
}

type StudentSortAnswerEntity struct {
	Id                       int `db:"id"`
	QuestionPlayLogId        int `db:"question_play_log_id"`
	QuestionSortTextChoiceId int `db:"question_sort_text_choice_id"`
	Index                    int `db:"index"`
}

type StudentGroupAnswerEntity struct {
	Id                    int `db:"id"`
	QuestionPlayLogId     int `db:"question_play_log_id"`
	QuestionGroupChoiceId int `db:"question_group_choice_id"`
	QuestionGroupGroupId  int `db:"question_group_group_id"`
}

type StudentPlaceholderAnswerEntity struct {
	Id                              int `db:"id"`
	QuestionPlayLogId               int `db:"question_play_log_id"`
	QuestionPlaceholderAnswerId     int `db:"question_placeholder_answer_id"`
	QuestionPlaceholderTextChoiceId int `db:"question_placeholder_text_choice_id"`
}

type QuestionEntity struct {
	Id                         int     `db:"id"`
	LevelId                    int     `db:"level_id"`
	Index                      int     `db:"index"`
	QuestionType               string  `db:"question_type"`
	TimerTpe                   string  `db:"timer_type"`
	TimerTime                  int     `db:"timer_time"`
	ChoicePosition             string  `db:"choice_position"`
	Layout                     string  `db:"layout"`
	LeftBoxColumns             string  `db:"left_box_columns"`
	LeftBoxRows                string  `db:"left_box_rows"`
	BottomBoxColumns           string  `db:"bottom_box_columns"`
	BottomBoxRows              string  `db:"bottom_box_rows"`
	ImageDescriptionUrl        *string `db:"image_description_url"`
	ImageHintUrl               *string `db:"image_hint_url"`
	EnforceDescriptionLanguage bool    `db:"enforce_description_language"`
	EnforceChoiceLanguage      bool    `db:"enforce_choice_language"`
}

type HomeworkTemplateLevel struct {
	HomeworkTemplateId int `db:"homework_template_id"`
	LevelId            int `db:"level_id"`
}

type HomeworkSubmission struct {
	LevelPlayLogId int `db:"level_play_log_id"`
	Index          int `db:"index"`
}

type HomeworkSubmissionJoinLevelPlayLog struct {
	LevelPlayLogId int       `db:"level_play_log_id"`
	Index          int       `db:"index"`
	Id             int       `db:"id"`
	ClassId        int       `db:"class_id"`
	StudentId      string    `db:"student_id"`
	LevelId        int       `db:"level_id"`
	HomeworkId     *int      `db:"homework_id"`
	PlayedAt       time.Time `db:"played_at"`
	Star           int       `db:"star"`
	TimeUsed       int       `db:"time_used"`
	AdminLoginAs   *string   `db:"admin_login_as"`
}

type SpecialReward struct {
	ItemId *int `db:"item_id"`
	Amount *int `db:"amount"`
}

type Reward struct {
	GoldCoins   *int `db:"gold_coin"`
	ArcadeCoins *int `db:"arcade_coin"`
}

type RewardLog struct {
	UserId           *string
	GoldCoinAmount   *int
	ArcadeCoinAmount *int
	IceAmount        *int
	ItemId           *int
	ItemAmount       *int
	AvatarId         *int
	AvatarAmount     *int
	PetId            *int
	PetAmount        *int
	Description      string
	ReceivedAt       time.Time
	CreatedAt        time.Time
}
