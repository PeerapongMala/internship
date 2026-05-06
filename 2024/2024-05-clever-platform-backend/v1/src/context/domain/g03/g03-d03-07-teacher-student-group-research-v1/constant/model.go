package constant

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

type GetTTestPairModelStatListAndCsvParams struct {
	Search       *string `query:"search" validate:"omitempty"`
	LessonId     int     `query:"lesson_id"`
	SubLessonId  int     `query:"sub_lesson_id"`
	StudyGroupId int     `query:"study_group_id"`
	helper.DateFilterBase
}

type ScoreStat struct {
	Score float32 `json:"score"` // The score obtained
	Total float32 `json:"total"` // The maximum possible score
}

type GetTTestPairModelStatListResult []TTestPairModelStat

type GetTTestPairModelStatCsvResult []byte

type GetTTestPairResultResult struct {
	Mean                       TestStat `json:"mean"`
	Variance                   TestStat `json:"variance"`
	Observations               TestStat `json:"observations"`
	PearsonCorrelation         *float64 `json:"pearson_correlation"`
	HypothesizedMeanDifference *float64 `json:"hypothesized_mean_difference"`
	DF                         *float64 `json:"df"`
	TStat                      *float64 `json:"t_stat"`
	POneTail                   *float64 `json:"p_one_tail"`
	TCriticalOneTail           *float64 `json:"t_critical_one_tail"`
	PTwoTail                   *float64 `json:"p_two_tail"`
	TCriticalTwoTail           *float64 `json:"t_critical_two_tail"`
	TestScore                  struct {
		N    TestStat `json:"n"`
		Mean TestStat `json:"mean"`
		SD   TestStat `json:"sd"`
		T    *float64 `json:"t"`
		DF   *float64 `json:"df"`
		SIG  float64  `json:"sig"`
	}
}

type GetDDRParams struct {
	Search  *string `query:"search" validate:"omitempty"`
	LevelId int     `query:"level_id"`
}
type GetDifficultyDiscriminationReliabilityResultResult struct {
	QuestionStat []QuestionStatByStudent `json:"question_stat"`
	XOne         int                     `json:"x_one"`
	XSum         int                     `json:"x_sum"`
	PowXOne      float64                 `json:"pow_x_one"`
	PowXSum      float64                 `json:"pow_x_sum"`
}

type GetDDRSummaryResult struct {
	SumStat              SumQuestionStat        `json:"sum_stat"`
	HiRankCorrectAnswer  []QuestionCalStatScore `json:"hi_rank_correct_answer"`
	LowRankCorrectAnswer []QuestionCalStatScore `json:"low_rank_correct_answer"`
	Difficulty           []QuestionCalStatScore `json:"difficulty"`
	BIndex               []QuestionCalStatScore `json:"b_index"`
}

type GetDDRScoreResult []StudentQuestionStat

type GetPrePostTestLevelsParams struct {
	SubLessonId int `query:"sub_lesson_id" validate:"required"`
}

type GetDDRScoreResultCsv []byte
type GetDDRSummaryResultCsv []byte
