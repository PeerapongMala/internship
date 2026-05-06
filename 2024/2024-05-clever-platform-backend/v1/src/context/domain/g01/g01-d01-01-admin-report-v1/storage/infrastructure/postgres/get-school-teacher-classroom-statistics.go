package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AdminProgressGetSchoolTeacherClassroomStatistics(
	schoolID int,
	teacherID string,
	pagination *helper.Pagination,
	startDate *time.Time,
	endDate *time.Time,
) (progressReportEntities []constant.ProgressReport, err error) {
	progressReportEntities = []constant.ProgressReport{}
	query := `
	WITH "start_progress_reports" AS (
		SELECT
			"class_name",
			COALESCE(SUM("max_star"), 0) AS "total_max_stars"
		FROM (
			SELECT
				CONCAT("c"."year",'/',"c"."name") AS "class_name",
				"lpl"."student_id",
				"lpl"."level_id",
				MAX("lpl"."star") AS "max_star"
			FROM
				"school"."school_teacher" AS "st"
					LEFT JOIN "user"."user" AS "u" ON "st"."user_id" = "u"."id" 
					LEFT JOIN "school"."class_teacher" AS "ct" ON "st"."user_id" = "ct"."teacher_id"
					LEFT JOIN "class"."class" AS "c" ON "c"."id" = "ct"."class_id"	
					LEFT JOIN "level"."level_play_log" AS "lpl" ON "lpl"."class_id" = "ct"."class_id"
						AND "lpl"."played_at" <= $1
			WHERE st.school_id = $2 and st.user_id = $3
			GROUP BY "lpl"."student_id", "lpl"."level_id", "class_name"
		) as "sub"
		GROUP BY "class_name"
	),
	"end_progress_reports" AS (
		SELECT
			"class_name",
			COALESCE(SUM("max_star"), 0) AS "total_max_stars"
		FROM (
			SELECT
				CONCAT("c"."year",'/',"c"."name") AS "class_name",
				"lpl"."student_id",
				"lpl"."level_id",
				MAX("lpl"."star") AS "max_star"
			FROM
				"school"."school_teacher" AS "st"
					LEFT JOIN "user"."user" AS "u" ON "st"."user_id" = "u"."id" 
					LEFT JOIN "school"."class_teacher" AS "ct" ON "st"."user_id" = "ct"."teacher_id"
					LEFT JOIN "class"."class" AS "c" ON "c"."id" = "ct"."class_id"
					LEFT JOIN "level"."level_play_log" AS "lpl" ON "lpl"."class_id" = "ct"."class_id"
						AND "lpl"."played_at" <= $4
			WHERE st.school_id = $5 and st.user_id = $6
			GROUP BY "lpl"."student_id", "lpl"."level_id", "class_name"
		) as "sub"
		GROUP BY "class_name"
	)
	SELECT
		"spr"."class_name" AS "scope",
		CASE
		    WHEN "spr"."total_max_stars" = 0 AND "epr"."total_max_stars" != 0 THEN 100.00
			WHEN "spr"."total_max_stars" = 0 THEN 0.00
			ELSE (("epr"."total_max_stars" - "spr"."total_max_stars") / "spr"."total_max_stars"::DECIMAL(10,2)) * 100
		END AS "progress",
		COUNT(*) OVER() AS total_count
	FROM "start_progress_reports" AS "spr"
	LEFT JOIN "end_progress_reports" AS "epr"
		ON "spr"."class_name" = "epr"."class_name"
	`
	args := []interface{}{startDate, schoolID, teacherID, endDate, schoolID, teacherID}
	argsIndex := len(args) + 1

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "scope" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	progressReportEntities = []constant.ProgressReport{}
	err = postgresRepository.Database.Select(&progressReportEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return
	}

	if len(progressReportEntities) > 0 {
		helper.DerefPagination(pagination).TotalCount = progressReportEntities[0].TotalCount
	}

	return
}
