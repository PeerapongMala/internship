package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (repo *postgresRepository) TeacherListByClassroom(classRoomId int, search string, pagination *helper.Pagination) ([]constant.TeacherClassroomEntity, error) {
	query := `
		SELECT
			u.id,
			u.title,
			u.first_name,
			u.last_name,
			u.email,
			u.last_login,
			u.status
		FROM "school"."class_teacher" ct
		JOIN "user"."user" u ON ct.teacher_id = u.id
		WHERE ct.class_id = $1
	`
	args := []interface{}{classRoomId}
	idx := 2
	if search != "" {
		// wildcard search across title, first_name, last_name, cast(id as text)
		qSearch := "%" + search + "%"
		query += fmt.Sprintf(`
			AND (
				u.title ILIKE $%d
				OR u.first_name ILIKE $%d
				OR u.last_name ILIKE $%d
				OR CAST(u.id AS TEXT) ILIKE $%d
			)
		`, idx, idx+1, idx+2, idx+3)
		args = append(args, qSearch, qSearch, qSearch, qSearch)
		idx += 4
	}

	// Count
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
	err := repo.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, idx, idx+1)
	args = append(args, pagination.Offset, pagination.Limit)

	teachers := []constant.TeacherClassroomEntity{}
	err = repo.Database.Select(&teachers, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teachers, nil
}
