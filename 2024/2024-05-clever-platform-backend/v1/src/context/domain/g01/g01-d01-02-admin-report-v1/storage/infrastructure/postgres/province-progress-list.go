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

func (postgresRepository *postgresRepository) ProvinceProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *observerConstant.ReportAccess) ([]constant.ProgressReport, error) {
	query := `
		WITH "target_school_affiliation_ids" AS (
    		SELECT UNNEST(
        		CASE 
            		WHEN $4 = TRUE THEN 
					(SELECT ARRAY_AGG("school_affiliation_id") FROM "school_affiliation"."school_affiliation_lao")
            		ELSE $1::INTEGER[]
				END
			) AS "school_affiliation_id"
		),
        "start_progress_reports" AS (
            SELECT
                "province",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "sal"."province",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                    "target_school_affiliation_ids"
                LEFT JOIN
                    "school_affiliation"."school_affiliation_lao" AS "sal"
                    ON "target_school_affiliation_ids"."school_affiliation_id" = "sal"."school_affiliation_id"
                LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas"
                    ON "sas"."school_affiliation_id" = "sal"."school_affiliation_id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sas"."school_id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $2
                GROUP BY "lpl"."student_id", "lpl"."level_id", "sal"."province"
            ) AS "sub"
            GROUP BY "province"
        ),
        "end_progress_reports" AS (
            SELECT
                "province",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "sal"."province",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                    "target_school_affiliation_ids"
                LEFT JOIN
                    "school_affiliation"."school_affiliation_lao" AS "sal"
                    ON "target_school_affiliation_ids"."school_affiliation_id" = "sal"."school_affiliation_id"
                LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas"
                    ON "sas"."school_affiliation_id" = "sal"."school_affiliation_id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "sas"."school_id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $3
                GROUP BY "lpl"."student_id", "lpl"."level_id", "sal"."province"
            ) AS "sub"
            GROUP BY "province"
        )
        SELECT
            "spr"."province" AS "scope",
             CASE
                WHEN "spr"."total_max_stars" = 0 AND "epr"."total_max_stars" = 0 THEN 0.00
                WHEN "spr"."total_max_stars" = 0 THEN 100.00
                ELSE ("epr"."total_max_stars" - "spr"."total_max_stars") / "spr"."total_max_stars"::DECIMAL(10,2) * 100
            END AS "progress",
			COUNT(*) OVER() AS "total_count"
        FROM "start_progress_reports" AS "spr"
        LEFT JOIN "end_progress_reports" AS "epr"
            ON "spr"."province" = "epr"."province"
        WHERE "spr"."province" IS NOT NULL
	`
	args := []interface{}{reportAccess.SchoolAffiliationIds, startDate, endDate, reportAccess.CanAccessAll}
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
