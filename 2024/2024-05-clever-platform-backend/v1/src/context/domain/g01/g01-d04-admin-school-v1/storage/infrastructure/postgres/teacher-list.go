package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherList(filter *constant.TeacherFilter, pagination *helper.Pagination) ([]constant.TeacherEntity, error) {
	query := `
		SELECT
			"u1"."id",
			"u1"."email",
			"u1"."title",
			"u1"."first_name",
			"u1"."last_name",
			"u1"."id_number",
			"u1"."image_url",
			"u1"."status",
			"u1"."created_at",
			"u1"."created_by",
			"u1"."updated_at",
			"u2"."first_name" AS "updated_by",
			"u1"."last_login",
			"a"."subject_id" AS "line_user_id",
			aep.user_id IS NOT NULL AS "have_password",
			"sc"."id" AS "school_id",
			"sc"."name" AS "school_name",
			"sc"."code" AS "school_code",
			ARRAY(
				SELECT "uta"."teacher_access_id" FROM "user"."user_teacher_access" uta
				WHERE "uta".user_id = "u1"."id"
			) as "teacher_roles"
		FROM "user"."user" u1
		LEFT JOIN "user"."user" u2 
			ON "u1"."updated_by" = "u2"."id"
		LEFT JOIN "user"."user_role" ur
			ON "u1"."id" = "ur"."user_id"
		LEFT JOIN "school"."school_teacher" st
			ON "u1"."id" = "st"."user_id"
		LEFT JOIN "school"."school" sc
		    ON "st"."school_id" = "sc"."id"
		LEFT JOIN "auth"."auth_oauth" a
			ON "u1"."id" = "a"."user_id"
			AND "a"."provider" = $1
		LEFT JOIN
		    "auth"."auth_email_password" aep
			ON "u1"."id" = "aep"."user_id"
		LEFT JOIN 
			"user"."user_teacher_access" uta
			ON "uta"."user_id" = "u1"."id"
		WHERE
			"ur"."role_id" = $2
	`
	args := []interface{}{constant.Line, constant.Teacher}
	argsIndex := 3

	if filter.GradeSubjectId != 0 {
		schoolFilter, subjectFilter := "", ""
		if filter.SchoolId != 0 {
			schoolFilter = fmt.Sprintf(`AND "st2"."school_id" = $%d`, argsIndex)
			args = append(args, filter.SchoolId)
			argsIndex++
		}
		if filter.GradeSubjectId != 0 {
			subjectFilter = fmt.Sprintf(`AND "st"."subject_id" = $%d`, argsIndex)
			args = append(args, filter.GradeSubjectId)
			argsIndex++
		}
		query = fmt.Sprintf(`
			WITH "excluded_teachers" AS (
				SELECT DISTINCT "st"."teacher_id"
				FROM "subject"."subject_teacher" st
				INNER JOIN "school"."school_teacher" st2 ON "st"."teacher_id" = "st2"."user_id"
				WHERE TRUE %s %s
			)
			%s
			AND "u1"."id" NOT IN (SELECT "teacher_id" FROM "excluded_teachers")
		`, schoolFilter, subjectFilter, query)
	}

	if filter.TeacherAccess != 0 {
		query += fmt.Sprintf(` AND "uta"."teacher_access_id" = $%d`, argsIndex)
		args = append(args, filter.TeacherAccess)
		argsIndex++
	}

	if filter.Id != "" {
		query += fmt.Sprintf(` AND "u1"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.Email != "" {
		query += fmt.Sprintf(` AND "u1"."email" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Email+"%")
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "u1"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Title+"%")
		argsIndex++
	}
	if filter.FirstName != "" {
		query += fmt.Sprintf(` AND "u1"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.FirstName+"%")
		argsIndex++
	}
	if filter.LastName != "" {
		query += fmt.Sprintf(` AND "u1"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.LastName+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "u1"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "st"."school_id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}

	if filter.Search != "" {
		query += " AND ("
		query += fmt.Sprintf(`"u1"."email" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Search+"%")
		argsIndex++

		query += fmt.Sprintf(` OR "u1"."title" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Search+"%")
		argsIndex++

		query += fmt.Sprintf(` OR "u1"."first_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Search+"%")
		argsIndex++

		query += fmt.Sprintf(` OR "u1"."last_name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Search+"%")
		argsIndex++

		query += fmt.Sprintf(` OR "u1"."status" = $%d`, argsIndex)
		args = append(args, filter.Search)
		argsIndex++
		query += ")"
	}

	query += fmt.Sprintf(` GROUP BY "u1"."id", "u2"."first_name", "a"."subject_id", "aep"."user_id", "sc"."id" ORDER BY "u1"."id"`)

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	teacherEntities := []constant.TeacherEntity{}
	err := postgresRepository.Database.Select(&teacherEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherEntities, nil
}
