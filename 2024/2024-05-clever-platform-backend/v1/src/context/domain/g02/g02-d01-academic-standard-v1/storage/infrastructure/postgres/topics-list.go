package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetTopic(SubcriteriaId int, filter constant.TopicsFilter, pagination *helper.Pagination) ([]constant.TopicResponse, int, error) {
	query := `SELECT
	"sct"."id",
	"la"."id" AS "learning_area_id" ,
	"la"."name" AS "learning_area_name" ,
	"ct"."id" AS "content_id" ,
	"ct"."name" AS "content_name" ,
	"ctr"."id" AS "criteria_id" ,
	"ctr"."short_name" AS "criteria_short_name" ,
	"ctr"."name" AS "criteria_name" ,
	"lc"."id" AS "learning_content_id",
	"lc"."name" AS "learning_content_name",
	"sct"."indicator_id",
	"i"."name" AS "indicator_name",
	"sct"."sub_criteria_id",
	"sct"."year_id" AS "year_id",
	"sy"."short_name" AS "seed_year_name",
	"sct"."short_name",
	"sct"."name",
	"sct"."status",
	"sct"."created_at",
	"sct"."created_by",
	"sct"."updated_at",
	"u"."first_name" AS "updated_by" ,
	"sct"."admin_login_as"
	FROM
			"curriculum_group"."sub_criteria_topic" sct	
		LEFT JOIN "curriculum_group"."sub_criteria" sc
			ON "sct"."sub_criteria_id" = "sc"."id"
		LEFT JOIN "curriculum_group"."indicator" i
			ON "sct"."indicator_id" = "i"."id"
		LEFT JOIN "curriculum_group"."learning_content" lc
			ON "i"."learning_content_id" = "lc"."id"
		LEFT JOIN "curriculum_group"."criteria" ctr
			ON "lc"."criteria_id" = "ctr"."id"
		LEFT JOIN "curriculum_group"."content" ct
			ON "ctr"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "la"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "user"."user" u
			ON "sct"."updated_by" = "u"."id"
		WHERE
			"sct"."sub_criteria_id" = $1

	
	
	
	`
	args := []interface{}{SubcriteriaId}
	argsI := 2

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "sct"."id" = $%d`, argsI)
		args = append(args, filter.Id)
		argsI++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "sct"."year_id" = $%d`, argsI)
		args = append(args, filter.YearId)
		argsI++
	}
	if filter.ContentId != 0 {
		query += fmt.Sprintf(` AND "ct"."id" = $%d`, argsI)
		args = append(args, filter.ContentId)
		argsI++
	}
	if filter.CriteriaId != 0 {
		query += fmt.Sprintf(` AND "ctr"."id" = $%d`, argsI)
		args = append(args, filter.CriteriaId)
		argsI++
	}
	if filter.IndicatorsId != 0 {
		query += fmt.Sprintf(` AND "i"."id" = $%d`, argsI)
		args = append(args, filter.IndicatorsId)
		argsI++
	}
	if filter.LearningAreaId != 0 {
		query += fmt.Sprintf(` AND "la"."id" = $%d`, argsI)
		args = append(args, filter.LearningAreaId)
		argsI++
	}
	if filter.LearningContentId != 0 {
		query += fmt.Sprintf(` AND "lc"."id" = $%d`, argsI)
		args = append(args, filter.LearningContentId)
		argsI++
	}

	if filter.Status != "" {
		query += fmt.Sprintf(` AND "sct"."status" = $%d`, argsI)
		args = append(args, filter.Status)
		argsI++

	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND "sct"."name" ILIKE $%d`, argsI)
		args = append(args, "%"+filter.SearchText+"%")
		argsI++
	}

	query += fmt.Sprintf(` LIMIT $%d OFFSET $%d`, argsI, argsI+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}

	countQuery := `SELECT COUNT(*) 
	FROM "curriculum_group"."sub_criteria_topic" sct
		LEFT JOIN "curriculum_group"."indicator" i
			ON "sct"."indicator_id" = "i"."id"
		LEFT JOIN "curriculum_group"."learning_content" lc
			ON "i"."learning_content_id" = "lc"."id"
		LEFT JOIn "curriculum_group"."criteria" ctr
			ON "lc"."criteria_id" = "ctr"."id"
		LEFT JOIN "curriculum_group"."content" ct
			ON "ctr"."content_id" = "ct"."id"
		LEFT JOIN "curriculum_group"."learning_area" la
			ON "ct"."learning_area_id" = "la"."id"
		LEFT JOIn "curriculum_group"."year" y
			ON "la"."year_id" = "y"."id"
	WHERE sub_criteria_id = $1`
	countArgs := []interface{}{SubcriteriaId}
	countArgsI := 2

	if filter.YearId != 0 {
		countQuery += fmt.Sprintf(` AND "sct"."year_id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.YearId)
		countArgsI++
	}
	if filter.ContentId != 0 {
		countQuery += fmt.Sprintf(` AND "ct"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.ContentId)
		countArgsI++
	}
	if filter.CriteriaId != 0 {
		countQuery += fmt.Sprintf(` AND "ctr"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.CriteriaId)
		countArgsI++
	}
	if filter.IndicatorsId != 0 {
		countQuery += fmt.Sprintf(` AND "i"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.IndicatorsId)
		countArgsI++
	}
	if filter.LearningAreaId != 0 {
		countQuery += fmt.Sprintf(` AND "la"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.LearningAreaId)
		countArgsI++
	}
	if filter.LearningContentId != 0 {
		countQuery += fmt.Sprintf(` AND "lc"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.LearningContentId)
		countArgsI++
	}
	if filter.Id != 0 {
		countQuery += fmt.Sprintf(` AND "sct"."id" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Id)
		countArgsI++
	}
	if filter.Status != "" {
		countQuery += fmt.Sprintf(` AND "sct"."status" = $%d`, countArgsI)
		countArgs = append(countArgs, filter.Status)
		countArgsI++
	}
	if filter.SearchText != "" {
		countQuery += fmt.Sprintf(` AND "sct"."name" ILIKE $%d`, countArgsI)
		countArgs = append(countArgs, "%"+filter.SearchText+"%")
		countArgsI++
	}

	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, 0, err
	}
	responses := []constant.TopicResponse{}
	for rows.Next() {
		response := constant.TopicResponse{}
		rows.Scan(
			&response.Id,
			&response.LearningAreaId,
			&response.LearningAreaName,
			&response.ContentId,
			&response.ContentName,
			&response.CriteriaId,
			&response.CriteriaShortName,
			&response.CriteriaName,
			&response.LearningContentId,
			&response.LearningContentName,
			&response.IndicatorId,
			&response.IndicatorName,
			&response.SubCriteriaId,
			&response.YearId,
			&response.SeedYearName,
			&response.ShortName,
			&response.Name,
			&response.Status,
			&response.CreatedAt,
			&response.CreatedBy,
			&response.UpdatedAt,
			&response.UpdatedBy,
			&response.AdminLoginAs,
		)
		responses = append(responses, response)
	}
	return responses, totalCount, nil
}
