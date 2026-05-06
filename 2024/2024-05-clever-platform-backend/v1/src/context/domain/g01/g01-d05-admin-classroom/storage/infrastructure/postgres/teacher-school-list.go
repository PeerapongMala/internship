package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherListBySchool(schoolId int, search string, excludeClassroomId int, pagination *helper.Pagination) ([]constant.TeacherEntity, error) {
	query := `
		SELECT
			u."id" as "id",
			u."title",
			u."first_name",
			u."last_name",
			u."status"
		FROM "school"."school_teacher" st
		JOIN "user"."user" u ON st."user_id" = u."id"
		WHERE st."school_id" = $1
	`
	args := []interface{}{schoolId}
	idx := 2

	if excludeClassroomId > 0 {
		query += `
			AND NOT EXISTS (
				SELECT 1
				FROM school.class_teacher ct
				WHERE ct.teacher_id = u.id
				AND ct.class_id = $2
			)
		`
		args = append(args, excludeClassroomId)
		idx++
	}

	if search != "" {
		qSearch := "%" + search + "%"
		query += fmt.Sprintf(`
			AND (
				u."title" ILIKE $%d
				OR u."first_name" ILIKE $%d
				OR u."last_name" ILIKE $%d
				OR CAST(u."id" AS TEXT) ILIKE $%d
			)
		`, idx, idx+1, idx+2, idx+3)

		args = append(args, qSearch, qSearch, qSearch, qSearch)
		idx += 4
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
	err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, idx, idx+1)
	args = append(args, pagination.Offset, pagination.Limit)
	teachers := []constant.TeacherEntity{}
	err = postgresRepository.Database.Select(&teachers, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teachers, nil
}
