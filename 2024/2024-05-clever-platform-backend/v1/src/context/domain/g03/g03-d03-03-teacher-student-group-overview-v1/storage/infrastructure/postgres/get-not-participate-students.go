package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetNotParticipateStudents(
	studyGroupId int,
	pagination *helper.Pagination,
	filter *constant.NotParticipateStudentsFilter,
) (entities []constant.StudentLevelPlayLogCountEntity, err error) {
	entities = []constant.StudentLevelPlayLogCountEntity{}

	args := []interface{}{studyGroupId}
	argsIndex := 2

	levelPlayLogCondition := ""

	if filter != nil && filter.StartAt != nil {
		levelPlayLogCondition += fmt.Sprintf(` AND lpl.played_at >= $%d`, argsIndex)
		args = append(args, filter.StartAt)
		argsIndex++
	}
	if filter != nil && filter.EndAt != nil {
		levelPlayLogCondition += fmt.Sprintf(` AND lpl.played_at <= $%d`, argsIndex)
		args = append(args, filter.EndAt)
		argsIndex++
	}
	if len(filter.LessonIds) > 0 {
		levelPlayLogCondition += fmt.Sprintf(` AND sl.lesson_id = ANY($%d)`, argsIndex)
		args = append(args, filter.LessonIds)
		argsIndex++
	}
	if len(filter.SubLessonIds) > 0 {
		levelPlayLogCondition += fmt.Sprintf(` AND sl.id = ANY($%d)`, argsIndex)
		args = append(args, filter.SubLessonIds)
		argsIndex++
	}

	query := fmt.Sprintf(`
		SELECT
			sgs.student_id,
			0 AS level_play_log_count
		FROM
			class.study_group_student sgs
		WHERE
			sgs.study_group_id = $1
			AND NOT EXISTS (
				SELECT 1
					FROM level.level_play_log lpl
					INNER JOIN level.level l ON l.id = lpl.level_id
					INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
				WHERE 
					lpl.student_id = sgs.student_id
					%s
			)
	`, levelPlayLogCondition)

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s) AS count_sub`, query)
		err = postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		query += fmt.Sprintf(` ORDER BY sgs.student_id OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentLevelPlayLogCountEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
