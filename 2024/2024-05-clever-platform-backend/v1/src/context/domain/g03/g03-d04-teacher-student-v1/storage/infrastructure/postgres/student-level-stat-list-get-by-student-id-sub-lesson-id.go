package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentLevelStatListGetByStudentIdAndSubLessonId(userId string, subLessonId int, filter constant.SubLessonStatFilter) ([]constant.SubLessonStatEntity, error) {
	stm := `
		WITH avg_time AS (
			SELECT
				"l"."id" AS "level_id",
				COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
			FROM
				"level"."level_play_log" lpl
			INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			INNER JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
			WHERE "lpl"."student_id" = $1
			GROUP BY "l"."id"
		)
		SELECT
			lvl.id AS level_id,
			lvl.index,
			lvl.level_type,
			lvl.question_type,
			lvl.difficulty,
			MAX(lpl.star) AS score,
			SUM(lpl.time_used) AS total_time_used,
			COUNT(lpl.id) AS total_attempt,
			MAX(lpl.played_at) AS last_played_at,
			at.avg_time_used
		FROM
			"subject"."sub_lesson" sl
		INNER JOIN level.level AS lvl ON lvl.sub_lesson_id = sl.id
		LEFT JOIN level.level_play_log lpl ON lpl.level_id = lvl.id AND lpl.student_id = $1
		LEFT JOIN avg_time at ON lvl.id = at.level_id	
		WHERE
			lvl.sub_lesson_id = $2
	`
	closingQuery := "GROUP BY lvl.id, at.avg_time_used ORDER BY lvl.index ASC"

	args := []interface{}{
		userId,
		subLessonId,
	}

	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(filter.Search) != 0 {
		searhCols := []string{
			"lvl.level_type",
			"lvl.question_type",
			"lvl.difficulty",
		}
		queryBuilder.ApplySearch(searhCols, filter.Search)
	}

	if len(filter.Difficulty) != 0 {
		queryBuilder.AddFilter("AND lvl.difficulty =", filter.Difficulty)
	}

	if len(filter.QuestionType) != 0 {
		queryBuilder.AddFilter("AND lvl.question_type =", filter.QuestionType)
	}

	if filter.LevelType != "" {
		queryBuilder.AddFilter("AND lvl.level_type =", filter.LevelType)
	}

	if filter.StartDate != nil {
		queryBuilder.AddFilter("AND lpl.played_at >=", filter.StartDate)
	}

	if filter.EndDate != nil {
		queryBuilder.AddFilter("AND lpl.played_at <=", filter.EndDate)
	}

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	if filter.Pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&filter.Pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, queryBuilder.GetPlaceholderIndex(), queryBuilder.GetPlaceholderIndex()+1)
		args = append(args, filter.Pagination.Offset, filter.Pagination.Limit)
	}

	var stats []constant.SubLessonStatEntity
	if err := postgresRepository.Database.Select(&stats, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return stats, nil
}
