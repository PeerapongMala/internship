package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"slices"
	"sort"
)

type CalculateScoreInput struct {
	SheetId     int
	Students    []constant.EvaluationStudentEntity
	SchoolId    int
	IndicatorId int
	IsAdvance   bool
}

type CalculateScoreOutput struct {
	StudentScores []constant.StudentScore
}

func (service *serviceStruct) CalculateScore(in *CalculateScoreInput) (*CalculateScoreOutput, error) {
	indicatorSetting, err := service.gradeDataEntryStorage.GradeSettingList(in.SheetId, in.IndicatorId)
	if err != nil {
		return nil, err
	}

	indicatorSettingMap := map[int]map[int]map[string]constant.GradeEvaluationFormIndicatorEntity{} // indicator_id -> sub_lesson_id -> level_type -> indicator_setting
	indicatorMaxScoreMap := map[int]float64{}                                                       // indicator_id -> max_score
	indicatorTotalWeightMap := map[int]float64{}
	subLessonIds := []int{}
	for _, ind := range indicatorSetting {
		subLessonId := helper.Deref(ind.CleverSubLessonId)
		indicatorId := helper.Deref(ind.Id)
		scoreEvaluationType := helper.Deref(ind.ScoreEvaluationType)
		maxValue := helper.Deref(ind.MaxValue)
		weight := helper.Deref(ind.Weight)

		if indicatorSettingMap[indicatorId] == nil {
			indicatorSettingMap[indicatorId] = map[int]map[string]constant.GradeEvaluationFormIndicatorEntity{}
		}
		if indicatorSettingMap[indicatorId][subLessonId] == nil {
			indicatorSettingMap[indicatorId][subLessonId] = map[string]constant.GradeEvaluationFormIndicatorEntity{}
		}
		indicatorSettingMap[indicatorId][subLessonId][scoreEvaluationType] = ind
		indicatorMaxScoreMap[indicatorId] = maxValue
		indicatorTotalWeightMap[indicatorId] += weight

		if !slices.Contains(subLessonIds, subLessonId) {
			subLessonIds = append(subLessonIds, subLessonId)
		}
	}

	evaluationStudentIds := []int{}
	for _, es := range in.Students {
		evaluationStudentIds = append(evaluationStudentIds, es.ID)
	}
	scores, err := service.gradeDataEntryStorage.GradeSettingGetStudentScore(evaluationStudentIds, subLessonIds, in.SchoolId)
	if err != nil {
		return nil, err
	}

	studentScores, err := service.calculateFinalScore(scores, indicatorSettingMap, indicatorMaxScoreMap, in.IsAdvance)
	if err != nil {
		return nil, err
	}

	return &CalculateScoreOutput{
		studentScores,
	}, nil
}

func (service *serviceStruct) calculateFinalScore(
	scores []constant.GradeSettingScore,
	indicatorSettingMap map[int]map[int]map[string]constant.GradeEvaluationFormIndicatorEntity,
	indicatorMaxScoreMap map[int]float64,
	isAdvance bool,
) ([]constant.StudentScore, error) {

	groupedScores, playLogMap := service.GroupScores(scores)
	service.FillGroupScores(groupedScores)
	service.SortScore(playLogMap)

	studentScores := []constant.StudentScore{}
	advanceScores := []constant.StudentScore{}
	for indicatorId, indicator := range indicatorSettingMap {
		subLessonId := 0
		for id, _ := range indicator {
			subLessonId = id
			break
		}
		for studentId, student := range groupedScores {
			for slId, subLesson := range student {
				if subLessonId != slId {
					continue
				}
				totalCorrectPercent := 0.00
				totalWeightedPercent := 0.00
				maxScore := indicatorMaxScoreMap[indicatorId]

				for levelType, _ := range subLesson {
					weight := helper.Deref(indicator[subLessonId][levelType].Weight)
					ind := helper.ToPtr(indicator[subLessonId][levelType])
					totalScore := service.CalculateBestScoreByLevelCount(playLogMap, studentId, levelType, ind)
					levelCount := helper.Deref(ind.LevelCount)
					//totalCorrectPercent += helper.SafeDivide(float64(st.totalScore), float64(st.levelCount*3)) * 100 * float64(st.levelCount) * weight
					correctPercent := helper.SafeDivide(float64(totalScore), float64(levelCount*3)) * 100 * float64(levelCount) * weight
					totalCorrectPercent += correctPercent
					totalWeightedPercent += float64(levelCount) * weight
					if isAdvance {
						advanceScores = append(advanceScores, constant.StudentScore{
							EvaluationStudentId:       studentId,
							EvaluationFormIndicatorID: indicatorId,
							FormSettingID:             helper.Deref(ind.Id),
							LevelType:                 levelType,
							Score:                     correctPercent,
							MaxScore:                  maxScore,
						})
					}
				}

				for i, advanceScore := range advanceScores {
					advanceScores[i].Score = helper.Round(helper.SafeDivide(advanceScore.Score, totalWeightedPercent) * maxScore / 100)
				}

				averageWeightedPercent := helper.SafeDivide(totalCorrectPercent, totalWeightedPercent)
				finalScore := helper.SafeDivide(averageWeightedPercent*maxScore, 100)
				studentScores = append(studentScores, constant.StudentScore{
					EvaluationStudentId:       studentId,
					EvaluationFormIndicatorID: indicatorId,
					FormSettingID:             0,
					Score:                     helper.Round(finalScore),
					MaxScore:                  maxScore,
				})
			}
		}
	}

	if isAdvance {
		return advanceScores, nil
	}
	return studentScores, nil
}

func (service *serviceStruct) CalculateBestScoreByLevelCount(playLogMap map[int]map[int]map[string][]constant.GradeSettingScore, evaluationStudentId int, levelType string, indicatorSetting *constant.GradeEvaluationFormIndicatorEntity) int {
	totalScore := 0
	levelCount := helper.Deref(indicatorSetting.LevelCount)
	subLessonId := helper.Deref(indicatorSetting.CleverSubLessonId)
	for i := 0; i < levelCount; i++ {
		if len(playLogMap[evaluationStudentId][subLessonId][levelType]) > i {
			totalScore += helper.Deref(playLogMap[evaluationStudentId][subLessonId][levelType][i].Score)
		} else {
			break
		}
	}
	return totalScore
}

func (service *serviceStruct) GroupScores(scores []constant.GradeSettingScore) (map[int]map[int]map[string]constant.LevelScoreStat, map[int]map[int]map[string][]constant.GradeSettingScore) {
	groupedScores := map[int]map[int]map[string]constant.LevelScoreStat{}   // evaluation_student_id -> sub_lesson_id -> level_type -> score
	playLogMap := map[int]map[int]map[string][]constant.GradeSettingScore{} // evaluation_student_id -> sub_lesson_id -> level_type -> play_logs
	for _, score := range scores {
		evalStudentId := helper.Deref(score.EvaluationStudentId)
		subLessonId := helper.Deref(score.SubLessonId)
		difficulty := helper.Deref(score.Difficulty)
		scoreValue := helper.Deref(score.Score)
		levelType := service.ConvertLevelType(helper.Deref(score.LevelType), difficulty)

		if playLogMap[evalStudentId] == nil {
			playLogMap[evalStudentId] = map[int]map[string][]constant.GradeSettingScore{}
		}
		if playLogMap[evalStudentId][subLessonId] == nil {
			playLogMap[evalStudentId][subLessonId] = map[string][]constant.GradeSettingScore{}
		}
		playLogMap[evalStudentId][subLessonId][levelType] = append(playLogMap[evalStudentId][subLessonId][levelType], score)
		if !slices.Contains([]string{constant.EvalPrePostTest, constant.EvalSubLessonPostTest}, levelType) {
			playLogMap[evalStudentId][subLessonId][constant.EvalAll] = append(playLogMap[evalStudentId][subLessonId][constant.EvalAll], score)
		}

		if groupedScores[evalStudentId] == nil {
			groupedScores[evalStudentId] = map[int]map[string]constant.LevelScoreStat{}
		}
		if groupedScores[evalStudentId][subLessonId] == nil {
			groupedScores[evalStudentId][subLessonId] = map[string]constant.LevelScoreStat{}
		}
		currentStat := groupedScores[evalStudentId][subLessonId][levelType]
		currentStat.TotalScore += scoreValue
		currentStat.LevelCount += 1
		groupedScores[evalStudentId][subLessonId][levelType] = currentStat

		evalAllStat := groupedScores[evalStudentId][subLessonId][constant.EvalAll]
		allStat := constant.LevelScoreStat{
			TotalScore: evalAllStat.TotalScore + scoreValue,
			LevelCount: evalAllStat.LevelCount + 1,
		}
		groupedScores[evalStudentId][subLessonId][constant.EvalAll] = allStat
	}
	return groupedScores, playLogMap
}

func (service *serviceStruct) FillGroupScores(groupedScores map[int]map[int]map[string]constant.LevelScoreStat) {
	for studentId, student := range groupedScores {
		for subLessonId, subLesson := range student {
			for _, eval := range constant.EvalList {
				if _, ok := subLesson[eval]; !ok {
					subLesson[eval] = constant.LevelScoreStat{
						TotalScore: 0,
						LevelCount: 0,
					}
				}
			}
			groupedScores[studentId][subLessonId] = subLesson
		}
	}
}

func (service *serviceStruct) SortScore(playLogMap map[int]map[int]map[string][]constant.GradeSettingScore) {
	for evalStudentId, subLessonMap := range playLogMap {
		for subLessonId, levelMap := range subLessonMap {
			for levelType, scores := range levelMap {
				sort.Slice(scores, func(i, j int) bool {
					if scores[i].Score == nil && scores[j].Score == nil {
						return false
					}
					if scores[i].Score == nil {
						return false
					}
					if scores[j].Score == nil {
						return true
					}
					return *scores[i].Score > *scores[j].Score
				})
				playLogMap[evalStudentId][subLessonId][levelType] = scores
			}
		}
	}
	return
}
