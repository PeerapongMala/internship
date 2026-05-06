package postgres

import (
	"fmt"
	observerConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) AreaOfficeProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess, parentScope string) ([]constant.ProgressReport, error) {
	query := `
		WITH "target_area_offices" AS (
    		SELECT
				DISTINCT "area_office" 
    		FROM
				"school_affiliation"."school_affiliation_obec"
    		WHERE
				$5 = TRUE
    		UNION ALL
    		SELECT
				UNNEST($1::TEXT[])
    		WHERE $5 = FALSE
		),
        "start_progress_reports" AS (
            SELECT
                "area_office",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "sao"."area_office",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                    "target_area_offices"
                LEFT JOIN
                    "school_affiliation"."school_affiliation_obec" AS "sao"
                    ON "target_area_offices"."area_office" = "sao"."area_office"
                LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas"
                    ON "sas"."school_affiliation_id" = "sao"."school_affiliation_id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sas"."school_id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $2
               	WHERE
                	"sao"."inspection_area" = $4 
                GROUP BY "lpl"."student_id", "lpl"."level_id", "sao"."area_office"
            ) AS "sub"
            GROUP BY "area_office"
        ),
        "end_progress_reports" AS (
            SELECT
                "area_office",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "sao"."area_office",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                    "target_area_offices"
                LEFT JOIN
                    "school_affiliation"."school_affiliation_obec" AS "sao"
                    ON "target_area_offices"."area_office" = "sao"."area_office"
                LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas"
                    ON "sas"."school_affiliation_id" = "sao"."school_affiliation_id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sas"."school_id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $3
                WHERE
                	"sao"."inspection_area" = $4 
                GROUP BY "lpl"."student_id", "lpl"."level_id", "sao"."area_office"
            ) AS "sub"
            GROUP BY "area_office"
        )
        SELECT
            "spr"."area_office" AS "scope",
             CASE
                WHEN "spr"."total_max_stars" = 0 AND "epr"."total_max_stars" = 0 THEN 0.00
                WHEN "spr"."total_max_stars" = 0 THEN 100.00
                ELSE ("epr"."total_max_stars" - "spr"."total_max_stars") / "spr"."total_max_stars"::DECIMAL(10,2) * 100
            END AS "progress",
			COUNT(*) OVER() AS "total_count"
        FROM "start_progress_reports" AS "spr"
        LEFT JOIN "end_progress_reports" AS "epr"
            ON "spr"."area_office" = "epr"."area_office"
        WHERE "spr"."area_office" IS NOT NULL
	`
	args := []interface{}{reportAccess.AreaOffices, startDate, endDate, parentScope, reportAccess.CanAccessAll}
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
