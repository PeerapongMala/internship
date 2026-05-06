package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLeaderBoardAll(levelIds []int, startDate string, endDate string, pagination *helper.Pagination, userId string) ([]constant.LeaderBoardDataEntity, error) {
	query := `
		WITH filtered_logs AS (
    		SELECT 
        		lpl.student_id,
        		SUM(lpl.star) AS star,
        		SUM(lpl.time_used) AS time_used
    		FROM "level"."level_play_log" lpl
    		WHERE lpl.level_id = ANY($1)
    		AND lpl.played_at BETWEEN $2 AND $3
    		GROUP BY lpl.student_id
		),
		student_play_stat AS (
    		SELECT 
        		stu.user_id,
        		COALESCE(fl.star, 0) AS star,
        		COALESCE(fl.time_used, 0) AS time_used
    		FROM "user"."student" stu
    		LEFT JOIN filtered_logs fl ON fl.student_id = stu.user_id
		),
		ranked_users AS (
			SELECT DISTINCT ON (sps.user_id)
				sps.*,
				CONCAT(u.first_name, ' ', u.last_name) AS user_name,
				u.image_url AS user_image_url,
				RANK() OVER (ORDER BY sps.star DESC, sps.time_used ASC, u.first_name, u.last_name, sps.user_id) as global_rank
			FROM student_play_stat sps
			INNER JOIN "user"."user" u
				ON sps.user_id = u.id
		),
		paginated_users AS (
			SELECT *
			FROM ranked_users
			WHERE user_id != $6
			ORDER BY global_rank
			OFFSET $4 LIMIT $5
		),
		specific_user AS (
			SELECT *
			FROM ranked_users
			WHERE user_id = $6
		)
		SELECT * FROM (
			SELECT * FROM specific_user
			UNION ALL
			SELECT * FROM paginated_users
		) results
		ORDER BY global_rank;
	`
	args := []interface{}{levelIds, startDate, endDate, pagination.Offset, pagination.Limit, userId}

	entities := []constant.LeaderBoardDataEntity{}
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
