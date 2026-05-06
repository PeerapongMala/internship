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

func (postgresRepository *postgresRepository) DistrictZoneProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess) ([]constant.ProgressReport, error) {
	query := `
-- 		WITH "target_district_zones" AS (
--            SELECT UNNEST($1::TEXT[]) AS "district_zone"
--         ),
		WITH "target_district_zones" AS (
    		SELECT
				DISTINCT "district_zone" 
    		FROM
				"school_affiliation"."school_affiliation_doe"
    		WHERE
				$4 = TRUE
    		UNION ALL
    		SELECT
				UNNEST($1::TEXT[])
    		WHERE $4 = FALSE
		),
        "start_progress_reports" AS (
            SELECT
                "district_zone",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "tdz"."district_zone" AS "district_zone",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                    "target_district_zones" tdz
                LEFT JOIN
                    "school_affiliation"."school_affiliation_doe" AS "sad"
                    ON "tdz"."district_zone" = "sad"."district_zone"
                LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas"
                    ON "sas"."school_affiliation_id" = "sad"."school_affiliation_id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sas"."school_id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $2
                GROUP BY "lpl"."student_id", "lpl"."level_id", "tdz"."district_zone"
            ) AS "sub"
            GROUP BY "district_zone"
        ),
        "end_progress_reports" AS (
            SELECT
                "district_zone",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "tdz"."district_zone",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                    "target_district_zones" tdz
                LEFT JOIN
                    "school_affiliation"."school_affiliation_doe" AS "sad"
                    ON "tdz"."district_zone" = "sad"."district_zone"
                LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas"
                    ON "sas"."school_affiliation_id" = "sad"."school_affiliation_id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sas"."school_id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $3
                GROUP BY "lpl"."student_id", "lpl"."level_id", "tdz"."district_zone"
            ) AS "sub"
            GROUP BY "district_zone"
        )
        SELECT
            "spr"."district_zone" AS "scope",
             CASE
                WHEN "spr"."total_max_stars" = 0 AND "epr"."total_max_stars" = 0 THEN 0.00
                WHEN "spr"."total_max_stars" = 0 THEN 100.00
                ELSE ("epr"."total_max_stars" - "spr"."total_max_stars") / "spr"."total_max_stars"::DECIMAL(10,2) * 100
            END AS "progress",
			COUNT(*) OVER() AS "total_count"
        FROM "start_progress_reports" AS "spr"
        LEFT JOIN "end_progress_reports" AS "epr"
            ON "spr"."district_zone" = "epr"."district_zone"
        WHERE
            "spr"."district_zone" IS NOT NULL
	`
	args := []interface{}{reportAccess.DistrictZones, startDate, endDate, reportAccess.CanAccessAll}
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
