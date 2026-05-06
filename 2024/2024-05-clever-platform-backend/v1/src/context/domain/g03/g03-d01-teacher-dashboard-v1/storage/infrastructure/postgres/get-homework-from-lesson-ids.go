package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
)

func (postgresRepository *postgresRepository) GetHomeworksFromLessonIds(lessonIds []int, filter *constant.HomeworkFromLessonIdsFilter, teacherId string) (entities []constant.HomeworkEntity, err error) {
	query := `
		WITH "school_id" AS (
		    SELECT DISTINCT "school_id" FROM "school"."school_teacher" WHERE "user_id" = $2
		)
		SELECT
			h.*
		FROM homework.homework_template AS ht
		INNER JOIN homework.homework AS h ON ht.id = h.homework_template_id
		INNER JOIN "school"."school_teacher" st ON "st"."user_id" = "ht"."teacher_id"
		INNER JOIN "school_id" si ON si.school_id = "st"."school_id"
		WHERE
			ht.lesson_id = ANY($1)
	`
	args := []interface{}{lessonIds, teacherId}
	argsIndex := len(args) + 1

	conditions := []string{}
	// started_at
	if filter != nil && filter.StartDateStartAt != nil {
		conditions = append(conditions, fmt.Sprintf(`h.started_at >= $%d`, argsIndex))
		args = append(args, filter.StartDateStartAt)
		argsIndex++
	}
	if filter != nil && filter.StartDateEndAt != nil {
		conditions = append(conditions, fmt.Sprintf(`h.started_at <= $%d`, argsIndex))
		args = append(args, filter.StartDateEndAt)
		argsIndex++
	}

	// due_at
	if filter != nil && filter.DueDateStartAt != nil {
		conditions = append(conditions, fmt.Sprintf(`h.due_at >= $%d`, argsIndex))
		args = append(args, filter.DueDateStartAt)
		argsIndex++
	}
	if filter != nil && filter.DueDateEndAt != nil {
		conditions = append(conditions, fmt.Sprintf(`h.due_at <= $%d`, argsIndex))
		args = append(args, filter.DueDateEndAt)
		argsIndex++
	}

	// closed_at
	if filter != nil && filter.ClosedDateStartAt != nil {
		conditions = append(conditions, fmt.Sprintf(`h.closed_at >= $%d`, argsIndex))
		args = append(args, filter.ClosedDateStartAt)
		argsIndex++
	}
	if filter != nil && filter.ClosedDateEndAt != nil {
		conditions = append(conditions, fmt.Sprintf(`h.closed_at <= $%d`, argsIndex))
		args = append(args, filter.ClosedDateEndAt)
		argsIndex++
	}

	if len(conditions) > 0 {
		query += fmt.Sprintf(` AND %s`, strings.Join(conditions, " AND "))
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	entities = []constant.HomeworkEntity{}
	for rows.Next() {
		item := constant.HomeworkEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
