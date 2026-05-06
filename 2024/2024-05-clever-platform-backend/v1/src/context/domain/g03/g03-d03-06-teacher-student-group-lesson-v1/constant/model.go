package constant

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type GetLessonLevelStatListAndCsvParams struct {
	Search       *string `query:"search"`
	LessonId     *int    `query:"lesson_id"`
	SubLessonId  *int    `query:"sub_lesson_id"`
	StudyGroupId int     `params:"studyGroupId"`
	helper.DateFilterBase
	Pagination *helper.Pagination
}

type ScoreStat struct {
	Score float32 `json:"score"` // The score obtained
	Total float32 `json:"total"` // The maximum possible score
}

type GetLessonLevelStatListResult []LessonLevelStat

type GetLessonLevelStatCsvResult []byte

type GetSubLessonParamsParams struct {
	LessonId int `query:"lesson_id"`
}
