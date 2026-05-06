package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetUserDataAndPlayWithHomeworkIdAndStudentIds(homeworkId int, studentIds []string, filter *constant.HomeworkSubmitDetailListFilter) ([]constant.UserDataPlayHomeworkEntity, error) {
	query := `
	    WITH homework_levels AS (
	        SELECT
	            htl.level_id
	        FROM
	            "homework"."homework" h
	        JOIN
	            "homework"."homework_template_level" htl ON h.homework_template_id = htl.homework_template_id
	        WHERE
	            h.id = $1
	    ), student_stats AS (
	        SELECT
	            student_ids.id,
	            MAX(lpl.played_at) AS max_played_at,
	            COUNT(lpl.id) AS count
	        FROM
	            (SELECT UNNEST($2::text[]) AS id) student_ids
	        LEFT JOIN
	            "level"."level_play_log" lpl ON lpl.student_id = student_ids.id AND lpl.homework_id = $1 AND lpl.level_id IN (SELECT level_id FROM homework_levels)
	        GROUP BY
	            student_ids.id
	    )
	    SELECT
	        ss.id AS user_id,
	        s.student_id AS student_no,
	        u.title,
	        u.first_name,
	        u.last_name,
	        ss.count AS level_play_count,
	        ss.max_played_at
	    FROM
	        student_stats ss
	    JOIN
	        "user"."user" u ON ss.id = u.id
	    JOIN
	        "user"."student" s ON u.id = s.user_id
	    ORDER BY
	        ss.id;
	`

	queryBuilder := helper.NewQueryBuilder(query, homeworkId, studentIds)

	//add search
	searchCol := []string{`s.user_id`, `s.student_id`, `u.title`, `u.first_name`, `u.last_name`}
	queryBuilder.ApplySearch(searchCol, filter.Search)

	query, args := queryBuilder.Build()

	entities := []constant.UserDataPlayHomeworkEntity{}
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, err
}
