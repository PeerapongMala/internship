package postgres

import (
	"sort"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
)

func (postgresRepository *postgresRepository) GradeSubjectByTemplateId(id int) ([]constant.GradeSubjectWithIndicator, error) {
	query := `
		SELECT 
				tla.id,
				tla.subject_name,
				tla.clever_subject_template_id,
				tlc.id as indicator_id,
				tlc.clever_subject_template_indicator_id,
				tlc.name as indicator_name,
				tlc.max_value,
				tlc.sort,
				tlc.score_evaluation_type,
				tlc.clever_lesson_id,
				tlc.clever_sub_lesson_id
		FROM 
				grade."template" t 
		LEFT JOIN 
				grade.template_subject tla ON t.id = tla.template_id
		LEFT JOIN
				grade.template_indicator tlc on tla.id = tlc.template_subject_id 
		WHERE t.id = $1
		ORDER BY tlc.template_subject_id, tlc.sort
	`

	entities := []constant.SubjectWithIndicatorEntity{}
	err := postgresRepository.Database.Select(&entities, query, id)
	if err != nil {
		return nil, err
	}

	query = `
		select 
			tas.id,
			tas.template_indicator_id as indicator_id,
			tas.evaluation_key,
			tas.evaluation_topic,
			tas.value,
			tas.weight,
			COALESCE(tas.level_count, 0) AS level_count
		FROM grade."template" t 
		LEFT JOIN grade.template_subject tla ON t.id = tla.template_id
		LEFT JOIN grade.template_indicator tlc ON tla.id = tlc.template_subject_id 
		LEFT JOIN grade.template_assessment_setting tas ON tlc.id = tas.template_indicator_id
		WHERE t.id = $1
		ORDER BY tas.id
	`

	entitiesSetting := []constant.TemplateAssessmentSettingEntity{}
	err = postgresRepository.Database.Select(&entitiesSetting, query, id)
	if err != nil {
		return nil, err
	}

	mappingSubject := map[int]string{}
	mappingCleverSubjectTemplate := map[int]*int{}
	mappingIndicator := map[int][]constant.TemplateIndicatorEntity{}
	for _, entity := range entities {
		if entity.Id != nil {
			mappingSubject[*entity.Id] = *entity.SubjectName
			mappingCleverSubjectTemplate[*entity.Id] = entity.CleverSubjectTemplateId
			if entity.IndicatorId != nil && entity.IndicatorName != nil && entity.Sort != nil {
				mappingIndicator[*entity.Id] = append(mappingIndicator[*entity.Id], constant.TemplateIndicatorEntity{
					Id:                               entity.IndicatorId,
					CleverSubjectTemplateIndicatorId: entity.CleverSubjectTemplateIndicatorId,
					TemplateSubjectId:                *entity.Id,
					IndicatorName:                    *entity.IndicatorName,
					MaxValue:                         entity.MaxValue,
					Sort:                             *entity.Sort,
					ScoreEvaluationType:              entity.ScoreEvaluationType,
					CleverLessonId:                   entity.CleverLessonId,
					CleverSubLessonId:                entity.CleverSubLessonId,
				})
			} else {
				mappingIndicator[*entity.Id] = []constant.TemplateIndicatorEntity{}
			}
		}
	}
	mappingSetting := map[int][]constant.TemplateAssessmentSettingEntity{}
	for _, entity := range entitiesSetting {
		if entity.Id == nil {
			continue
		}
		mappingSetting[*entity.TemplateIndicatorId] = append(mappingSetting[*entity.TemplateIndicatorId], entity)
	}

	output := []constant.GradeSubjectWithIndicator{}
	for id, entity := range mappingSubject {
		indicators := mappingIndicator[id]
		sort.Slice(indicators, func(i, j int) bool {
			return indicators[i].Sort < indicators[j].Sort
		})

		for i, v := range indicators {
			if v.Id == nil {
				continue
			}
			indicators[i].Setting = mappingSetting[*v.Id]
		}

		output = append(output, constant.GradeSubjectWithIndicator{
			SubjectId:               id,
			SubjectName:             entity,
			Indicators:              indicators,
			CleverSubjectTemplateId: mappingCleverSubjectTemplate[id],
		})
	}

	sort.Slice(output, func(i, j int) bool {
		return output[i].SubjectId < output[j].SubjectId
	})

	return output, nil
}
