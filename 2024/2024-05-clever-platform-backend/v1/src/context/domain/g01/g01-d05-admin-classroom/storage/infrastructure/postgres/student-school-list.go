package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"log"
)

func (repo *postgresRepository) StudentListBySchool(schoolId int, search string, excludeClassroomId int, pagination *helper.Pagination) ([]constant.StudentSearchEntity, error) {
	query := `
		SELECT
			u."id" as "id",
			s.student_id as "student_id",
			u."title",
			u."first_name",
			u."last_name",
			u."status"
		FROM "user"."student" AS s
		LEFT JOIN "user"."user" AS u ON u.id = s.user_id
		LEFT JOIN "school"."class_student" AS cs ON cs.student_id = s.user_id
		LEFT JOIN "class"."class" AS c ON cs.class_id = c.id
		WHERE s.user_id NOT IN (
			SELECT DISTINCT cs.student_id 
			FROM "school"."class_student" AS cs
			INNER JOIN "class"."class" AS c ON cs.class_id = c.id
			WHERE c.status != 'disabled'
		)
		AND s.school_id = $1
	`
	args := []interface{}{schoolId}
	idx := 2

	if excludeClassroomId > 0 {
		query += `
			AND NOT EXISTS (
				SELECT 1
				FROM school.class_student cs
				WHERE cs.student_id = s.user_id
				AND cs.class_id = $2
			)
		`
		args = append(args, excludeClassroomId)
		idx++
	}

	if search != "" {
		qSearch := "%" + search + "%"
		query += fmt.Sprintf(`
			AND (
				s.student_id ILIKE $%d
				OR s.year ILIKE $%d
				OR u.first_name ILIKE $%d
				OR u.last_name ILIKE $%d
			)
		`, idx, idx+1, idx+2, idx+3)

		args = append(args, qSearch, qSearch, qSearch, qSearch)
		idx += 4
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM (%s) as count_table", query)
	err := repo.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", err)
		return nil, err
	}

	query += fmt.Sprintf(` ORDER BY "%s" %s`, pagination.SortBBy, pagination.SortOrder)
	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, idx, idx+1)
	args = append(args, pagination.Offset, pagination.Limit)

	students := []constant.StudentSearchEntity{}
	err = repo.Database.Select(&students, query, args...)
	if err != nil {
		log.Printf("%+v", err)
		return nil, err
	}

	return students, nil
}
