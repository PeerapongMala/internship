package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BestTeacherListByHomework(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByHomework, error) {
	query := `
		WITH "week_intervals" AS (
			SELECT 
			    week_number,
			    week_start,
			    LEAST(week_start + INTERVAL '6 days 23 hours 59 minutes 59 seconds', $2::timestamp) as week_end
			FROM (
    			SELECT 
    			    ROW_NUMBER() OVER (ORDER BY week_start) as week_number,
    			    week_start
    			FROM (
    		    	SELECT 
    		    	    generate_series(
    		    	        $1::timestamp,
    		    	        $2::timestamp,
    		    	        INTERVAL '7 days'
    		    	    ) as week_start
    				) weeks
				) numbered_weeks
		),
		teacher_weekly_homework AS (
    		SELECT
        		"u"."id" AS "teacher_id",
    			COUNT(DISTINCT wi.week_number) FILTER (WHERE h.id IS NOT NULL) AS "week_count"
    		FROM "user"."user" u
    		CROSS JOIN "week_intervals" wi
    		LEFT JOIN "homework"."homework" h ON "u"."id" = "h"."created_by"
        	AND "h"."started_at" BETWEEN wi.week_start AND wi.week_end
    		GROUP BY "u"."id"
		),
		teacher_stat AS (
			SELECT
				"u"."id" AS "teacher_id",
				COUNT(h.id) AS "homework_count"
			FROM "user"."user" u
			LEFT JOIN "homework"."homework" h ON "u"."id" = "h"."created_by"
	`
	args := []interface{}{filter.StartDate, filter.EndDate}
	argsIndex := len(args) + 1

	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "h"."created_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "h"."created_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	query += `
			GROUP BY "u"."id"
		)
		SELECT
			"u"."id" AS "teacher_id",
			"u"."title" AS "teacher_title",
			"u"."first_name" AS "teacher_first_name",
			"u"."last_name" AS "teacher_last_name",
			"u"."last_login" AS "last_login",
			"ts"."homework_count",
			"sc"."code" AS "school_code",
			"sc"."name" AS "school_name",
			COALESCE("twh"."week_count", 0) AS "week_count"
		FROM "teacher_stat" ts
		INNER JOIN "user"."user" u ON "ts"."teacher_id" = "u"."id"
		INNER JOIN "school"."school_teacher" st ON "u"."id" = "st"."user_id"
		INNER JOIN "school"."school" sc ON "st"."school_id" = "sc"."id"
		INNER JOIN school_affiliation.school_affiliation_school sas ON sc.id = sas.school_id
		INNER JOIN school_affiliation.school_affiliation sa ON sas.school_affiliation_id = sa.id
		LEFT JOIN teacher_weekly_homework twh ON "ts"."teacher_id" = "twh"."teacher_id" 
		WHERE TRUE
	`

	if filter.SchoolAffiliationType != nil {
		query += fmt.Sprintf(` AND "sa"."school_affiliation_group" = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationType)
		argsIndex++
	}
	if filter.SchoolId != nil {
		query += fmt.Sprintf(` AND "sc"."id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.SchoolCode != nil {
		query += fmt.Sprintf(` AND "sc"."code" = $%d`, argsIndex)
		args = append(args, filter.SchoolCode)
		argsIndex++
	}
	if filter.SchoolName != nil {
		query += fmt.Sprintf(` AND "sc"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+helper.Deref(filter.SchoolName)+"%")
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "ts"."homework_count" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	bestTeachers := []constant.BestTeacherListByHomework{}
	err := postgresRepository.Database.Select(&bestTeachers, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bestTeachers, nil
}
