package postgres

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d08-subject-template/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectTemplateList(filter *constant.SubjectTemplateFilter, pagination *helper.Pagination) ([]constant.SubjectTemplateEntity, error) {
	query := `
		SELECT
			"st"."id",
			"st"."name",
			"st"."subject_id",
			"s"."name" AS "subject_name",
			"st"."seed_year_id",
			"sy"."short_name" AS "seed_year_short_name",
			"st"."status",
			"st"."created_at",
			"u"."first_name" AS "created_by", 
			"st"."updated_at",
			"u2"."first_name" AS "updated_by",
			"st"."wizard_index"
		FROM "grade"."subject_template" st
		INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		INNER JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
		LEFT JOIN "user"."user" u ON "st"."created_by" = "u"."id"
		LEFT JOIN "user"."user" u2 ON "st"."updated_by" = "u2"."id"
		WHERE TRUE
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "p"."curriculum_group_id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "st"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "st"."subject_id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.Name != "" {
		query += fmt.Sprintf(` AND "st"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Name+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "st"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.SeedYearId != 0 {
		query += fmt.Sprintf(` AND "st"."seed_year_id" = $%d`, argsIndex)
		args = append(args, filter.SeedYearId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "st"."id" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjectTemplates := []constant.SubjectTemplateEntity{}
	err := postgresRepository.Database.Select(&subjectTemplates, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	indicatorQuery := `
			SELECT
				"sti"."id",
				"sti"."subject_template_id",
				"sti"."sub_lesson_id",
				"sti"."name",
				"sti"."type",
				"sti"."index",
				"sti"."value",
				ls.id AS "lesson_id"
			FROM "grade"."subject_template_indicator" sti
			INNER JOIN "subject"."sub_lesson" sl ON "sti"."sub_lesson_id" = "sl"."id"
			INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
			WHERE sti."subject_template_id" = $1
			ORDER BY sti."index"
		`

	levelQuery := `
		SELECT
			"subject_template_indicator_id",
			"level_type",
			"weight",
			"levels",
			COALESCE("level_count", 0) AS "level_count"
		FROM "grade"."indicator_level_setting"
		WHERE "subject_template_indicator_id" = $1
	`

	if filter.IncludeIndicators {
		for i, template := range subjectTemplates {
			err = postgresRepository.Database.Select(&subjectTemplates[i].SubjectTemplateIndicators, indicatorQuery, template.Id)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			for j, indicator := range subjectTemplates[i].SubjectTemplateIndicators {
				err = postgresRepository.Database.Select(&subjectTemplates[i].SubjectTemplateIndicators[j].Levels, levelQuery, indicator.Id)
				if err != nil {
					log.Printf("%+v", errors.WithStack(err))
					return nil, err
				}
				if subjectTemplates[i].SubjectTemplateIndicators[j].Levels == nil {
					subjectTemplates[i].SubjectTemplateIndicators[j].Levels = []constant.IndicatorLevelSettingEntity{}
				}

				for k, level := range subjectTemplates[i].SubjectTemplateIndicators[j].Levels {
					err = json.Unmarshal([]byte(level.LevelsString), &subjectTemplates[i].SubjectTemplateIndicators[j].Levels[k].Levels)
					if err != nil {
						log.Printf("%+v", errors.WithStack(err))
						return nil, err
					}
					if subjectTemplates[i].SubjectTemplateIndicators[j].Levels[k].Levels == nil {
						subjectTemplates[i].SubjectTemplateIndicators[j].Levels[k].Levels = []int{}
					}
				}
			}
		}
	}

	return subjectTemplates, nil
}
