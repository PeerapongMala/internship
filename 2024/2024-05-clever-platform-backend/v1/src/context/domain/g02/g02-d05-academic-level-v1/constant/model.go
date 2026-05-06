package constant

type LevelFilter struct {
	Id           int    `query:"id"`
	LevelType    string `query:"level_type"`
	QuestionType string `query:"question_type"`
	Difficulty   string `query:"difficulty"`
	Status       string `query:"status"`
	Tags         []int  `query:"tags"`
}

type SavedTextFilter struct {
	Text     string `query:"text"`
	Language string `query:"language" validate:"required_with=Text"`
}

type LevelBulkEditItem struct {
	LevelId int    `json:"level_id" validate:"required"`
	Status  string `json:"status" validate:"required"`
}

type LessonLevelCaseBulkEditItem struct {
	LessonId int    `json:"lesson_id" validate:"required"`
	Status   string `json:"status" validate:"required"`
}

const LevelCsvColumnsCount = 56
const LevelCsvHeaderLines = 2
const (
	CsvLevelIndex = iota
	CsvQuestionType
	CsvQuestionIndex
	CsvQuestionLanguage
	CsvCommandText
	CsvDescriptionText
	CsvHintText
	CsvCorrectText
	CsvWrongText
	CsvLesson
	CsvSubLesson
	CsvBloom
	CsvSubCriteria1
	CsvSubCriteria2
	CsvSubCriteria3
	CsvFilter1
	CsvFilter2
	CsvFilter3
	CsvLevelType
	CsvDifficulty
	CsvLockNextLevel
	CsvDefaultTimerType
	CsvDefaultTimerTime
	CsvQuestionTimerType
	CsvQuestionTimerTime
	CsvLayoutType
	CsvLayoutRatio
	CsvChoiceGrid
	CsvDescriptionGrid
	CsvEnforceDescriptionLanguage
	CsvEnforceChoiceLanguage
	CsvCommandSpeech
	CsvDescriptionSpeech
	CsvHintSpeech
	CsvCorrectTextSpeech
	CsvWrongTextSpeech
	CsvUseSoundDescriptionOnly
	CsvDescriptionImage
	CsvHintImage
	CsvChoiceHint
	CsvChoiceType
	CsvInputType
	CsvSubDescriptionIndex
	CsvSubDescriptionLanguage
	CsvSubDescriptionText
	CsvSubDescriptionSpeech
	CsvChoiceGroupIndex
	CsvChoiceGroupLanguage
	CsvChoiceGroupText
	CsvChoiceIndex
	CsvChoiceLanguage
	CsvChoiceText
	CsvChoiceSpeech
	CsvChoiceImage
	CsvIsCorrect
	CsvScore
)

type LevelCsvRow struct {
	LevelIndex                 int
	QuestionType               string
	QuestionIndex              int
	QuestionLanguage           string
	CommandText                string
	DescriptionText            string
	HintText                   string
	CorrectText                string
	WrongText                  string
	Lesson                     string
	SubLesson                  string
	Bloom                      int
	SubCriteria1               string
	SubCriteria2               string
	SubCriteria3               string
	Filter1                    int
	Filter2                    int
	Filter3                    int
	LevelType                  string
	Difficulty                 string
	LockNextLevel              *bool
	DefaultTimerType           string
	DefaultTimerTime           *int
	QuestionTimerType          string
	QuestionTimerTime          int
	LayoutType                 string
	LayoutRatio                string
	ChoiceGrid                 string
	DescriptionGrid            string
	EnforceDescriptionLanguage *bool
	EnforceChoiceLanguage      *bool
	CommandSpeech              *string
	DescriptionSpeech          *string
	HintSpeech                 *string
	CorrectTextSpeech          *string
	WrongTextSpeech            *string
	UseSoundDescriptionOnly    *bool
	DescriptionImage           *string
	HintImage                  *string
	ChoiceHint                 string
	ChoiceType                 string
	InputType                  string
	SubDescriptionIndex        int
	SubDescriptionLanguage     string
	SubDescriptionText         string
	SubDescriptionSpeech       string
	ChoiceGroupIndex           int
	ChoiceGroupLanguage        string
	ChoiceGroupText            string
	ChoiceIndex                int
	ChoiceLanguage             string
	ChoiceText                 string
	ChoiceSpeech               *string
	ChoiceImage                string
	IsCorrect                  *bool
	Score                      int
}

const CleverMathLevelCsvColumnsCount = 17
const CleverMathLevelCsvHeaderLines = 2
const (
	CMCsvLessonIndex              = 1
	CMCsvLevelIndex               = 2
	CMCsvLevelDifficulty          = 3
	CMCsvLevelTypeAndQuestionType = 4
	CMCsvCommandAndSubLessonName  = 6
	CMCsvDescriptionText          = 7
	CMCsvDescriptionImage         = 8
	CMCsvAnswer                   = 9
	CMCsvHintText                 = 10
	CMCsvHintImage                = 11
	CMCsvChoices                  = 12
	CMCsvWrongText                = 16
)

type CleverMathLevelCsvRow struct {
	LessonIndex          string
	LevelIndex           int
	Difficulty           string
	LevelType            string
	QuestionType         string
	SubLessonName        string
	CommandText          string
	DescriptionText      string
	DescriptionImage     *string
	AnswerText           string
	HintText             string
	HintImage            *string
	Choices              string
	OriginalQuestionType string
}

var (
	DefaultEnforceDescriptionLanguage = false
	DefaultEnforceChoiceLanguage      = false
	DefaultCorrectChoiceAmount        = "คำตอบถูกได้ 1 ข้อ"
	DefaultChoiceHint                 = "none"
	DefaultInputType                  = "text"
	DefaultIsCorrect                  = false
	DefaultUseSoundDescriptionOnly    = false
	DefaultCanReuseChoice             = true
)
