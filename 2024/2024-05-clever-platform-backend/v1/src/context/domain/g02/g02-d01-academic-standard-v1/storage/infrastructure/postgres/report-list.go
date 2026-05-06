package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GetReport(SubcriteriaId int, pagination *helper.Pagination) ([]constant.ReportResponse, int, error) {
	query := `
	SELECT
		"i"."id" AS "indicator_id",
		"i"."short_name" AS "indicator_short_name",
		"sy"."short_name" AS "seed_year_name",
		"ct"."name" AS "content_name",
		"ctr"."name" AS "criteria_name",
		"lc"."name" AS "learning_content_name",
		"i"."name" AS "indicator_name",
		"ls"."name" AS "lesson_name",
		"sls"."name" AS "sub_lesson_name",
		"l"."index" AS "level_id",
		"sct"."created_at",
		"sct"."created_by",
		"sct"."updated_at",
		"sct"."updated_by"
FROM "level"."level_sub_criteria_topic" lsct
	LEFT JOIN "curriculum_group"."sub_criteria_topic" sct
		ON "lsct"."sub_criteria_topic_id" = "sct"."id"
	LEFT JOIN "curriculum_group"."indicator" i 
		ON "sct"."indicator_id" = "i"."id"
	LEFT JOIN "curriculum_group"."year" y
		ON "sct"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
		ON "y"."seed_year_id" = "sy"."id"
	LEFT JOIN "curriculum_group"."learning_content" lc
		ON "i"."learning_content_id" = "lc"."id"
	LEFT JOIN "curriculum_group"."criteria" ctr
		ON "lc"."criteria_id" = "ctr"."id"
	LEFT JOIN "curriculum_group"."content" ct
		ON "ctr"."content_id" = "ct"."id"
	LEFT JOIN "level"."level" l
		ON "lsct"."level_id" = "l"."id"
	LEFT JOIN "subject"."sub_lesson" sls
		ON "l"."sub_lesson_id" = "sls"."id"
	LEFT JOIn "subject"."lesson" ls
		ON "sls"."lesson_id" = "ls"."id"
	WHERE "sct"."sub_criteria_id" = $1
	LIMIT $2 OFFSET $3
	
	`
	rows, err := postgresRepository.Database.Query(query, SubcriteriaId, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	countQuery := `SELECT COUNT(*) FROM
	
	"level"."level_sub_criteria_topic" lsct
	LEFT JOIN "curriculum_group"."sub_criteria_topic" sct
		ON "lsct"."sub_criteria_topic_id" = "sct"."id"
	LEFT JOIN "curriculum_group"."indicator" i 
		ON "sct"."indicator_id" = "i"."id"
	LEFT JOIN "curriculum_group"."learning_content" lc
		ON "i"."learning_content_id" = "lc"."id"
	LEFT JOIN "curriculum_group"."criteria" ctr
		ON "lc"."criteria_id" = "ctr"."id"
	LEFT JOIN "curriculum_group"."content" ct
		ON "ctr"."content_id" = "ct"."id"
	LEFT JOIN "level"."level" l
		ON "lsct"."level_id" = "l"."id"
	LEFT JOIN "subject"."sub_lesson" sls
		ON "l"."sub_lesson_id" = "sls"."id"
	LEFT JOIn "subject"."lesson" ls
		ON "sls"."lesson_id" = "ls"."id"
	WHERE "sct"."sub_criteria_id" = $1`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, SubcriteriaId).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.ReportResponse{}

	for rows.Next() {
		response := constant.ReportResponse{}
		rows.Scan(
			&response.IndicatorId,
			&response.IndicatorShortName,
			&response.SeedYearName,
			&response.ContentName,
			&response.CriteriaName,
			&response.LearningContentName,
			&response.IndicatorName,
			&response.LessonName,
			&response.SubLesseonName,
			&response.LevelId,
			&response.CreatedAt,
			&response.CreatedBy,
			&response.UpdatedAt,
			&response.UpdatedBy,
		)
		responses = append(responses, response)

	}
	return responses, totalCount, nil
}
