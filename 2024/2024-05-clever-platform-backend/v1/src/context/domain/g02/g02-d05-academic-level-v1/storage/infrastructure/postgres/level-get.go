package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelGet(levelId int) (*constant.LevelGetDataEntity, error) {
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
			"cg"."id" as "curriculum_group_id",
			"cg"."name" as "curriculum_group_name",
			"y"."id" as "year_id",
			"sy"."short_name" as "year_name",
			"sg"."id" as "subject_group_id",
			"ssg"."name" as "subject_group_name",
			"s"."id" as "subject_id",
			"s"."name" as "subject_name",
			"ls"."id" as "lesson_id",
			"ls"."name" as "lesson_name",
			"sl"."name" as "sub_lesson_name"
		FROM "level"."level" l
		LEFT JOIN "user"."user" u
			ON "l"."updated_by" = "u"."id"
		LEFT JOIN "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN "subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		LEFT JOIN "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."seed_subject_group" ssg
			ON "sg"."seed_subject_group_id" = "ssg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "curriculum_group"."curriculum_group" cg
			ON "y"."curriculum_group_id" = "cg"."id"
		WHERE
			"l"."id" = $1
	`

	levelGetDataEntity := constant.LevelGetDataEntity{}
	err := postgresRepository.Database.QueryRowx(query, levelId).StructScan(&levelGetDataEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	curriculumGroupId, err := postgresRepository.LevelCaseGetCurriculumGroupId(levelId)
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
	FROM "level"."level" lv
	LEFT JOIN "subject"."sub_lesson" "sl"
		ON "lv"."sub_lesson_id" = "sl"."id"
	LEFT JOIN "subject"."lesson" "l"
		ON "sl"."lesson_id" = "l"."id"
	LEFT JOIN "subject"."subject" "s"
		ON "l"."subject_id" = "s"."id"
	WHERE
		"lv"."id" = $1
`
	translationQuery := `
	SELECT
		"st"."language"
	FROM "level"."level" lv
	LEFT JOIN "subject"."sub_lesson" "sl"
		ON "lv"."sub_lesson_id" = "sl"."id"
	LEFT JOIN "subject"."lesson" "l"
		ON "sl"."lesson_id" = "l"."id"
	LEFT JOIN "subject"."subject" "s"
		ON "l"."subject_id" = "s"."id"
	LEFT JOIN "subject"."subject_translation" st
		ON "s"."id" = "st"."subject_id"
	WHERE
		"lv"."id" = $1
		AND "st"."language" IS NOT NULL
	`
	levelLanguageEntity := constant.LevelLanguageEntity{}
	err = postgresRepository.Database.QueryRowx(languageQuery, levelId).StructScan(&levelLanguageEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	translations := []string{}
	err = postgresRepository.Database.Select(&translations, translationQuery, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	levelLanguageEntity.Translations = translations

	levelGetDataEntity.Language = levelLanguageEntity
	subCriteriaEntities := []constant.SubCriteriaDataEntity{}
	err = postgresRepository.Database.Select(&subCriteriaEntities, subCriteriaQuery, curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for j, subCriteriaEntity := range subCriteriaEntities {
		log.Println(levelId, subCriteriaEntity.Id)
		subCriteriaTopics := []constant.SubCriteriaTopicDataEntity{}
		err := postgresRepository.Database.Select(&subCriteriaTopics, subCriteriaTopicQuery, levelId, subCriteriaEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		subCriteriaEntities[j].SubCriteriaTopics = subCriteriaTopics
		log.Println(subCriteriaTopics)
	}
	levelGetDataEntity.SubCriteriaTopics = subCriteriaEntities

	tagGroups := []constant.TagGroupEntity{}
	err = postgresRepository.Database.Select(&tagGroups, tagGroupQuery, levelId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for k, tagGroup := range tagGroups {
		tags := []constant.TagEntity{}
		err := postgresRepository.Database.Select(&tags, tagQuery, tagGroup.Id, levelId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		tagGroups[k].Tags = tags
	}
	levelGetDataEntity.TagGroups = tagGroups

	return &levelGetDataEntity, nil
}
