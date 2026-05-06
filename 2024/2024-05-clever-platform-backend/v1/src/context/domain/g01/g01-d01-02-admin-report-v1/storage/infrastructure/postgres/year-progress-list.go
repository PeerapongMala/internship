package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) YearProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, parentScope string) ([]constant.ProgressReport, error) {
	query := `
		WITH "start_progress_reports" AS (
            SELECT
                "year",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "c"."year" AS "year",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM "school"."school" sc
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sc"."id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $1
               	WHERE
                	"sc"."name" = $2 
                GROUP BY "lpl"."student_id", "lpl"."level_id", "c"."year"
            ) AS "sub"
            GROUP BY "year"
        ),
        "end_progress_reports" AS (
            SELECT
                "year",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "c"."year" AS "year",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                	"school"."school" sc
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sc"."id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $3
                WHERE
                	"sc"."name" = $4 
                GROUP BY "lpl"."student_id", "lpl"."level_id", "c"."year"
            ) AS "sub"
            GROUP BY "year"
        )
        SELECT
            "spr"."year" AS "scope",
             CASE
                WHEN "spr"."total_max_stars" = 0 AND "epr"."total_max_stars" = 0 THEN 0.00
                WHEN "spr"."total_max_stars" = 0 THEN 100.00
                ELSE ("epr"."total_max_stars" - "spr"."total_max_stars") / "spr"."total_max_stars"::DECIMAL(10,2) * 100
            END AS "progress",
			COUNT(*) OVER() AS "total_count"
        FROM "start_progress_reports" AS "spr"
        LEFT JOIN "end_progress_reports" AS "epr"
            ON "spr"."year" = "epr"."year"
        WHERE
            "spr"."year" IS NOT NULL
	`
	args := []interface{}{startDate, parentScope, endDate, parentScope}
	argsIndex := len(args) + 1

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "scope" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	progressReportEntities := []constant.ProgressReport{}
	err := postgresRepository.Database.Select(&progressReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(progressReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = progressReportEntities[0].TotalCount
	}

	return progressReportEntities, nil
}
