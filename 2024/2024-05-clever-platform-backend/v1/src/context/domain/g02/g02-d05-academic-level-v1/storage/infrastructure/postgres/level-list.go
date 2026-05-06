package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelList(subLessonId int, filter *constant.LevelFilter, pagination *helper.Pagination, noCriteria bool) ([]constant.LevelListDataEntity, error) {
	query := `
		SELECT
			"l"."id",
			"l"."sub_lesson_id",
			"l"."index",
			"l"."question_type",
			"l"."level_type",
			"l"."difficulty",
			"l"."lock_next_level",
			"l"."timer_type",
			"l"."timer_time",
			"l"."bloom_type",
			"l"."status",
			"l"."wizard_index",
			"l"."created_at",
			"l"."created_by",
			"l"."updated_at",
			"u"."first_name" AS "updated_by",
			"l"."admin_login_as",
			"sl"."name" AS "sub_lesson_name",
			"ls"."id" AS "lesson_id",
			(
				SELECT
					COUNT (*)
				FROM 
				    "question"."question" q
				WHERE
				    "q"."level_id" = "l"."id"
			) AS "question_count"
		FROM "level"."level" l
		LEFT JOIN "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."lesson" ls
		    ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN "user"."user" u
			ON "l"."updated_by" = "u"."id"
		WHERE "sl"."id" = $1
	`
	args := []interface{}{subLessonId}
	argsIndex := 2

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "l"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Difficulty != "" {
		query += fmt.Sprintf(` AND "l"."difficulty" = $%d`, argsIndex)
		args = append(args, filter.Difficulty)
		argsIndex++
	}
	if filter.LevelType != "" {
		query += fmt.Sprintf(` AND "l"."level_type" = $%d`, argsIndex)
		args = append(args, filter.LevelType)
		argsIndex++
	}
	if filter.QuestionType != "" {
		query += fmt.Sprintf(` AND "l"."question_type" = $%d`, argsIndex)
		args = append(args, filter.QuestionType)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "l"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if len(filter.Tags) != 0 {
		tagQuery := ""
		query += fmt.Sprintf(` AND `)
		for i, tag := range filter.Tags {
			tagQuery += fmt.Sprintf(` "lt"."tag_id" = $%d`, argsIndex)
			if i != len(filter.Tags)-1 {
				tagQuery += " OR"
			}
			args = append(args, tag)
			argsIndex++
		}
		tagQuery = fmt.Sprintf("(%s)", tagQuery)
		query += tagQuery
	}
	//query += fmt.Sprintf(` GROUP BY "l"."id", "u"."first_name"`)

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "l"."index" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelListDataEntities := []constant.LevelListDataEntity{}
	err := postgresRepository.Database.Select(&levelListDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	curriculumGroupId, err := postgresRepository.SubLessonCaseGetCurriculumGroupId(subLessonId)
	if err != nil {
		return nil, err
	}

	subCriteriaQuery := `
		SELECT
			"id",
			"name",
			"index"
		FROM "curriculum_group"."sub_criteria" sc
		WHERE
			"sc"."curriculum_group_id" = $1
		`
	subCriteriaTopicQuery := `
			SELECT
				"sct"."id",
				"sct"."name",
				"sct"."short_name"
			FROM "level"."level_sub_criteria_topic" lsct
			LEFT JOIN "curriculum_group"."sub_criteria_topic" sct
				ON "lsct"."sub_criteria_topic_id" = "sct"."id"
			WHERE
				"lsct"."level_id" = $1
				AND
				"sct"."sub_criteria_id" = $2
		`
	tagGroupQuery := `
		SELECT
			"tg"."id",
			"tg"."name",
			"tg"."index"
		FROM "level"."level" l
		LEFT JOIN "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN "subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		LEFT JOIN "subject"."tag_group" tg
			ON "s"."id" = "tg"."subject_id"
		WHERE
			"l"."id" = $1
	`
	tagQuery := `
		SELECT
			"t"."id",
			"t"."name"
		FROM "level"."level_tag" lt
		LEFT JOIN "subject"."tag" t
			ON "lt"."tag_id" = "t"."id"
		WHERE
			"t"."tag_group_id" = $1
			AND
			"lt"."level_id" = $2
	`
	languageQuery := `
		SELECT
			"s"."subject_language_type",
			"s"."subject_language"
		FROM "subject"."sub_lesson" "sl"
		LEFT JOIN "subject"."lesson" "l"
			ON "sl"."lesson_id" = "l"."id"
		LEFT JOIN "subject"."subject" "s"
			ON "l"."subject_id" = "s"."id"
		WHERE
			"sl"."id" = $1
	`
	translationQuery := `
		SELECT
			"st"."language"
		FROM "subject"."sub_lesson" "sl"
		LEFT JOIN "subject"."lesson" "l"
			ON "sl"."lesson_id" = "l"."id"
		LEFT JOIN "subject"."subject" "s"
			ON "l"."subject_id" = "s"."id"
		LEFT JOIN "subject"."subject_translation" st
			ON "s"."id" = "st"."subject_id"
		WHERE
			"sl"."id" = $1
			AND "st"."language" IS NOT NULL
		`
	levelLanguageEntity := constant.LevelLanguageEntity{}
	err = postgresRepository.Database.QueryRowx(languageQuery, subLessonId).StructScan(&levelLanguageEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	translations := []string{}
	err = postgresRepository.Database.Select(&translations, translationQuery, subLessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	levelLanguageEntity.Translations = translations

	for i, level := range levelListDataEntities {
		levelListDataEntities[i].Language = levelLanguageEntity
		if !noCriteria {
			subCriteriaEntities := []constant.SubCriteriaDataEntity{}
			err = postgresRepository.Database.Select(&subCriteriaEntities, subCriteriaQuery, curriculumGroupId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			for j, subCriteriaEntity := range subCriteriaEntities {
				subCriteriaTopics := []constant.SubCriteriaTopicDataEntity{}
				err := postgresRepository.Database.Select(&subCriteriaTopics, subCriteriaTopicQuery, level.Id, subCriteriaEntity.Id)
				if err != nil {
					log.Printf("%+v", errors.WithStack(err))
					return nil, err
				}
				subCriteriaEntities[j].SubCriteriaTopics = subCriteriaTopics
			}
			levelListDataEntities[i].SubCriteriaTopics = subCriteriaEntities

			tagGroups := []constant.TagGroupEntity{}
			err = postgresRepository.Database.Select(&tagGroups, tagGroupQuery, level.Id)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			for k, tagGroup := range tagGroups {
				tags := []constant.TagEntity{}
				err := postgresRepository.Database.Select(&tags, tagQuery, tagGroup.Id, level.Id)
				if err != nil {
					log.Printf("%+v", errors.WithStack(err))
					return nil, err
				}
				tagGroups[k].Tags = tags
			}
			levelListDataEntities[i].TagGroups = tagGroups
		}
	}

	return levelListDataEntities, nil
}
