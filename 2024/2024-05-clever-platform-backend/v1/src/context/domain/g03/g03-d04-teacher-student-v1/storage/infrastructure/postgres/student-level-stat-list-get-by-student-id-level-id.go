package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentLevelStatListGetByStudentIdAndSubLevelId(userId string, levelId int, pagination *helper.Pagination) ([]constant.LevelPlayStatEntity, error) {
	stm := `
		WITH question_stat AS (
			SELECT
				lpl.id,
				AVG(qpl.time_used) AS average_time_used
            FROM question.question_play_log qpl
            INNER JOIN "level".level_play_log lpl ON lpl.id = qpl.level_play_log_id
            WHERE
                lpl.student_id = $1 AND
                lpl.level_id = $2
            GROUP BY lpl.id
		)


		-- MAIN_QUERY
		SELECT
			lpl.id,
			ROW_NUMBER() OVER (ORDER BY lpl.played_at) AS play_sequence,
			lpl.star AS score,
			question_stat.average_time_used,
			lpl.played_at

		FROM level.level_play_log AS lpl
        LEFT JOIN question_stat ON question_stat.id = lpl.id
		WHERE
			lpl.student_Id = $1 AND
			lpl.level_id = $2
		ORDER BY play_sequence ASC
	`

	queryBuilder := helper.NewQueryBuilder(stm, userId, levelId)
	queryBuilder.AddClosingQuery("")
	query, args := queryBuilder.Build()

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, queryBuilder.GetPlaceholderIndex(), queryBuilder.GetPlaceholderIndex()+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	var stats []constant.LevelPlayStatEntity
	if err := postgresRepository.Database.Select(&stats, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return stats, nil

}
