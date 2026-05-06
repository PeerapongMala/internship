package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) TeacherShopSubjectLists(pagination *helper.Pagination, teacherId string) (r []constant.SubjectTeacherResponse, err error) {

	args := []interface{}{}

	query := `
				SELECT DISTINCT ON ("sub"."id")
					sub."name" as subject_name, sub."id" as subject_id, sub.updated_at ,CONCAT(u2.first_name,' ',u2.last_name) as updated_by_name,
					CONCAT(u.first_name,' ',u.last_name) as teacher_name, sy.name as year, sy.short_name as short_year,
					sub_t."id" as subject_teacher_id
				FROM
					"teacher_store"."teacher_store" as ts
				LEFT JOIN 
					"subject"."subject_teacher" as sub_t ON ts.subject_id = sub_t."subject_id" AND ts.teacher_id = sub_t.teacher_id
				LEFT JOIN 
					"subject"."subject" as sub ON sub_t.subject_id = sub."id"
				LEFT JOIN 
					"user"."user" as u ON sub_t.teacher_id = u."id"
				LEFT JOIN 
					"user"."user" as u2 ON sub.updated_by = u2."id"
				LEFT JOIN 
					"curriculum_group"."subject_group" as sg ON sub.subject_group_id = sg.id
				LEFT JOIN 
					"curriculum_group"."year" as y ON sg.year_id = y.id
				LEFT JOIN 
					"curriculum_group"."seed_year" as sy ON y.seed_year_id = sy.id
				WHERE 
					sub_t.teacher_id = $1 AND sub.status = 'enabled'
			`
	args = append(args, teacherId)

	if pagination != nil {
		err = postgresRepository.Database.QueryRowx(fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query), args...).Scan(&pagination.TotalCount)
		if err != nil {
			return r, err
		}
		query += fmt.Sprintf(` ORDER BY sub."id" LIMIT $%d OFFSET $%d`, len(args)+1, len(args)+2)
		args = append(args, pagination.Limit, pagination.Offset)
	}

	if err = postgresRepository.Database.Select(&r, query, args...); err != nil {
		return r, err
	}

	return r, nil
}
