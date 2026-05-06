package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
	"sort"
)

func (postgresRepository *postgresRepository) GetListStudentScoreBySheetID(sheetID int, indicatorId ...*int) ([]constant.StudentScore, error) {

	evaluationStudentIdList := []int{}
	err := postgresRepository.Database.Select(&evaluationStudentIdList, `
		SELECT es.id
		FROM grade.evaluation_student es
		LEFT JOIN grade.evaluation_sheet sheet ON sheet.form_id = es.form_id
		WHERE sheet.id = $1`,
		sheetID,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	type LessonIndicator struct {
		EvaluationFormIndicatorID int     `db:"evaluation_form_indicator_id"`
		FormSettingID             int     `db:"form_setting_id"`
		IndicatorValue            string  `db:"indicator_value"`
		LevelIds                  []int   `db:"level_ids"`
		Weight                    float64 `db:"weight"`
		MaxValue                  float64 `db:"max_value"`
	}

	queryIndicators := `
		SELECT
		    efsetting.id as form_setting_id,
			efi.id AS evaluation_form_indicator_id,
			efsetting.value as indicator_value,
			efsetting.weight as weight,
			efi.max_value as max_value
		FROM grade.evaluation_sheet sheet
		LEFT JOIN grade.evaluation_form ef ON sheet.form_id = ef.id
		LEFT JOIN grade.evaluation_form_subject efs ON sheet.evaluation_form_subject_id = efs.id
		LEFT JOIN grade.evaluation_form_indicator efi ON efi.evaluation_form_subject_id = efs.id
		LEFT JOIN grade.evaluation_form_setting efsetting ON efi.id = efsetting.evaluation_form_indicator_id
		WHERE sheet.id = $1 AND efsetting.evaluation_key = 'STAGE_LIST';
	`

	var groups []LessonIndicator
	if err := postgresRepository.Database.Select(&groups, queryIndicators, sheetID); err != nil {
		return nil, err
	}

	if len(indicatorId) > 0 && indicatorId[0] != nil {
		filtered := []LessonIndicator{}
		for _, group := range groups {
			if group.EvaluationFormIndicatorID == *indicatorId[0] {
				filtered = append(filtered, group)
			}
		}
		groups = filtered
	}

	tmpMap := make(map[int]LessonIndicator)
	for _, group := range groups {
		key := group.EvaluationFormIndicatorID
		entry := LessonIndicator{}
		v, ok := tmpMap[key]
		if ok {
			entry = v
		} else {
			entry = group
		}
		entry.LevelIds = append(entry.LevelIds, convertStringListToIntList(group.IndicatorValue)...)
		tmpMap[key] = entry
	}
	groups = []LessonIndicator{}
	for _, v := range tmpMap {
		groups = append(groups, v)
	}

	result := []constant.StudentScore{}
	totalWeight := 0.00
	for _, indicator := range groups {
		totalWeight += indicator.Weight
	}
	for _, v := range groups {
		//v.LevelIds = convertStringListToIntList(v.IndicatorValue)

		type UserScore struct {
			UserId     int `db:"evaluation_student_id"`
			SumMaxStar int `db:"sum_max_star"`
		}
		queryMain := `
			WITH max_score AS (
			    SELECT 
					student.id AS evaluation_student_id,
					"lpl"."level_id",
					COALESCE(MAX("lpl"."star"), 0) AS "max_star"
				FROM grade.evaluation_student student
				LEFT JOIN grade.evaluation_sheet sheet ON sheet.form_id = student.form_id
				LEFT JOIN grade.evaluation_form ef ON sheet.form_id = ef.id
				LEFT JOIN "user".student s ON student.student_id = s.student_id AND ef.school_id = s.school_id
				LEFT JOIN "level"."level_play_log" lpl ON lpl.student_id = s.user_id AND "lpl"."level_id" = ANY($2)
				WHERE sheet.id = $1 
				GROUP BY student.id, "lpl"."level_id"
			),
			sum_max_score AS (
				SELECT
				    "evaluation_student_id",
					SUM("max_star") AS "sum_max_star"
				FROM "max_score"
				GROUP BY "evaluation_student_id"
			)
			SELECT
				*
			FROM "sum_max_score"
		`

		var studentScores []UserScore
		if err := postgresRepository.Database.Select(&studentScores, queryMain, sheetID, v.LevelIds); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		studentScoresMap := map[int]UserScore{}
		for _, studentScore := range studentScores {
			studentScoresMap[studentScore.UserId] = studentScore
		}

		students := []constant.StudentScore{}
		for _, studentId := range evaluationStudentIdList {
			maxScore := float64(3 * len(v.LevelIds))
			//score := float64(studentScoresMap[studentId].SumMaxStar) * v.Weight / v.MaxValue
			weightedScore, maxWeightedScore := 0.00, 0.00
			if totalWeight != 0 {
				maxWeightedScore = maxScore * v.Weight / totalWeight
			} else {
				maxWeightedScore = maxScore
			}
			if maxScore != 0 {
				weightedScore = float64(studentScoresMap[studentId].SumMaxStar) * maxWeightedScore / maxScore
			}

			students = append(students, constant.StudentScore{
				EvaluationStudentId:       studentId,
				EvaluationFormIndicatorID: v.EvaluationFormIndicatorID,
				FormSettingID:             v.FormSettingID,
				Score:                     helper.Round(weightedScore),
				MaxScore:                  maxScore,
			})
		}
		sort.Slice(students, func(i, j int) bool {
			return students[i].EvaluationStudentId < students[j].EvaluationStudentId
		})
		result = append(result, students...)
	}

	return result, nil
}
