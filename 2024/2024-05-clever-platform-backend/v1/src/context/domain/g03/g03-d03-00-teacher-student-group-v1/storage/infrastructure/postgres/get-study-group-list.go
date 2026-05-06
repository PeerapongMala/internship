package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetStudyGroupList(filter *constant.GetStudyGroupListFilter, pagination *helper.Pagination) ([]constant.StudentGroupResult, error) {
	baseQuery := `
		WITH "teacher_classes" AS (
		    SELECT
		        "class_id"
		    FROM "school"."class_teacher" ct
		    WHERE
		        "teacher_id" = $1
		),
		"teacher_subjects" AS (
		    SELECT
		        "subject_id"
		    FROM "subject"."subject_teacher" st
		    WHERE
		        "teacher_id" = $1
		),
		"best_student_scores" AS (
		    SELECT
		        "sg"."id",
		        "lpl"."student_id",
		        "l"."id" AS "level_id",
		        COUNT(DISTINCT
		            CASE
		                WHEN "lpl"."star" > 0 THEN "l"."id"
		                ELSE NULL
		            END
		        ) AS "passed_levels",
		        MAX("lpl"."star") AS "max_star",
		        COUNT(DISTINCT "lpl"."id") AS "log_count",
		        SUM("lpl"."time_used") AS "total_time"
		    FROM "class"."study_group" sg
		    LEFT JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		    LEFT JOIN "level"."level_play_log" lpl ON "sgs"."student_id" = "lpl"."student_id"
		    LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		    LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		    LEFT JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		    LEFT JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
		    WHERE (
		        sg."class_id" IN (SELECT "class_id" FROM "teacher_classes")
		        AND sg."subject_id" IN (SELECT "subject_id" FROM "teacher_subjects")
		    )
		    GROUP BY "sg"."id", "lpl"."student_id", "l"."id"
		),
		avg_time AS (
		    SELECT
				"sg"."id",
				AVG("qpl"."time_used") AS "avg_time"
			FROM "class"."study_group" sg
		    INNER JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		    INNER JOIN "level"."level_play_log" lpl ON "sgs"."student_id" = "lpl"."student_id"
		    INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		    INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		    INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		    INNER JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
			INNER JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
			WHERE (
		        sg."class_id" IN (SELECT "class_id" FROM "teacher_classes")
		        AND sg."subject_id" IN (SELECT "subject_id" FROM "teacher_subjects")
		    )
			GROUP BY "sg"."id"
		),
		tmp AS (
		    SELECT
		        "sg"."id",
		        "sg"."name",
		        "sg"."status",
		        "sg"."subject_id",
		        COALESCE(SUM("bss"."max_star"),0) AS "sum_max_star",
		        SUM("bss"."passed_levels") AS "passed_levels",
		        SUM("bss"."log_count") AS "log_count",
		        SUM("bss"."total_time") AS "total_time"
		    FROM "class"."study_group" sg
		    INNER JOIN "class"."class" c ON "sg"."class_id" = "c"."id" AND "c"."school_id" = $2
		    INNER JOIN "subject"."subject" s ON "sg"."subject_id" = "s"."id"
		    INNER JOIN "curriculum_group"."subject_group" sjg ON "s"."subject_group_id" = "sjg"."id"
		    INNER JOIN "best_student_scores" bss ON "bss"."id" = "sg"."id"
		    GROUP BY "sg"."id"
		),
		level_count AS (
		    SELECT
		        "tmp"."id",
		        COUNT(DISTINCT "l"."id") AS "level_count",
		        COUNT(DISTINCT "q"."id") AS "question_count"
		    FROM "tmp"
		    INNER JOIN "subject"."subject" s ON "tmp"."subject_id" = "s"."id"
		    INNER JOIN "subject"."lesson" ls ON "s"."id" = "ls"."subject_id"
		    INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
		    INNER JOIN "level"."level" l ON "l"."sub_lesson_id" = "sl"."id"
		    LEFT JOIN "question"."question" q ON "l"."id" = "q"."level_id"
		    GROUP BY "tmp"."id"
		),
		"student_count" AS (
		    SELECT
		        "tmp"."id",
		        COUNT("sgs"."student_id") AS "student_count"
		    FROM "tmp"
		    INNER JOIN "class"."study_group_student" sgs ON "tmp"."id" = "sgs"."study_group_id"
		    GROUP BY "tmp"."id"
		)
		SELECT DISTINCT ON ("tmp"."id")
		    "tmp"."id",
		    "s"."name" AS "subject_name",
		    "tmp"."name" AS "study_group_name",
		    "tmp"."status",
		    "c"."id" AS "class_id",
		    "c"."name" AS "room",
		    "c"."academic_year" AS "academic_year",
		    "c"."year" AS "year",
		    COALESCE("sc"."student_count", 0) AS "student_count",
		    COALESCE("tmp"."sum_max_star"::float / "sc"."student_count", 0) AS "avg_stars_earned",
		    COALESCE("lc"."level_count" * 3, 0) AS "avg_max_possible_stars",
		    COALESCE("tmp"."passed_levels" / "sc"."student_count", 0) AS "avg_passed_levels",
		    COALESCE("lc"."level_count", 0) AS "avg_all_levels",
		    COALESCE("tmp"."log_count" / "sc"."student_count", 0) AS "avg_time_per_question",
		    COALESCE("at"."avg_time", 0) AS "avg_play_time"
		FROM
		    tmp
		LEFT JOIN "student_count" sc ON "tmp"."id" = "sc"."id"
		LEFT JOIN "level_count" lc ON "tmp"."id" = "lc"."id"
		LEFT JOIN "subject"."subject" s ON "tmp"."subject_id" = s.id
		LEFT JOIN "class"."study_group" sg ON "tmp"."id" = "sg"."id"
		LEFT JOIN "class"."class" c ON "sg"."class_id" = c.id
		LEFT JOIN "avg_time" at ON "tmp"."id" = "at"."id"
		WHERE TRUE
	`
	baseArgs := []interface{}{filter.TeacherID, filter.SchoolID}
	argsIndex := len(baseArgs) + 1

	if filter.AcademicYear != 0 {
		baseQuery += fmt.Sprintf(" AND c.academic_year = $%d",
			argsIndex)
		baseArgs = append(baseArgs, filter.AcademicYear)
		argsIndex++
	}

	if filter.StudyGroupName != "" {
		baseQuery += fmt.Sprintf(" AND tmp.name ILIKE $%d",
			argsIndex)
		baseArgs = append(baseArgs, "%"+filter.StudyGroupName+"%")
		argsIndex++
	}

	if filter.Status != "" {
		baseQuery += fmt.Sprintf(" AND tmp.status = $%d",
			argsIndex)
		baseArgs = append(baseArgs, filter.Status)
		argsIndex++
	}

	if filter.Year != "" {
		baseQuery += fmt.Sprintf(" AND c.year = $%d",
			argsIndex)
		baseArgs = append(baseArgs, filter.Year)
		argsIndex++
	}

	if filter.SubjectID != 0 {
		baseQuery += fmt.Sprintf(" AND s.id = $%d",
			argsIndex)
		baseArgs = append(baseArgs, filter.SubjectID)
		argsIndex++
	}

	if filter.Class != "" {
		baseQuery += fmt.Sprintf(" AND c.name ILIKE $%d",
			argsIndex)
		baseArgs = append(baseArgs, "%"+filter.Class+"%")
		argsIndex++
	}

	if filter.ClassId != 0 {
		baseQuery += fmt.Sprintf(" AND c.id = $%d",
			argsIndex)
		baseArgs = append(baseArgs, filter.ClassId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, baseQuery)
		err := postgresRepository.Database.QueryRowx(countQuery,
			baseArgs...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		baseQuery += fmt.Sprintf(` ORDER BY "tmp"."id" OFFSET $%d LIMIT $%d`,
			argsIndex, argsIndex+1)
		baseArgs = append(baseArgs, pagination.Offset, pagination.Limit)
	}

	var results []constant.StudentGroupResult
	err := postgresRepository.Database.Select(&results, baseQuery, baseArgs...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return results, nil
}
