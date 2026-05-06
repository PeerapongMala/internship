package service

import (
	g02D05Constant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"testing"
)

func TestServiceCalculateScore(t *testing.T) {
	tests := []struct {
		name                  string
		scores                []constant.GradeSettingScore
		indicatorSettingMap   map[int]map[int]map[string]constant.GradeEvaluationFormIndicatorEntity
		indicatorMaxScoreMap  map[int]float64
		expectedStudentScores map[int]map[int]constant.StudentScore
		expectedError         bool
	}{
		{
			name: "Multiple students, 1 indicator",
			scores: []constant.GradeSettingScore{
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(2),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(0),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(1),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(2),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
			},
			indicatorSettingMap: map[int]map[int]map[string]constant.GradeEvaluationFormIndicatorEntity{
				1: {
					1: {
						constant.EvalPrePostTest: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalPrePostTest),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(10.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalSubLessonPostTest: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalSubLessonPostTest),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(15.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalEasy: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalEasy),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(5.00),
							LevelCount:          helper.ToPtr(3),
						},
						constant.EvalMedium: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalMedium),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(10.00),
							LevelCount:          helper.ToPtr(2),
						},
						constant.EvalHard: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalHard),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(20.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalAll: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalAll),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(20.00),
							LevelCount:          helper.ToPtr(3),
						},
					},
				},
			},
			indicatorMaxScoreMap: map[int]float64{
				1: 30.00,
			},
			expectedStudentScores: map[int]map[int]constant.StudentScore{
				1: {
					1: {
						EvaluationStudentId:       1,
						EvaluationFormIndicatorID: 1,
						Score:                     4.642,
					},
				},
				2: {
					1: {
						EvaluationStudentId:       2,
						EvaluationFormIndicatorID: 1,
						Score:                     11.785,
					},
				},
				3: {
					1: {
						EvaluationStudentId:       3,
						EvaluationFormIndicatorID: 1,
						Score:                     9.285,
					},
				},
			},
		},
		{
			name: "Multiple students, multiple indicators",
			scores: []constant.GradeSettingScore{
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(2),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(0),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(1),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(2),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(1),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(2),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(1),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(0),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(2),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.PrePostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(1),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.SubLessonPostTest),
					Difficulty:          helper.ToPtr(g02D05Constant.Easy),
					Score:               helper.ToPtr(2),
				},
				{
					EvaluationStudentId: helper.ToPtr(3),
					SubLessonId:         helper.ToPtr(2),
					LevelType:           helper.ToPtr(g02D05Constant.Test),
					Difficulty:          helper.ToPtr(g02D05Constant.Medium),
					Score:               helper.ToPtr(3),
				},
			},
			indicatorSettingMap: map[int]map[int]map[string]constant.GradeEvaluationFormIndicatorEntity{
				1: {
					1: {
						constant.EvalPrePostTest: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalPrePostTest),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(10.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalSubLessonPostTest: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalSubLessonPostTest),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(15.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalEasy: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalEasy),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(5.00),
							LevelCount:          helper.ToPtr(3),
						},
						constant.EvalMedium: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalMedium),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(10.00),
							LevelCount:          helper.ToPtr(2),
						},
						constant.EvalHard: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalHard),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(20.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalAll: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalAll),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(20.00),
							LevelCount:          helper.ToPtr(3),
						},
					},
				},
				2: {
					2: {
						constant.EvalPrePostTest: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalPrePostTest),
							CleverSubLessonId:   helper.ToPtr(2),
							Weight:              helper.ToPtr(10.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalSubLessonPostTest: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalSubLessonPostTest),
							CleverSubLessonId:   helper.ToPtr(2),
							Weight:              helper.ToPtr(15.00),
							LevelCount:          helper.ToPtr(1),
						},
						constant.EvalEasy: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalEasy),
							CleverSubLessonId:   helper.ToPtr(2),
							Weight:              helper.ToPtr(5.00),
							LevelCount:          helper.ToPtr(2),
						},
						constant.EvalMedium: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalMedium),
							CleverSubLessonId:   helper.ToPtr(2),
							Weight:              helper.ToPtr(10.00),
							LevelCount:          helper.ToPtr(3),
						},
						constant.EvalHard: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalHard),
							CleverSubLessonId:   helper.ToPtr(2),
							Weight:              helper.ToPtr(20.00),
							LevelCount:          helper.ToPtr(4),
						},
						constant.EvalAll: {
							ScoreEvaluationType: helper.ToPtr(constant.EvalAll),
							CleverSubLessonId:   helper.ToPtr(1),
							Weight:              helper.ToPtr(20.00),
							LevelCount:          helper.ToPtr(3),
						},
					},
				},
			},
			indicatorMaxScoreMap: map[int]float64{
				1: 30.00,
				2: 30.00,
			},
			expectedStudentScores: map[int]map[int]constant.StudentScore{
				1: {
					1: {
						EvaluationStudentId:       1,
						EvaluationFormIndicatorID: 1,
						Score:                     4.642,
					},
					2: {
						EvaluationStudentId:       1,
						EvaluationFormIndicatorID: 2,
						Score:                     3.170,
					},
				},
				2: {
					1: {
						EvaluationStudentId:       2,
						EvaluationFormIndicatorID: 1,
						Score:                     11.785,
					},
					2: {
						EvaluationStudentId:       2,
						EvaluationFormIndicatorID: 2,
						Score:                     8.048,
					},
				},
				3: {
					1: {
						EvaluationStudentId:       3,
						EvaluationFormIndicatorID: 1,
						Score:                     9.285,
					},
					2: {
						EvaluationStudentId:       3,
						EvaluationFormIndicatorID: 2,
						Score:                     6.341,
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			service := &serviceStruct{}
			studentScores, err := service.calculateFinalScore(
				tt.scores,
				tt.indicatorSettingMap,
				tt.indicatorMaxScoreMap,
				false,
			)

			if err != nil {
				t.Error(err)
			}

			studentScoresLength := len(studentScores)
			expectedStudentScoresLength := helper.CountLeaves(tt.expectedStudentScores)
			if studentScoresLength != expectedStudentScoresLength {
				t.Errorf(`expected student scores length %d, got %d`, expectedStudentScoresLength, studentScoresLength)
			}

			for _, studentScore := range studentScores {
				studentId := studentScore.EvaluationStudentId
				indicatorId := studentScore.EvaluationFormIndicatorID
				expectedScore := tt.expectedStudentScores[studentId][indicatorId].Score

				if !helper.FloatsEqual(expectedScore, studentScore.Score, 0.01) {
					t.Errorf(`expected student id %d on indicator id %d to score %f, got %f`, studentId, indicatorId, tt.expectedStudentScores[studentId][indicatorId].Score, studentScore.Score)
				}
			}
		})
	}
}
