package postgres

import (
	"fmt"
	"github.com/lib/pq"
	"github.com/pkg/errors"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) LeaderBoardList(studentId string, filter *constant.LeaderBoardFilter, pagination *helper.Pagination) (eventIds pq.Int64Array, eventDetails *constant.LeaderBoardTitle, stats []constant.LeaderBoardResponse, err error) {
	query := `
	WITH school AS (
		SELECT
			"school_id"
		FROM "user"."student"
		WHERE "user_id" = $1
		LIMIT 1
	),
	"event_ids" AS (
		SELECT
			"a"."id"
		FROM "announcement"."announcement_event" ae
		INNER JOIN "announcement"."announcement" a ON "ae"."announcement_id" = "a"."id"
		INNER JOIN school ON "a"."school_id" = school.school_id
		WHERE
			arcade_game_id = $2
			AND ($3 BETWEEN "a"."started_at" AND "a"."ended_at")
		ORDER BY "a"."id" DESC
	),
	latest_event_details AS (
		SELECT
			"title",
			"started_at",
			"ended_at"
		FROM event_ids ei
		INNER JOIN "announcement"."announcement" a ON "ei"."id" = "a"."id"
		`
	args := []interface{}{studentId, filter.ArcadeGameId, time.Now().UTC()}
	argsIndex := len(args) + 1

	if filter.EventId != 0 {
		query += fmt.Sprintf(` WHERE ei.id = $%d`, argsIndex)
		args = append(args, filter.EventId)
		argsIndex++
	}

	query += `
	ORDER BY "ei"."id" DESC
	LIMIT 1
	)
	SELECT
		COALESCE(ARRAY_AGG("ei"."id"), '{}'::int[]),
		led.*
	FROM "event_ids" ei
	LEFT JOIN latest_event_details led ON TRUE
	GROUP BY led.title, led.started_at, led.ended_at
	`
	var title, startDate, endDate string
	err = postgresRepository.Database.QueryRowx(query, args...).Scan(&eventIds, &title, &startDate, &endDate)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return eventIds, eventDetails, stats, err
	}
	eventDetails = &constant.LeaderBoardTitle{
		Type:      filter.Date,
		Name:      title,
		StartDate: startDate,
		EndDate:   endDate,
	}

	query = `
	WITH "current_class" AS (
		SELECT
			"c"."id",
			"c"."year",
			"c"."academic_year",
			"sas"."school_affiliation_id"
		FROM
			"school"."class_student" cs
		INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		INNER JOIN "school_affiliation"."school_affiliation_school" sas ON "c"."school_id" = "sas"."school_id"
		WHERE "cs"."student_id" = $1
		ORDER BY "c"."academic_year" DESC
		LIMIT 1
	),
	stats AS (
		SELECT
			cs.student_id,
			COALESCE(SUM(apl.score), 0) AS total_score,
			COALESCE(SUM(apl.time_used), 0) AS total_time
		FROM "class"."class" c
		INNER JOIN "school_affiliation"."school_affiliation_school" sas ON "c"."school_id" = "sas"."school_id"
		INNER JOIN school.class_student cs ON c.id = cs.class_id
		LEFT JOIN arcade.arcade_play_log apl ON cs.class_id = apl.class_id AND cs.student_id = apl.student_id
			AND cs.student_id = apl.student_id
			AND apl.arcade_game_id = $2
	`
	args = []interface{}{studentId, filter.ArcadeGameId, pagination.Offset, pagination.Limit}
	argsIndex = len(args) + 1

	if filter.Date != "" {
		switch filter.Date {
		case constant.Week:
			query += ` AND apl.played_at >= (DATE_TRUNC('week', NOW() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'UTC')
				AND apl.played_at < ((DATE_TRUNC('week', NOW() AT TIME ZONE 'Asia/Bangkok') + INTERVAL '1 week') AT TIME ZONE 'UTC')
			`
		case constant.Month:
			query += ` AND apl.played_at >= (DATE_TRUNC('month', NOW() AT TIME ZONE 'Asia/Bangkok') AT TIME ZONE 'UTC')
				AND apl.played_at < (DATE_TRUNC('month', NOW() AT TIME ZONE 'Asia/Bangkok') + INTERVAL '1 month') AT TIME ZONE 'UTC'
			`
		case constant.Event:
			query += fmt.Sprintf(` AND "apl"."announcement_id" = $%d
			`, argsIndex)
			argsIndex++
			args = append(args, filter.EventId)
		}
	}

	if filter.Type != "" {
		switch filter.Type {
		case constant.Class:
			query += ` INNER JOIN "current_class" cc ON "c"."id" = "cc"."id"`
		case constant.Year:
			query += ` INNER JOIN "current_class" cc ON "c"."year" = "cc"."year" AND "c"."academic_year" = "cc"."academic_year"`
		case constant.Affiliation:
			query += ` INNER JOIN "current_class" cc ON "sas"."school_affiliation_id" = "cc"."school_affiliation_id"`
		}
	} else {
		query += ` INNER JOIN "current_class" cc ON "c"."id" = "cc"."id"`
	}

	query += ` LEFT JOIN "announcement"."announcement" a ON "apl"."announcement_id" = "a"."id"`

	query += ` GROUP BY cs.student_id
	),
	ranked_users AS (
		SELECT
			ss.student_id AS user_id,
			u.image_url AS user_image_url,
			CONCAT(u.first_name, ' ', u.last_name) AS user_name,
			ss.total_score,
			ss.total_time,
			RANK() OVER (ORDER BY ss.total_score DESC, ss.total_time ASC, u.first_name, u.last_name, ss.student_id) as global_rank
		FROM stats ss
 		INNER JOIN "user"."user" u ON "ss"."student_id" = "u"."id"
	),
	paginated_users AS (
		SELECT *
		FROM ranked_users
		WHERE user_id != $1
		ORDER BY global_rank
		OFFSET $3 LIMIT $4
	),
	specific_user AS (
		SELECT *
		FROM ranked_users
		WHERE user_id = $1 
	)
	SELECT
		global_rank,
		user_image_url AS student_image,
		user_id AS student_id,
		user_name AS student_name,
		total_score,
		total_time
	FROM (
		SELECT * FROM specific_user
		UNION ALL
		SELECT * FROM paginated_users
	) results
	ORDER BY global_rank;
	`

	//if pagination != nil {
	//	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	//	err := postgresRepository.Database.QueryRowx(
	//		countQuery,
	//		args...,
	//	).Scan(&pagination.TotalCount)
	//
	//	if err != nil {
	//		log.Printf("%+v", errors.WithStack(err))
	//		return eventIds, eventDetails, stats, err
	//	}
	//	query += fmt.Sprintf(` ORDER BY "s"."total_score" DESC, "u"."first_name", "u"."last_name" ASC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
	//	args = append(args, pagination.Offset, pagination.Limit)
	//}

	err = postgresRepository.Database.Select(&stats, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return eventIds, eventDetails, stats, err
	}

	return eventIds, eventDetails, stats, err
}
