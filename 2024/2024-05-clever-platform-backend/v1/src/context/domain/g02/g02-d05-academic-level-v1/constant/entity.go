package constant

import (
	"mime/multipart"
	"time"
)

type LevelEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubLessonId         int        `json:"sub_lesson_id" db:"sub_lesson_id"`
	Index               int        `json:"index" db:"index"`
	BloomType           int        `json:"bloom_type" db:"bloom_type"`
	SubCriteriaTopicIds []int      `json:"sub_criteria_topic_ids" db:"sub_criteria_topic_ids"`
	TagIds              []int      `json:"tag_ids" db:"tag_ids"`
	QuestionType        string     `json:"question_type" db:"question_type"`
	LevelType           string     `json:"level_type" db:"level_type"`
	Difficulty          string     `json:"difficulty" db:"difficulty"`
	LockNextLevel       *bool      `json:"lock_next_level" db:"lock_next_level"`
	TimerType           string     `json:"timer_type" db:"timer_type"`
	TimerTime           int        `json:"timer_time" db:"timer_time"`
	Status              string     `json:"status" db:"status"`
	WizardIndex         int        `json:"wizard_index" db:"wizard_index"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LevelUpdateEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubLessonId         int        `json:"sub_lesson_id" db:"sub_lesson_id"`
	Index               int        `json:"index" db:"index"`
	BloomType           int        `json:"bloom_type" db:"bloom_type"`
	SubCriteriaTopicIds []int      `json:"sub_criteria_topic_ids" db:"sub_criteria_topic_ids"`
	TagIds              []int      `json:"tag_ids" db:"tag_ids"`
	QuestionType        string     `json:"question_type" db:"question_type"`
	LevelType           string     `json:"level_type" db:"level_type"`
	Difficulty          string     `json:"difficulty" db:"difficulty"`
	LockNextLevel       *bool      `json:"lock_next_level" db:"lock_next_level"`
	TimerType           string     `json:"timer_type" db:"timer_type"`
	TimerTime           *int       `json:"timer_time" db:"timer_time"`
	Status              string     `json:"status" db:"status"`
	WizardIndex         int        `json:"wizard_index" db:"wizard_index"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LevelDataEntity struct {
	*LevelEntity
	QuestionCount int `json:"question_count" db:"question_count"`
}

type LevelGetDataEntity struct {
	*LevelListDataEntity
	Standard            LevelStandardEntity `json:"standard"`
	CurriculumGroupId   int                 `json:"curriculum_group_id" db:"curriculum_group_id"`
	CurriculumGroupName string              `json:"curriculum_group_name" db:"curriculum_group_name"`
	YearId              int                 `json:"year_id" db:"year_id"`
	YearName            string              `json:"year_name" db:"year_name"`
	SubjectGroupId      int                 `json:"subject_group_id" db:"subject_group_id"`
	SubjectGroupName    string              `json:"subject_group_name" db:"subject_group_name"`
	SubjectId           int                 `json:"subject_id" db:"subject_id"`
	SubjectName         string              `json:"subject_name" db:"subject_name"`
	LessonId            int                 `json:"lesson_id" db:"lesson_id"`
	LessonName          string              `json:"lesson_name" db:"lesson_name"`
	SubLessonName       string              `json:"sub_lesson_name" db:"sub_lesson_name"`
	Questions           []interface{}       `json:"questions"`
}

type LevelLanguageEntity struct {
	SubjectLanguageType string   `json:"subject_language_type" db:"subject_language_type"`
	SubjectLanguage     string   `json:"language" db:"subject_language"`
	Translations        []string `json:"translations" db:"translations"`
}

type LevelListDataEntity struct {
	Id                int                     `json:"id" db:"id"`
	LessonId          int                     `json:"lesson_id" db:"lesson_id"`
	SubLessonId       int                     `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName     string                  `json:"sub_lesson_name" db:"sub_lesson_name"`
	Index             int                     `json:"index" db:"index"`
	BloomType         int                     `json:"bloom_type" db:"bloom_type"`
	QuestionType      string                  `json:"question_type" db:"question_type"`
	LevelType         string                  `json:"level_type" db:"level_type"`
	Difficulty        string                  `json:"difficulty" db:"difficulty"`
	LockNextLevel     *bool                   `json:"lock_next_level" db:"lock_next_level"`
	TimerType         string                  `json:"timer_type" db:"timer_type"`
	TimerTime         int                     `json:"timer_time" db:"timer_time"`
	Status            string                  `json:"status" db:"status"`
	WizardIndex       int                     `json:"wizard_index" db:"wizard_index"`
	CreatedAt         time.Time               `json:"created_at" db:"created_at"`
	CreatedBy         string                  `json:"created_by" db:"created_by"`
	UpdatedAt         *time.Time              `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string                 `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string                 `json:"admin_login_as" db:"admin_login_as"`
	QuestionCount     int                     `json:"question_count" db:"question_count"`
	Language          LevelLanguageEntity     `json:"language"`
	SubCriteriaTopics []SubCriteriaDataEntity `json:"sub_criteria"`
	TagGroups         []TagGroupEntity        `json:"tag_groups"`
	Questions         []interface{}           `json:"questions,omitempty"`
}

type LessonEntity struct {
	Id     int    `json:"id" db:"id"`
	Status string `json:"status" db:"status"`
}

type LessonDataEntity struct {
	Id    int    `json:"id" db:"id"`
	Index int    `json:"index" db:"index"`
	Name  string `json:"name" db:"name"`
}

type SubLessonEntity struct {
	Id           int        `json:"id" db:"id"`
	LessonId     int        `json:"lesson_id" db:"lesson_id"`
	Index        int        `json:"index" db:"index"`
	IndicatorId  int        `json:"indicator_id" db:"indicator_id"`
	Name         string     `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type SubLessonDataEntity struct {
	Id    int    `json:"id" db:"id"`
	Index int    `json:"index" db:"index"`
	Name  string `json:"name" db:"name"`
}

type TagGroupEntity struct {
	Id    int         `json:"id" db:"id"`
	Index int         `json:"index" db:"index"`
	Name  string      `json:"name" db:"name"`
	Tags  []TagEntity `json:"tags"`
}

type TagEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type SubCriteriaDataEntity struct {
	Id                int                          `json:"id" db:"id"`
	Index             int                          `json:"index" db:"index"`
	Name              string                       `json:"name" db:"name"`
	SubCriteriaTopics []SubCriteriaTopicDataEntity `json:"sub_criteria_topics"`
}

type SubCriteriaTopicDataEntity struct {
	Id        int    `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	ShortName string `json:"short_name" db:"short_name"`
}

type SavedTextEntity struct {
	Id                int        `json:"-" db:"id"`
	CurriculumGroupId int        `json:"-" db:"curriculum_group_id"`
	GroupId           string     `json:"-" db:"group_id"`
	Language          string     `json:"language" db:"language"`
	Text              *string    `json:"text" db:"text"`
	TextToAi          *string    `json:"text_to_ai" db:"text_to_ai"`
	SpeechUrl         *string    `json:"speech_url" db:"speech_url"`
	Status            string     `json:"-" db:"status"`
	CreatedAt         time.Time  `json:"-" db:"created_at"`
	CreatedBy         string     `json:"-" db:"created_by"`
	UpdatedAt         *time.Time `json:"-" db:"updated_at"`
	UpdatedBy         *string    `json:"-" db:"updated_by"`
	AdminLoginAs      *string    `json:"-" db:"admin_login_as"`
}

type SavedTextDataEntity struct {
	GroupId      string                     `json:"group_id"`
	Translations map[string]SavedTextEntity `json:"translations"`
}

type SavedTextListDataEntity struct {
	GroupId   string  `json:"group_id" db:"group_id"`
	Language  string  `json:"language" db:"language"`
	Text      *string `json:"text" db:"text"`
	SpeechUrl *string `json:"speech_url" db:"speech_url"`
}

type QuestionEntity struct {
	Id                         int     `json:"id" db:"id"`
	LevelId                    int     `json:"level_id" db:"level_id"`
	Index                      int     `json:"index" db:"index"`
	QuestionType               string  `json:"question_type" db:"question_type"`
	TimerType                  string  `json:"timer_type" db:"timer_type"`
	TimerTime                  int     `json:"timer_time" db:"timer_time"`
	ChoicePosition             string  `json:"choice_position" db:"choice_position"`
	Layout                     string  `json:"layout" db:"layout"`
	LeftBoxColumns             string  `json:"left_box_columns" db:"left_box_columns"`
	LeftBoxRows                string  `json:"left_box_rows" db:"left_box_rows"`
	BottomBoxColumns           string  `json:"bottom_box_columns" db:"bottom_box_columns"`
	BottomBoxRows              string  `json:"bottom_box_rows" db:"bottom_box_rows"`
	ImageDescriptionUrl        *string `json:"image_description_url" db:"image_description_url"`
	ImageHintUrl               *string `json:"image_hint_url" db:"image_hint_url"`
	EnforceDescriptionLanguage *bool   `json:"enforce_description_language" db:"enforce_description_language"`
	EnforceChoiceLanguage      *bool   `json:"enforce_choice_language" db:"enforce_choice_language"`
	DeleteDescriptionImage     bool
	DeleteHintImage            bool
}

type QuestionTextEntity struct {
	Id               int     `json:"id,omitempty" db:"id"`
	QuestionId       int     `json:"-" db:"question_id"`
	SavedTextGroupId *string `json:"saved_text_group_id" db:"saved_text_group_id"`
	Type             string  `json:"-" db:"type"`
	Index            *int    `json:"index,omitempty" db:"index"`
}

type QuestionTextTranslationEntity struct {
	Id             int     `json:"-" db:"id"`
	QuestionTextId int     `json:"-" db:"question_text_id"`
	Text           string  `json:"text" db:"text"`
	Language       string  `json:"-" db:"language"`
	SpeechUrl      *string `json:"speech_url" db:"speech_url"`
}

type QuestionTextDataEntity struct {
	QuestionTextEntity
	Translations map[string]SavedTextEntity `json:"translations"`
}

// multiple choice
type QuestionMultipleChoiceEntity struct {
	QuestionId              int    `json:"-" db:"question_id"`
	UseSoundDescriptionOnly *bool  `json:"use_sound_description_only" db:"use_sound_description_only"`
	ChoiceType              string `json:"choice_type" db:"choice_type"`
	CorrectChoiceAmount     string `json:"correct_choice_amount" db:"correct_choice_amount"`
	MaxPoint                *int   `json:"max_point" db:"max_point"`
}

type QuestionMultipleChoiceTextChoiceEntity struct {
	Text                     string `json:"-"`
	Id                       int    `json:"id" db:"id"`
	QuestionMultipleChoiceId int    `json:"-" db:"question_multiple_choice_id"`
	QuestionTextId           int    `json:"-" db:"question_text_id"`
	Index                    int    `json:"index" db:"index"`
	IsCorrect                *bool  `json:"is_correct" db:"is_correct"`
	Point                    *int   `json:"point" db:"point"`
	SavedTextGroupId         string `json:"saved_text_group_id" db:"saved_text_group_id"`
}

type QuestionMultipleChoiceTextChoiceDataEntity struct {
	*QuestionMultipleChoiceTextChoiceEntity
	Translations map[string]SavedTextEntity `json:"translations"`
}

type QuestionMultipleChoiceImageChoiceEntity struct {
	Image                    *multipart.FileHeader `json:"-"`
	Id                       int                   `json:"id" db:"id"`
	QuestionMultipleChoiceId int                   `json:"-" db:"question_multiple_choice_id"`
	Index                    int                   `json:"index" db:"index"`
	ImageUrl                 string                `json:"image_url" db:"image_url"`
	IsCorrect                *bool                 `json:"is_correct" db:"is_correct"`
	Point                    *int                  `json:"point" db:"point"`
	ImageKey                 *string               `json:"image_key"`
}

type QuestionMultipleChoiceDataEntity struct {
	*QuestionEntity
	*QuestionMultipleChoiceEntity
	Command      QuestionTextDataEntity                       `json:"command_text"`
	Description  *QuestionTextDataEntity                      `json:"description_text"`
	Hint         *QuestionTextDataEntity                      `json:"hint_text"`
	CorrectText  QuestionTextDataEntity                       `json:"correct_text"`
	WrongText    *QuestionTextDataEntity                      `json:"wrong_text"`
	TextChoices  []QuestionMultipleChoiceTextChoiceDataEntity `json:"text_choices"`
	ImageChoices []QuestionMultipleChoiceImageChoiceEntity    `json:"image_choices"`
}

type FullQuestionMultipleChoiceEntity struct {
	*QuestionEntity
	*QuestionMultipleChoiceEntity
	Command      *QuestionTextDataEntity                      `json:"command_text"`
	Description  *QuestionTextDataEntity                      `json:"description_text"`
	Hint         *QuestionTextDataEntity                      `json:"hint_text"`
	CorrectText  *QuestionTextDataEntity                      `json:"correct_text"`
	WrongText    *QuestionTextDataEntity                      `json:"wrong_text"`
	TextChoices  []QuestionMultipleChoiceTextChoiceDataEntity `json:"text_choices"`
	ImageChoices []QuestionMultipleChoiceImageChoiceEntity    `json:"image_choices"`
}

// group

type QuestionGroupEntity struct {
	QuestionId              int    `json:"-" db:"question_id"`
	ChoiceType              string `json:"choice_type" db:"choice_type"`
	UseSoundDescriptionOnly *bool  `json:"use_sound_description_only" db:"use_sound_description_only"`
	CanReuseChoice          *bool  `json:"can_reuse_choice" db:"can_reuse_choice"`
	GroupAmount             int    `json:"group_amount" db:"group_amount"`
	ChoiceAmount            int    `json:"choice_amount" db:"choice_amount"`
	DummyAmount             int    `json:"dummy_amount" db:"dummy_amount"`
}

type QuestionGroupGroupEntity struct {
	Index            int    `json:"index" db:"index"`
	SavedTextGroupId string `json:"saved_text_group_id" db:"saved_text_group_id"`
	Id               int    `json:"id" db:"id"`
	QuestionGroupId  int    `json:"-" db:"question_group_id"`
	QuestionTextId   int    `json:"-" db:"question_text_id"`
}

type QuestionGroupGroupDataEntity struct {
	*QuestionGroupGroupEntity
	Translations map[string]SavedTextEntity `json:"translations"`
}

type QuestionGroupChoiceEntity struct {
	Index            int     `json:"index" db:"index"`
	SavedTextGroupId *string `json:"saved_text_group_id,omitempty" db:"saved_text_group_id"`
	GroupIndexes     []int   `json:"group_indexes" db:"group_indexes"`
	Id               int     `json:"id" db:"id"`
	QuestionGroupId  int     `json:"-" db:"question_group_id"`
	ImageUrl         *string `json:"image_url" db:"image_url"`
	QuestionTextId   *int    `json:"-" db:"question_text_id"`
	IsCorrect        *bool   `json:"is_correct" db:"is_correct"`
	ImageKey         *string `json:"image_key"`
}

type QuestionGroupChoiceDataEntity struct {
	*QuestionGroupChoiceEntity
	Translations map[string]SavedTextEntity `json:"translations,omitempty"`
}

type QuestionGroupGroupMemberEntity struct {
	QuestionGroupGroupId  int `json:"question_group_group_id" db:"question_group_group_id"`
	QuestionGroupChoiceId int `json:"question_group_choice_id" db:"question_group_choice_id"`
}

type QuestionGroupDataEntity struct {
	*QuestionEntity
	*QuestionGroupEntity
	Command     QuestionTextDataEntity          `json:"command_text"`
	Description *QuestionTextDataEntity         `json:"description_text"`
	Hint        *QuestionTextDataEntity         `json:"hint_text"`
	CorrectText QuestionTextDataEntity          `json:"correct_text"`
	WrongText   *QuestionTextDataEntity         `json:"wrong_text"`
	Choices     []QuestionGroupChoiceDataEntity `json:"choices"`
	Groups      []QuestionGroupGroupDataEntity  `json:"groups"`
}

type FullQuestionGroupSeparateChoiceTypeEntity struct {
	*QuestionEntity
	*QuestionGroupEntity
	Command      *QuestionTextDataEntity         `json:"command_text"`
	Description  *QuestionTextDataEntity         `json:"description_text"`
	Hint         *QuestionTextDataEntity         `json:"hint_text"`
	CorrectText  *QuestionTextDataEntity         `json:"correct_text"`
	WrongText    *QuestionTextDataEntity         `json:"wrong_text"`
	TextChoices  []QuestionGroupChoiceDataEntity `json:"text_choices"`
	ImageChoices []QuestionGroupChoiceDataEntity `json:"image_choices"`
	Groups       []QuestionGroupGroupDataEntity  `json:"groups"`
}

type QuestionGroupDataSeparateChoiceTypeEntity struct {
	*QuestionEntity
	*QuestionGroupEntity
	Command      QuestionTextDataEntity          `json:"command_text"`
	Description  *QuestionTextDataEntity         `json:"description_text"`
	Hint         *QuestionTextDataEntity         `json:"hint_text"`
	CorrectText  QuestionTextDataEntity          `json:"correct_text"`
	WrongText    *QuestionTextDataEntity         `json:"wrong_text"`
	TextChoices  []QuestionGroupChoiceDataEntity `json:"text_choices"`
	ImageChoices []QuestionGroupChoiceDataEntity `json:"image_choices"`
	Groups       []QuestionGroupGroupDataEntity  `json:"groups"`
}

// placeholder

type QuestionPlaceholderEntity struct {
	QuestionId              int    `json:"-" db:"question_id"`
	ChoiceType              string `json:"choice_type" db:"choice_type"`
	UseSoundDescriptionOnly *bool  `json:"use_sound_description_only" db:"use_sound_description_only"`
	CanReuseChoice          *bool  `json:"can_reuse_choice" db:"can_reuse_choice"`
	ChoiceAmount            int    `json:"choice_amount" db:"choice_amount"`
	DummyAmount             *int   `json:"dummy_amount" db:"dummy_amount"`
	HintType                string `json:"hint_type" db:"hint_type"`
}

type QuestionPlaceholderDescriptionIndexEntity struct {
	Index       int `json:"index" db:"index"`
	AnswerIndex int `json:"answer_index" db:"answer_index"`
}

type QuestionPlaceholderTextChoiceEntity struct {
	SavedTextGroupId      string  `json:"-" db:"saved_text_group_id"`
	Id                    int     `json:"id" db:"id"`
	QuestionPlaceholderId int     `json:"-" db:"question_placeholder_id"`
	Text                  string  `json:"text" validate:"required"`
	QuestionTextId        int     `json:"-" db:"question_text_id"`
	Index                 int     `json:"index" db:"index"`
	IsCorrect             *bool   `json:"is_correct" db:"is_correct"`
	SpeechUrl             *string `json:"speech_url" db:"speech_url"`
}

type QuestionPlaceholderAnswerEntity struct {
	Id                        int `json:"id" db:"id"`
	QuestionTextDescriptionId int `json:"question_text_description_id" db:"question_text_description_id"`
	AnswerIndex               int `json:"answer_index" db:"answer_index"`
}

type QuestionPlaceholderAnswerTextEntity struct {
	Id                          int `json:"id" db:"id"`
	QuestionPlaceholderAnswerId int `json:"question_placeholder_answer_id" db:"question_placeholder_answer_id"`
	// QuestionTextId              int `json:"question_text_id" db:"question_text_id"`
	ChoiceIndex int `json:"choice_index" db:"choice_index"`
	Index       int `json:"index" db:"index"`
}

// type QuestionPlaceholderTextChoiceEntity struct {
// 	Index                 int                                         `json:"index" db:"index"`
// 	IsCorrect               *bool                                       `json:"is_correct" db:"is_correct"`
// 	SavedTextGroupId      string                                      `json:"saved_text_group_id" db:"saved_text_group_id"`
// 	DescriptionIndexes    []QuestionPlaceholderDescriptionIndexEntity `json:"description_indexes" `
// 	Id                    int                                         `json:"-" db:"id"`
// 	QuestionPlaceholderId int                                         `json:"-" db:"question_placeholder_id"`
// 	QuestionTextId        int                                         `json:"-" db:"question_text_id"`
// }

// type QuestionPlaceholderTextChoiceDataEntity struct {
// 	*QuestionPlaceholderTextChoiceEntity
// 	Translations map[string]SavedTextEntity `json:"translations"`
// }

type QuestionPlaceholderDescriptionEntity struct {
	Index            int                                          `json:"index" validate:"required"`
	Text             string                                       `json:"text" validate:"required"`
	Language         *string                                      `json:"language" db:"language"`
	SpeechUrl        *string                                      `json:"speech_url"`
	SavedTextGroupId *string                                      `json:"saved_text_group_id" db:"saved_text_group_id"`
	Answers          []QuestionPlaceholderDescriptionAnswerEntity `json:"answers" validate:"required"`
}

type QuestionPlaceholderDescriptionAnswerEntity struct {
	Id    int                                              `json:"id"`
	Index int                                              `json:"index" validate:"required"`
	Text  []QuestionPlaceholderDescriptionAnswerTextEntity `json:"text"`
}

type QuestionPlaceholderDescriptionAnswerTextEntity struct {
	Index       int `json:"index" db:"index" validate:"required"`
	ChoiceIndex int `json:"choice_index" db:"choice_index" validate:"required"`
}

// type QuestionPlaceholderAnswerEntity struct {
// 	Id                              int `json:"id" db:"id"`
// 	QuestionPlaceholderTextChoiceId int `json:"question_placeholder_text_choice_id" db:"question_placeholder_text_choice_id"`
// 	QuestionTextDescriptionId       int `json:"question_text_description_id" db:"question_text_description_id"`
// 	AnswerIndex                     int `json:"answer_index" db:"answer_index"`
// }

type QuestionPlaceholderDataEntity struct {
	*QuestionEntity
	*QuestionPlaceholderEntity
	Command      QuestionTextDataEntity                 `json:"command_text"`
	Hint         *QuestionTextDataEntity                `json:"hint_text"`
	CorrectText  QuestionTextDataEntity                 `json:"correct_text"`
	WrongText    *QuestionTextDataEntity                `json:"wrong_text"`
	Descriptions []QuestionPlaceholderDescriptionEntity `json:"descriptions"`
	TextChoices  []QuestionPlaceholderTextChoiceEntity  `json:"text_choices"`
}

type FullQuestionPlaceholderEntity struct {
	*QuestionEntity
	*QuestionPlaceholderEntity
	Command      *QuestionTextDataEntity                `json:"command_text"`
	Description  *QuestionTextDataEntity                `json:"description_text"`
	Hint         *QuestionTextDataEntity                `json:"hint_text"`
	CorrectText  *QuestionTextDataEntity                `json:"correct_text"`
	WrongText    *QuestionTextDataEntity                `json:"wrong_text"`
	Descriptions []QuestionPlaceholderDescriptionEntity `json:"descriptions"`
	TextChoices  []QuestionPlaceholderTextChoiceEntity  `json:"text_choices"`
}

// sort

type QuestionSortEntity struct {
	QuestionId              int    `json:"-" db:"question_id"`
	UseSoundDescriptionOnly *bool  `json:"use_sound_description_only" db:"use_sound_description_only"`
	ChoiceType              string `json:"choice_type" db:"choice_type"`
	ChoiceAmount            int    `json:"choice_amount" db:"choice_amount"`
	CanReuseChoice          *bool  `json:"can_reuse_choice" db:"can_reuse_choice"`
	DummyAmount             *int   `json:"dummy_amount" db:"dummy_amount"`
}

type QuestionSortTextChoiceEntity struct {
	Text             string `json:"-"`
	SavedTextGroupId string `json:"saved_text_group_id" db:"saved_text_group_id"`
	Id               int    `json:"id" db:"id"`
	QuestionSortId   int    `json:"-" db:"question_sort_id"`
	QuestionTextId   int    `json:"-" db:"question_text_id"`
	Index            int    `json:"index" db:"index"`
	IsCorrect        *bool  `json:"is_correct" db:"is_correct"`
	AnswerIndexes    []int  `json:"answer_indexes"`
}

type QuestionSortTextChoiceDataEntity struct {
	*QuestionSortTextChoiceEntity
	Translations map[string]SavedTextEntity `json:"translations"`
}

type QuestionSortAnswerEntity struct {
	Id                       int `json:"id" db:"id"`
	QuestionSortId           int `json:"question_sort_id" db:"question_sort_id"`
	QuestionSortTextChoiceId int `json:"question_sort_text_choice_id" db:"question_sort_text_choice_id"`
	Index                    int `json:"index" db:"index"`
}

type QuestionSortDataEntity struct {
	*QuestionEntity
	*QuestionSortEntity
	Command     QuestionTextDataEntity             `json:"command_text"`
	Description *QuestionTextDataEntity            `json:"description_text"`
	Hint        *QuestionTextDataEntity            `json:"hint_text"`
	CorrectText QuestionTextDataEntity             `json:"correct_text"`
	WrongText   *QuestionTextDataEntity            `json:"wrong_text"`
	TextChoices []QuestionSortTextChoiceDataEntity `json:"text_choices"`
}

type FullQuestionSortEntity struct {
	*QuestionEntity
	*QuestionSortEntity
	Command     *QuestionTextDataEntity            `json:"command_text"`
	Description *QuestionTextDataEntity            `json:"description_text"`
	Hint        *QuestionTextDataEntity            `json:"hint_text"`
	CorrectText *QuestionTextDataEntity            `json:"correct_text"`
	WrongText   *QuestionTextDataEntity            `json:"wrong_text"`
	TextChoices []QuestionSortTextChoiceDataEntity `json:"text_choices"`
}

// input

type QuestionInputEntity struct {
	QuestionId              int    `json:"-" db:"question_id"`
	UseSoundDescriptionOnly *bool  `json:"use_sound_description_only" db:"use_sound_description_only"`
	InputType               string `json:"input_type" db:"input_type"`
	HintType                string `json:"hint_type" db:"hint_type"`
}

type QuestionInputAnswerEntity struct {
	Id                        int     `json:"id" db:"id"`
	QuestionTextDescriptionId int     `json:"question_text_description_id" db:"question_text_description_id"`
	AnswerIndex               int     `json:"answer_index" db:"answer_index"`
	Type                      *string `json:"type" db:"type"`
}

type QuestionInputAnswerTextEntity struct {
	SavedTextGroupId      string `json:"saved_text_group_id" db:"saved_text_group_id"`
	Id                    int    `json:"id" db:"id"`
	QuestionInputAnswerId int    `json:"question_input_answer_id" db:"question_input_answer_id"`
	QuestionTextId        int    `json:"question_text_id" db:"question_text_id"`
	Index                 int    `json:"index" db:"index"`
}

type QuestionInputDescriptionEntity struct {
	Id           int                                    `json:"id"`
	Index        int                                    `json:"index" validate:"required"`
	Text         string                                 `json:"text" validate:"required"`
	Language     *string                                `json:"language" db:"language"`
	SpeechUrl    *string                                `json:"speech_url"`
	Translations map[string]SavedTextEntity             `json:"translations,omitempty"`
	Answers      []QuestionInputDescriptionAnswerEntity `json:"answers" validate:"required"`
}

type QuestionInputDescriptionAnswerEntity struct {
	Id    int                                        `json:"id" db:"id"`
	Index int                                        `json:"index" validate:"required"`
	Type  string                                     `json:"type" validate:"required"`
	Text  []QuestionInputDescriptionAnswerTextEntity `json:"text"`
}

type QuestionInputDescriptionAnswerTextEntity struct {
	Index            int                        `json:"index" validate:"required"`
	SavedTextGroupId string                     `json:"saved_text_group_id,omitempty" validate:"required_without=Text"`
	Text             string                     `json:"text,omitempty" validate:"required_without=SavedTextGroupId"`
	Translations     map[string]SavedTextEntity `json:"translations,omitempty"`
}

type QuestionInputDataEntity struct {
	*QuestionEntity
	*QuestionInputEntity
	Command      QuestionTextDataEntity           `json:"command_text"`
	Hint         *QuestionTextDataEntity          `json:"hint_text"`
	CorrectText  QuestionTextDataEntity           `json:"correct_text"`
	WrongText    *QuestionTextDataEntity          `json:"wrong_text"`
	Descriptions []QuestionInputDescriptionEntity `json:"descriptions"`
}

type FullQuestionInputEntity struct {
	*QuestionEntity
	*QuestionInputEntity
	Command      *QuestionTextDataEntity          `json:"command_text"`
	Description  *QuestionTextDataEntity          `json:"description_text"`
	Hint         *QuestionTextDataEntity          `json:"hint_text"`
	CorrectText  *QuestionTextDataEntity          `json:"correct_text"`
	WrongText    *QuestionTextDataEntity          `json:"wrong_text"`
	Descriptions []QuestionInputDescriptionEntity `json:"descriptions"`
}

// Learn
type QuestionLearnEntity struct {
	QuestionId int     `json:"-" db:"question_id"`
	Text       *string `json:"text" db:"text"`
	Url        *string `json:"url" db:"url"`
}

type FullQuestionLearnEntity struct {
	*QuestionEntity
	*QuestionLearnEntity
	Command *QuestionTextDataEntity `json:"command_text"`
}

// criteria

type CriteriaEntity struct {
	Id           int        `json:"id" db:"id"`
	ContentId    int        `json:"content_id" db:"content_id"`
	Name         string     `json:"name" db:"name"`
	ShortName    string     `json:"short_name" db:"short_name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"-" db:"created_at"`
	CreatedBy    string     `json:"-" db:"created_by"`
	UpdatedAt    *time.Time `json:"-" db:"updated_at"`
	UpdatedBy    *string    `json:"-" db:"updated_by"`
	AdminLoginAs *string    `json:"-" db:"admin_login_as"`
}

// sub criteria

type SubCriteriaTopicEntity struct {
	Id            int        `json:"id" db:"id"`
	SubCriteriaId int        `json:"sub_criteria_id" db:"sub_criteria_id"`
	IndicatorId   *int       `json:"indicator_id" db:"indicator_id"`
	SeedYearId    *int       `json:"seed_year_id" db:"seed_year_id"`
	YearId        int        `json:"year_id" db:"year_id"`
	Name          string     `json:"name" db:"name"`
	ShortName     string     `json:"short_name" db:"short_name"`
	Status        string     `json:"status" db:"status"`
	CreatedAt     time.Time  `json:"-" db:"created_at"`
	CreatedBy     string     `json:"-" db:"created_by"`
	UpdatedAt     *time.Time `json:"-" db:"updated_at"`
	UpdatedBy     *string    `json:"-" db:"updated_by"`
	AdminLoginAs  *string    `json:"-" db:"admin_login_as"`
}

// indicator

type IndicatorEntity struct {
	Id                int        `json:"id" db:"id"`
	LearningContentId int        `json:"learning_content_id" db:"learning_content_id"`
	Name              string     `json:"name" db:"name"`
	ShortName         string     `json:"short_name" db:"short_name"`
	TranscriptName    string     `json:"transcript_name" db:"transcript_name"`
	Status            string     `json:"status" db:"status"`
	CreatedAt         time.Time  `json:"-" db:"created_at"`
	CreatedBy         string     `json:"-" db:"created_by"`
	UpdatedAt         *time.Time `json:"-" db:"updated_at"`
	UpdatedBy         *string    `json:"-" db:"updated_by"`
	AdminLoginAs      *string    `json:"-" db:"admin_login_as"`
}

// level standard

type LevelStandardEntity struct {
	LearningAreaName   string `json:"learning_area_name" db:"learning_area_name"`
	CriteriaName       string `json:"criteria_name" db:"criteria_name"`
	CriteriaShortName  string `json:"criteria_short_name" db:"criteria_short_name"`
	IndicatorName      string `json:"indicator_name" db:"indicator_name"`
	IndicatorShortName string `json:"indicator_short_name" db:"indicator_short_name"`
}

// sub lesson standard

type SubLessonStandardEntity struct {
	CriteriaName        string `json:"criteria_name" db:"criteria_name"`
	CriteriaShortName   string `json:"criteria_short_name" db:"criteria_short_name"`
	LearningContentName string `json:"learning_content_name" db:"learning_content_name"`
	IndicatorName       string `json:"indicator_name" db:"indicator_name"`
	IndicatorShortName  string `json:"indicator_short_name" db:"indicator_short_name"`
}

// auth email password

type AuthEmailPasswordEntity struct {
	UserId       string `json:"user_id" db:"user_id"`
	PasswordHash string `json:"password_hash" db:"password_hash"`
}

type StudentAnswerEntity struct {
	QuestionId    int         `json:"question_id"`
	QuestionIndex int         `json:"question_index"`
	QuestionType  string      `json:"question_type"`
	TimeUsed      *int        `json:"time_used"`
	IsCorrect     *bool       `json:"is_correct"`
	Answer        interface{} `json:"answer"`
}

type StudentMultipleChoiceAnswerEntity struct {
	TextChoiceId     *int `json:"text_choice_id,omitempty" db:"text_choice_id"`
	ImageChoiceId    *int `json:"image_choice_id,omitempty" db:"image_choice_id"`
	TextChoiceIndex  *int `json:"text_choice_index,omitempty" db:"text_choice_index"`
	ImageChoiceIndex *int `json:"image_choice_index,omitempty" db:"image_choice_index"`
}

type StudentGroupAnswerEntity struct {
	ChoiceId    *int `json:"choice_id" db:"choice_id"`
	ChoiceIndex *int `json:"choice_index" db:"choice_index"`
	GroupId     *int `json:"group_id" db:"group_id"`
	GroupIndex  *int `json:"group_index" db:"group_index"`
}

type StudentSortAnswerEntity struct {
	ChoiceId    *int `json:"choice_id" db:"choice_id"`
	ChoiceIndex *int `json:"choice_index" db:"choice_index"`
	AnswerIndex *int `json:"answer_index" db:"answer_index"`
}

type StudentPlaceholderAnswerEntity struct {
	ChoiceId         *int `json:"choice_id" db:"choice_id"`
	ChoiceIndex      *int `json:"choice_index" db:"choice_index"`
	DescriptionId    *int `json:"description_id" db:"description_id"`
	DescriptionIndex *int `json:"description_index" db:"description_index"`
	AnswerId         *int `json:"answer_id" db:"answer_id"`
	AnswerIndex      *int `json:"answer_index" db:"answer_index"`
}

type StudentInputAnswerEntity struct {
	DescriptionId    *int    `json:"description_id" db:"description_id"`
	DescriptionIndex *int    `json:"description_index" db:"description_index"`
	AnswerId         *int    `json:"answer_id" db:"answer_id"`
	AnswerIndex      *int    `json:"answer_index" db:"answer_index"`
	Answer           *string `json:"answer" db:"answer"`
}

type QuestionPlayLogEntity struct {
	QuestionPlayLogId *int    `db:"question_play_log_id"`
	QuestionId        *int    `db:"question_id"`
	QuestionIndex     *int    `db:"question_index"`
	QuestionType      *string `db:"question_type"`
	IsCorrect         *bool   `db:"is_correct"`
	TimeUsed          *int    `db:"time_used"`
}

type IndicatorLevelsEntity struct {
	Id         int    `db:"id"`
	Type       string `db:"level_type"`
	Difficulty string `db:"difficulty"`
}

type SubLessonTime struct {
	SubLessonId int        `json:"sub_lesson_id" db:"sub_lesson_id"`
	UpdatedAt   *time.Time `json:"updated_at" db:"updated_at"`
	IsUpdated   *bool      `json:"is_updated" db:"is_updated"`
}

type SubLessonMetaEntity struct {
	SubLessonId         int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName       string `json:"sub_lesson_name" db:"sub_lesson_name"`
	LessonId            int    `json:"lesson_id" db:"lesson_id"`
	LessonName          string `json:"lesson_name" db:"lesson_name"`
	SubjectId           int    `json:"subject_id" db:"subject_id"`
	SubjectName         string `json:"subject_name" db:"subject_name"`
	SubjectGroupId      int    `json:"subject_group_id" db:"subject_group_id"`
	SubjectGroupName    string `json:"subject_group_name" db:"subject_group_name"`
	YearId              int    `json:"year_id" db:"year_id"`
	YearName            string `json:"year_name" db:"year_name"`
	PlatformId          int    `json:"platform_id" db:"platform_id"`
	PlatformName        string `json:"platform_name" db:"platform_name"`
	CurriculumGroupId   int    `json:"curriculum_group_id" db:"curriculum_group_id"`
	CurriculumGroupName string `json:"curriculum_group_name" db:"curriculum_group_name"`
}
