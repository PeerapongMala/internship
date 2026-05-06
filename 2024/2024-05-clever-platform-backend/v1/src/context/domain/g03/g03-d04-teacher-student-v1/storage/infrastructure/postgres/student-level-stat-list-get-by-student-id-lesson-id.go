package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	domainutil "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/util"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentLevelStatListGetByStudentIdAndLessonId(
	userId string, lessonId int, filter constant.LessonStatFilter,
) ([]constant.LessonStatEntity, error) {

	args := []interface{}{userId, lessonId}
	argIndex := 2 // Starts at 2 since first two parameters are already included

	playStatStm := `
        SELECT
            lpl.level_id,
            MAX(lpl.star) AS score,
            COUNT(lpl.id) AS total_attempt,
            MAX(lpl.played_at) AS last_played_at
        FROM level.level_play_log AS lpl
        INNER JOIN "level"."level" l ON l.id = lpl.level_id
        INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
        WHERE
            lpl.student_id = $1 AND
            sl.lesson_id = $2
    `

	if filter.StartDate != nil {
		argIndex++
		args = append(args, filter.StartDate)
		playStatStm += fmt.Sprintf(" AND lpl.played_at >= $%d", argIndex)
	}

	if filter.EndDate != nil {
		argIndex++
		args = append(args, filter.EndDate)
		playStatStm += fmt.Sprintf(" AND lpl.played_at <= $%d", argIndex)
	}

	playStatStm += " GROUP BY lpl.level_id"

	// Do not remove -- MAIN_QUERY It is used as index for split string and create total count query
	stm := fmt.Sprintf(`
        WITH question_stat AS (
            SELECT
                l.sub_lesson_id,
                AVG(qpl.time_used) AS avg_time_used
            FROM question.question_play_log qpl
            INNER JOIN "level".level_play_log lpl ON lpl.id = qpl.level_play_log_id
            INNER JOIN "level"."level" l ON l.id = lpl.level_id
            INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
            WHERE
                lpl.student_id = $1 AND
                sl.lesson_id = $2
            GROUP BY l.sub_lesson_id
        ),
		avg_time AS (
			SELECT
				"sl"."id" AS "sub_lesson_id",
				COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
			FROM
				"level"."level_play_log" lpl
			INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			INNER JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
			WHERE "lpl"."student_id" = $1
			GROUP BY "sl"."id"
		),
        play_stat AS (
            %s
        )
		-- MAIN_QUERY
        SELECT
            sl.id,
            sl.index,
            sl.name,
			"at"."avg_time_used",
            COALESCE(MIN(lvl.index), 0) AS min_level_group,
            COALESCE(MAX(lvl.index), 0) AS max_level_group,
            COUNT(lvl.id) AS total_level,
            SUM(play_stat.score) AS score,
            COUNT(CASE WHEN play_stat.score > 0 THEN 1 END) AS total_passed_level,
            SUM(play_stat.total_attempt) AS total_attempt,
            MAX(play_stat.last_played_at) AS last_played_at
        FROM subject.sub_lesson AS sl
        LEFT JOIN level.level AS lvl ON sl.id = lvl.sub_lesson_id
        LEFT JOIN question_stat ON question_stat.sub_lesson_id = sl.id
        LEFT JOIN play_stat ON play_stat.level_id = lvl.id
		LEFT JOIN "avg_time" at ON "sl"."id" = "at"."sub_lesson_id"
        WHERE sl.lesson_id = $2
    `, playStatStm)

	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(filter.Search) != 0 {
		searchCols := []string{"sl.index", "sl.name", "lvl.index"}
		queryBuilder.ApplySearch(searchCols, filter.Search)
	}

	if filter.SubLessonId != 0 {
		queryBuilder.AddFilter("AND lvl.sub_lesson_id =", filter.SubLessonId)
	}

	closingQuery := "GROUP BY sl.id, at.avg_time_used ORDER BY sl.index ASC"
	if filter.Pagination != nil {
		count, err := domainutil.GetTotalCount(postgresRepository.Database, queryBuilder, closingQuery)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		filter.Pagination.TotalCount = count

	}

	if filter.Pagination != nil && filter.Pagination.Limit.Valid {
		limit := filter.Pagination.Limit.Int64
		offset := filter.Pagination.Offset
		if offset < 0 {
			offset = 0
		}
		closingQuery += fmt.Sprintf(" LIMIT %d OFFSET %d", limit, offset)
	}

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	var stats []constant.LessonStatEntity
	if err := postgresRepository.Database.Select(&stats, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return stats, nil
}
