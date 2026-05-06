package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-04-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/lib/pq"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolReportList(schoolIds pq.Int64Array, pagination *helper.Pagination, filter *constant.SchoolReportFilter, canAccessAll bool) ([]constant.SchoolReportEntity, error) {
	query := `
		WITH "target_school" AS (
		    SELECT
		        "sc"."id",
		        "sc"."code",
		        "sc"."name"
			FROM "school"."school" sc
			WHERE TRUE
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	if !canAccessAll {
		query += fmt.Sprintf(` "sc"."id" = ANY($%d)`, argsIndex)
		args = append(args, schoolIds)
		argsIndex++
	}

	query += `
		),
		"best_play" AS (
		    SELECT
				"tc"."id" AS "school_id",
		        "lpl"."student_id",
		        "lpl"."level_id",
				"lpl"."class_id",
		        COALESCE(MAX("lpl"."star"), 0) AS "max_stars",
		    	COALESCE(COUNT("lpl"."id"), 0) AS "attempts"
		    FROM "target_school" tc
		    LEFT JOIN "class"."class" c ON "tc"."id" = "c"."school_id"
		    LEFT JOIN "level"."level_play_log" lpl ON "c"."id" = "lpl"."class_id"
	`

	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	query += `
			GROUP BY 
		    	"lpl"."student_id", "lpl"."level_id", "tc"."id", "lpl"."class_id"
		),
		"school_stat" AS (
			SELECT
				"bp"."school_id",
				SUM(bp.max_stars) AS total_stars,
				COUNT(bp.level_id) AS total_levels
			FROM "best_play" bp 
		    WHERE
				"bp"."max_stars" > 0
			GROUP BY "bp"."school_id"
		),
		"play_count" AS (
			SELECT
				"bp"."school_id",
				SUM(bp.attempts) AS play_count
			FROM "best_play" bp 
			GROUP BY "bp"."school_id"
		),
		school_student_count AS (
			SELECT
				"tc"."id",
				COUNT("s"."user_id") AS "student_count"
			FROM "target_school" tc
			LEFT JOIN "user"."student" s ON "tc"."id" = "s"."school_id"
			GROUP BY "tc"."id"
		),
		school_class_count AS (
			SELECT
				"tc"."id",
				COUNT("c"."id") AS "class_count"
			FROM "target_school" tc
			LEFT JOIN "class"."class" c ON "tc"."id" = "c"."school_id"
			GROUP BY "tc"."id"
		),	
	`

	query += `
		"avg_time" AS (
			SELECT
				"tc"."id", 
				COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
			FROM "target_school" tc 
		    LEFT JOIN "class"."class" c ON "tc"."id" = "c"."school_id"
			LEFT JOIN "level"."level_play_log" lpl ON "c"."id" = "lpl"."class_id"
			LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
	`
	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	query += `
			GROUP BY "tc"."id"
		)
		SELECT
		    "tc"."id" AS "school_id",
		    "tc"."code" AS "school_code",
		    "tc"."name" AS "school_name",
		    COALESCE("ssc"."student_count", 0) AS "student_count",
		    COALESCE("scs"."class_count", 0) AS "class_count",
		    COALESCE("ss"."total_stars", 0) AS "average_score",
		    COALESCE("ss"."total_levels", 0) AS "average_passed_levels",
		    COALESCE("pc"."play_count", 0) AS "play_count",
		   	COALESCE("at"."avg_time_used", 0) AS "average_time_used", 
			COUNT(*) OVER() AS "total_count"
		FROM "target_school" tc
		LEFT JOIN "school_stat" ss ON "tc"."id" = "ss"."school_id"
		LEFT JOIN "school_student_count" ssc ON "tc"."id" = "ssc"."id"
		LEFT JOIN "school_class_count" scs ON "tc"."id" = "scs"."id"
		LEFT JOIN "play_count" pc ON "tc"."id" = "pc"."school_id"
		LEFT JOIN "avg_time" at ON "tc"."id" = "at"."id"
		LEFT JOIN "school_affiliation"."school_affiliation_school" sas ON "tc"."id" = "sas"."school_id"
		LEFT JOIN "school_affiliation"."school_affiliation" sa ON "sas"."school_affiliation_id" = "sa"."id"
		LEFT JOIN "school_affiliation"."school_affiliation_doe" sad ON "sa"."id" = "sad"."school_affiliation_id" 
		LEFT JOIN "school_affiliation"."school_affiliation_lao" sal ON "sa"."id" = "sal"."school_affiliation_id"
		LEFT JOIN "school_affiliation"."school_affiliation_obec" sao ON "sa"."id" = "sao"."school_affiliation_id"
		WHERE TRUE
	`
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "tc"."id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.SchoolCode != "" {
		query += fmt.Sprintf(` AND "tc"."code" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SchoolCode+"%")
		argsIndex++
	}
	if filter.SchoolName != "" {
		query += fmt.Sprintf(` AND "tc"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SchoolName+"%")
		argsIndex++
	}
	if filter.SchoolAffiliationGroup != "" {
		query += fmt.Sprintf(` AND "sa"."school_affiliation_group" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.SchoolAffiliationGroup+"%")
		argsIndex++
	}
	if filter.InspectionArea != "" {
		query += fmt.Sprintf(` AND "sao"."inspection_area" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.InspectionArea+"%")
		argsIndex++
	}
	if filter.AreaOffice != "" {
		query += fmt.Sprintf(` AND "sao"."area_office" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.AreaOffice+"%")
		argsIndex++
	}
	if filter.DistrictZone != "" {
		query += fmt.Sprintf(` AND "sad"."district_zone" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.DistrictZone+"%")
		argsIndex++
	}
	if filter.District != "" {
		query += fmt.Sprintf(` AND "sad"."district" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.District+"%")
		argsIndex++
	}
	if filter.Province != "" {
		query += fmt.Sprintf(` AND "sal"."province" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Province+"%")
		argsIndex++
	}
	if filter.LaoDistrict != "" {
		query += fmt.Sprintf(` AND "sal"."district" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LaoDistrict+"%")
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "tc"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	schoolReportEntities := []constant.SchoolReportEntity{}
	err := postgresRepository.Database.Select(&schoolReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(schoolReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = schoolReportEntities[0].TotalCount
	}

	return schoolReportEntities, nil
}
