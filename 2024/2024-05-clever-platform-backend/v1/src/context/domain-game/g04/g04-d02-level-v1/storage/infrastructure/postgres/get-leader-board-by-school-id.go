package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLeaderBoardBySchoolId(levelIds []int, schoolId int, startDate string, endDate string, pagination *helper.Pagination, userId string) ([]constant.LeaderBoardDataEntity, error) {
	query := `
		WITH current_class AS (
			SELECT
				"c"."academic_year",
				"c"."year"
			FROM "school"."class_student" cs
			INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
			WHERE "cs"."student_id" = $5
			ORDER BY "c"."academic_year" DESC
			LIMIT 1
		),
		student_play_stat AS (
			SELECT DISTINCT ON (cs.student_id)
				cs.student_id AS user_id,
				COALESCE(SUM(lpl.star), 0) AS star,
				COALESCE(SUM(lpl.time_used), 0) AS time_used
			FROM "school"."class_student" cs
			INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
			INNER JOIN current_class cc ON "c"."year" = "cc"."year" AND "c"."academic_year" = "cc"."academic_year"
			LEFT JOIN "level"."level_play_log" lpl
			ON lpl.student_id = cs.student_id
				AND lpl.level_id = ANY($1)
				AND lpl.played_at BETWEEN $3 AND $4
			WHERE c.school_id = $2
			GROUP BY user_id
		),
		ranked_users AS (
			SELECT
				sps.*,
				CONCAT(u.first_name, ' ', u.last_name) AS user_name,
				u.image_url AS user_image_url,
				RANK() OVER (
					ORDER BY
						sps.star DESC,
						sps.time_used ASC,
						u.first_name,
						u.last_name,
						sps.user_id
				) as global_rank
			FROM student_play_stat sps
			INNER JOIN "user"."user" u ON sps.user_id = u.id
		),
		paginated_users AS (
			SELECT *
			FROM ranked_users
			WHERE user_id != $5
			ORDER BY global_rank
			OFFSET $6 LIMIT $7
		),
		specific_user AS (
			SELECT *
			FROM ranked_users
			WHERE user_id = $5
		)
		SELECT * FROM (
			SELECT * FROM specific_user
			UNION ALL
			SELECT * FROM paginated_users
		) results
		ORDER BY global_rank;
	`
	args := []interface{}{levelIds, schoolId, startDate, endDate, userId, pagination.Offset, pagination.Limit}
	//argsIndex := len(args) + 1
	//
	//if pagination != nil {
	//	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	//	err := postgresRepository.Database.QueryRowx(
	//		countQuery,
	//		args...,
	//	).Scan(&pagination.TotalCount)
	//
	//	if err != nil {
	//		log.Printf("%+v", errors.WithStack(err))
	//		return nil, err
	//	}
	//	query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	//	args = append(args, pagination.Offset, pagination.Limit)
	//}

	entities := []constant.LeaderBoardDataEntity{}
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
