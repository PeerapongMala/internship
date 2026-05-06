package postgres

import (
	"fmt"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d08-observer-middleware-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-02-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) OpecEtcSchoolProgressList(pagination *helper.Pagination, startDate, endDate *time.Time, reportAccess *constant2.ReportAccess, schoolAffiliationGroup string) ([]constant.ProgressReport, error) {
	query := `
		WITH "target_school_affiliation_ids" AS (
    		SELECT UNNEST(
        		CASE 
            		WHEN $1 = TRUE THEN 
					(SELECT ARRAY_AGG("id") FROM "school_affiliation"."school_affiliation" WHERE "school_affiliation_group" = $2)
            		ELSE $3::INTEGER[]
				END
			) AS "school_affiliation_id"
		),
        "start_progress_reports" AS (
            SELECT
                "school_name",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "sc"."name" AS "school_name",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                (
                    SELECT
                        "sas"."school_id" AS "id"
                    FROM
                    	"target_school_affiliation_ids" tsai
              		LEFT JOIN "school_affiliation"."school_affiliation" sa ON "tsai"."school_affiliation_id" = "sa"."id"
                	LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas" ON "sas"."school_affiliation_id" = "tsai"."school_affiliation_id"
                    UNION
                   	SELECT UNNEST($6::INTEGER[]) AS "id" 
                ) AS "schools"
                LEFT JOIN "school"."school" sc
                	ON "schools"."id" = "sc"."id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "schools"."id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $4
                GROUP BY "lpl"."student_id", "lpl"."level_id", "sc"."name"
            ) AS "sub"
            GROUP BY "school_name"
        ),
        "end_progress_reports" AS (
            SELECT
                "school_name",
                COALESCE(SUM("max_star"), 0) AS "total_max_stars"
            FROM (
                SELECT
                    "sc"."name" AS "school_name",
                    "lpl"."student_id",
                    "lpl"."level_id",
                    MAX("lpl"."star") AS "max_star"
                FROM
                (
                    SELECT
                        "sas"."school_id" AS "id"
                    FROM
                    	"target_school_affiliation_ids" tsai
              		LEFT JOIN "school_affiliation"."school_affiliation" sa ON "tsai"."school_affiliation_id" = "sa"."id"
                	LEFT JOIN "school_affiliation"."school_affiliation_school" AS "sas" ON "sas"."school_affiliation_id" = "tsai"."school_affiliation_id"
                    UNION
                   	SELECT UNNEST($6::INTEGER[]) AS "id" 
                ) AS "schools"
                LEFT JOIN "school"."school" sc
                	ON "schools"."id" = "sc"."id"
                LEFT JOIN "class"."class" AS "c"
                    ON "c"."school_id" = "schools"."id"
                LEFT JOIN "level"."level_play_log" AS "lpl"
                    ON "lpl"."class_id" = "c"."id"
                    AND "lpl"."played_at" <= $5
                GROUP BY "lpl"."student_id", "lpl"."level_id", "sc"."name"
            ) AS "sub"
            GROUP BY "school_name"
        )
        SELECT
            "spr"."school_name" AS "scope",
             CASE
                WHEN "spr"."total_max_stars" = 0 AND "epr"."total_max_stars" = 0 THEN 0.00
                WHEN "spr"."total_max_stars" = 0 THEN 100.00
                ELSE ("epr"."total_max_stars" - "spr"."total_max_stars") / "spr"."total_max_stars"::DECIMAL(10,2) * 100
            END AS "progress",
			COUNT(*) OVER() AS "total_count"
        FROM "start_progress_reports" AS "spr"
        LEFT JOIN "end_progress_reports" AS "epr"
            ON "spr"."school_name" = "epr"."school_name"
		WHERE
			"spr"."school_name" IS NOT NULL
	`
	args := []interface{}{reportAccess.CanAccessAll, schoolAffiliationGroup, reportAccess.SchoolAffiliationIds, startDate, endDate, reportAccess.SchoolIds}
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
