package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
)

func (postgresRepository postgresRepository) GetLevelPlayLogs(filter *constant.LevelPlayLogFilter) (entities []constant.LevelPlayLogEntity, err error) {
	query := `
		SELECT
			lpl.*
		FROM
			"level"."level_play_log" lpl
		LEFT JOIN "class"."study_group_student" sgs
			ON sgs.student_id = lpl.student_id
	`
	args := []interface{}{}
	argsIndex := 1

	conditions := []string{}
	if len(filter.StudyGroupIds) > 0 {
		conditions = append(conditions, fmt.Sprintf(`"sgs"."study_group_id" = ANY($%d)`, argsIndex))
		args = append(args, filter.StudyGroupIds)
		argsIndex++
	}

	if len(filter.LevelIds) > 0 {
		conditions = append(conditions, fmt.Sprintf(`"level_id" = ANY($%d)`, argsIndex))
		args = append(args, filter.LevelIds)
		argsIndex++
	}
	if len(filter.Ids) > 0 {
		conditions = append(conditions, fmt.Sprintf(`"id" = ANY($%d)`, argsIndex))
		args = append(args, filter.Ids)
		argsIndex++
	}
	if len(filter.HomeworkIds) > 0 {
		conditions = append(conditions, fmt.Sprintf(`"homework_id" = ANY($%d)`, argsIndex))
		args = append(args, filter.HomeworkIds)
		argsIndex++
	}
	if len(filter.ClassIds) > 0 {
		conditions = append(conditions, fmt.Sprintf(`"class_id" = ANY($%d)`, argsIndex))
		args = append(args, filter.ClassIds)
		argsIndex++
	}

	if filter.StartAt != nil {
		conditions = append(conditions, fmt.Sprintf(`"played_at" >= $%d`, argsIndex))
		args = append(args, *filter.StartAt)
		argsIndex++
	}

	if filter.EndAt != nil {
		conditions = append(conditions, fmt.Sprintf(`"played_at" <= $%d`, argsIndex))
		args = append(args, *filter.EndAt)
		argsIndex++
	}

	if len(conditions) > 0 {
		query += fmt.Sprintf(` WHERE %s`, strings.Join(conditions, " AND "))
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.LevelPlayLogEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
