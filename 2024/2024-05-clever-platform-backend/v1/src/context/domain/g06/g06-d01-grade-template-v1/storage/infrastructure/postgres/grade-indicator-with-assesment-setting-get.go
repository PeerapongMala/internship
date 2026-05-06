package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
)

func (postgresRepository *postgresRepository) GradeIndicatorWithAssesmentSettingByIndicatorId(id int) (*constant.GradeIndicatorWithAssesmentSetting, error) {

	query := `
		select 
			tlc.id,
			tlc.name as indicator_name,
			tlc.max_value as max_value,
			tlc.score_evaluation_type,
			tlc.clever_lesson_id,
			tlc.clever_sub_lesson_id,
			tas.id as setting_id,
			tas.evaluation_key,
			tas.evaluation_topic,
			tas.value,
			tas.weight,
			tas.level_count
		from grade.template_indicator tlc 
		left join grade.template_assessment_setting tas
		on tlc.id = tas.template_indicator_id 
		where tlc.id = $1
		order by setting_id;
	`

	entities := []constant.TemplateIndicatorWithAssessmentSettingEntity{}
	err := postgresRepository.Database.Select(&entities, query, id)
	if err != nil {
		return nil, err
	}

	assesmentSettings := []constant.TemplateAssessmentSettingEntity{}
	indicatorName := ""
	scoreEvaluationType := ""
	var cleverLessonId, cleverSubLessonId *int
	maxValue := 0.0
	for _, entity := range entities {
		if entity.IndicatorName != nil {
			indicatorName = *entity.IndicatorName
		}
		if entity.MaxValue != nil {
			maxValue = *entity.MaxValue
		}
		if entity.ScoreEvaluationType != nil {
			scoreEvaluationType = *entity.ScoreEvaluationType
		}
		if entity.CleverLessonId != nil {
			cleverLessonId = entity.CleverLessonId
		}
		if entity.CleverSubLessonId != nil {
			cleverSubLessonId = entity.CleverSubLessonId
		}
		if entity.SettingId != nil {
			assesmentSettings = append(assesmentSettings, constant.TemplateAssessmentSettingEntity{
				Id:                  entity.SettingId,
				TemplateIndicatorId: entity.Id,
				EvaluationKey:       entity.EvaluationKey,
				EvaluationTopic:     entity.EvaluationTopic,
				Value:               entity.Value,
				Weight:              entity.Weight,
				LevelCount:          entity.LevelCount,
			})
		}
	}

	output := constant.GradeIndicatorWithAssesmentSetting{
		IndicatorId:         id,
		IndicatorName:       indicatorName,
		MaxValue:            maxValue,
		ScoreEvaluationType: scoreEvaluationType,
		CleverLessonId:      cleverLessonId,
		CleverSubLessonId:   cleverSubLessonId,
		AssementSettings:    assesmentSettings,
	}

	return &output, nil
}
