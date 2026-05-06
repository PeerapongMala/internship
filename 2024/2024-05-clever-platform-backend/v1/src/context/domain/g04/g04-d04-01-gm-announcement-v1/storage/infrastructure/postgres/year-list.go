package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) YearList(pagination *helper.Pagination, filter constant.YearFilter) ([]constant.YearList, int, error) {
	query := `
		SELECT DISTINCT ON ("y"."id")
		"y"."id",
		CONCAT("c"."short_name", ' - ', "sy"."short_name") AS "name"
		FROM "school"."school_subject" ss
		LEFT JOIN "subject"."subject" sj
		ON "ss"."subject_id" = "sj"."id" 
		LEFT JOIN "curriculum_group"."subject_group" sg
		ON "sj"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
		ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
		ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN "curriculum_group"."platform" p
		ON "y"."platform_id" = "p"."id"
		LEFT JOIN "curriculum_group"."curriculum_group" c
		ON "p"."curriculum_group_id" = "c"."id"
	`
	args := []interface{}{}
	argI := 1
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` WHERE "ss"."school_id" = $%d`, argI)
		args = append(args, filter.SchoolId)
		argI++
	}

	query += fmt.Sprintf(`    ORDER BY "y"."id" LIMIT $%d OFFSET $%d`, argI, argI+1)
	args = append(args, pagination.Limit, pagination.Offset)
	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.YearList{}
	for rows.Next() {
		response := constant.YearList{}
		rows.Scan(
			&response.YearId,
			&response.Name,
		)
		responses = append(responses, response)
	}

	countQuery := `
	SELECT COUNT(*)
	FROM "school"."school_subject" ss
		LEFT JOIN "subject"."subject" sj
		ON "ss"."subject_id" = "sj"."id" 
		LEFT JOIN "curriculum_group"."subject_group" sg
		ON "sj"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
		ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."seed_year" sy
		ON "y"."seed_year_id" = "sy"."id"
	`
	Countargs := []interface{}{}
	CountI := 1
	if filter.SchoolId != 0 {
		countQuery += fmt.Sprintf(` WHERE "ss"."school_id" = $%d`, CountI)
		Countargs = append(Countargs, filter.SchoolId)
		CountI++
	}
	var totalCount int
	postgresRepository.Database.QueryRow(countQuery, Countargs...).Scan(&totalCount)

	return responses, totalCount, nil
}
