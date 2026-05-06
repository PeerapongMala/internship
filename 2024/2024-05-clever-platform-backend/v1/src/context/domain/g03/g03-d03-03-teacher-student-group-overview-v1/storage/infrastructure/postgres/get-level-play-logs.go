package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
)

func (postgresRepository postgresRepository) GetLevelPlaylogs(studyGroupId int, filter constant.LevelPlayLogFilter) (entities []constant.LevelPlayLogEntity, err error) {
	query := `
		SELECT
			llpl.*
		FROM
			level.level_play_log AS llpl
		JOIN class.study_group_student AS sgs
			ON sgs.student_id = llpl.student_id
		JOIN level.level AS ll
			ON llpl.level_id = ll.id
		WHERE
			sgs.study_group_id = $1
	`
	args := []interface{}{studyGroupId}
	argsIndex := 2

	if len(filter.SubLessonIds) > 0 {
		query += fmt.Sprintf(` AND ll.sub_lesson_id = ANY($%d)`, argsIndex)
		args = append(args, filter.SubLessonIds)
		argsIndex++
	}

	if filter.StartAt != nil {
		query += fmt.Sprintf(` AND llpl.played_at >= $%d`, argsIndex)
		args = append(args, filter.StartAt)
		argsIndex++
	}

	if filter.EndAt != nil {
		query += fmt.Sprintf(` AND llpl.played_at <= $%d`, argsIndex)
		args = append(args, filter.EndAt)
		argsIndex++
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
