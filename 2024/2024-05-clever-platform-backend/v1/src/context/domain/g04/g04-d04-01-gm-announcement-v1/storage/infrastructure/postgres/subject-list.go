package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SubjectList(pagination *helper.Pagination, filter constant.SubjectFilter) ([]constant.SubjectList, int, error) {
	query := `
	SELECT DISTINCT ON ("s"."id")
	"s"."id",
	"s"."name"
	FROM "subject"."subject" s
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "s"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "school"."school_subject" ss
	ON "s"."id" = "ss"."subject_id"

	`
	args := []interface{}{}
	argI := 1
	WhereClause := false
	if filter.SchoolId != 0 {
		if !WhereClause {
			query += ` WHERE`
			WhereClause = true
		} else {
			query += `AND`
		}
		query += fmt.Sprintf(`"ss"."school_id" = $%d    `, argI)
		args = append(args, filter.SchoolId)
		argI++
	}
	if filter.YearId != 0 {
		if !WhereClause {
			query += ` WHERE`
			WhereClause = true
		} else {
			query += `AND`
		}
		query += fmt.Sprintf(`"y"."id" = $%d     `, argI)
		args = append(args, filter.YearId)
		argI++
	}
	query += fmt.Sprintf(`  ORDER BY "s"."id" LIMIT $%d OFFSET $%d`, argI, argI+1)
	args = append(args, pagination.Limit, pagination.Offset)
	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.SubjectList{}
	for rows.Next() {
		response := constant.SubjectList{}
		rows.Scan(
			&response.SubjectId,
			&response.SubjectName,
		)
		responses = append(responses, response)
	}
	countQuery := `
	SELECT COUNT(*)
	FROM "subject"."subject" s
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "s"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "school"."school_subject" ss
	ON "s"."id" = "ss"."subject_id"
	`
	countArgs := []interface{}{}
	countI := 1
	CountWhereClause := false
	if filter.SchoolId != 0 {
		if !CountWhereClause {
			countQuery += ` WHERE`
			CountWhereClause = true
		} else {
			countQuery += `AND`
		}
		countQuery += fmt.Sprintf(` "ss"."school_id" = $%d`, countI)
		countArgs = append(countArgs, filter.SchoolId)
		countI++
	}
	if filter.YearId != 0 {
		if !CountWhereClause {
			countQuery += ` WHERE`
			CountWhereClause = true
		} else {
			countQuery += `AND`
		}
		countQuery += fmt.Sprintf(` "y"."id" = $%d`, countI)
		countArgs = append(countArgs, filter.YearId)
		countI++
	}
	var totalCount int
	postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)

	return responses, totalCount, nil
}
