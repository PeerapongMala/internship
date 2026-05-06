package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

// //////////////////////// CLMS Global announcement category system PAGE //////////////////////////
func (postgresRepository *postgresRepository) GetGlobalAnnounce(pagination *helper.Pagination, filter constant.SystemAnnounceFilter) ([]constant.GlobalAnnounceResponse, int, error) {

	query := `
	SELECT
	"an"."id",
	"s"."id" AS "school_id",
	"s"."name" AS "school_name",
	"an"."scope",
	"an"."type",
	"an"."title",
	"an"."description",
	"an"."status",
	"an"."started_at",
	"an"."ended_at",
	"an"."created_at",
	"an"."created_by",
	"an"."updated_at",
	"u"."first_name" AS "updated_by",
	"an"."admin_login_as"
	FROM "announcement"."announcement" an
	LEFT JOIN "school"."school" s
	ON "an"."school_id" = "s"."id"
	LEFT JOIN "user"."user" u
	ON "an"."updated_by" = "u"."id"
	WHERE  "an"."scope" = 'School' AND type = 'system'
	`
	args := []interface{}{}
	argsIndex := 1
	if filter.StartDate != "" {
		query += fmt.Sprintf(` AND "an"."started_at"::DATE = $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != "" {
		query += fmt.Sprintf(` AND "an"."ended_at"::DATE = $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}
	if filter.StartedAtStart != nil {
		query += fmt.Sprintf(` AND "an"."started_at" >= $%d`, argsIndex)
		args = append(args, *filter.StartedAtStart)
		argsIndex++
	}
	if filter.StartedAtEnd != nil {
		query += fmt.Sprintf(` AND "an"."started_at" <= $%d`, argsIndex)
		args = append(args, *filter.StartedAtEnd)
		argsIndex++
	}
	if filter.EndedAtStart != nil {
		query += fmt.Sprintf(` AND "an"."ended_at" >= $%d`, argsIndex)
		args = append(args, *filter.EndedAtStart)
		argsIndex++
	}
	if filter.EndedAtEnd != nil {
		query += fmt.Sprintf(` AND "an"."ended_at" <= $%d`, argsIndex)
		args = append(args, *filter.EndedAtEnd)
		argsIndex++
	}

	if filter.Status != "" {
		query += fmt.Sprintf(` AND "an"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d `, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.AnnouncementId != 0 {
		query += fmt.Sprintf(` AND "an"."id" = $%d `, argsIndex)
		args = append(args, filter.AnnouncementId)
		argsIndex++
	}
	if filter.Title != "" {
		query += fmt.Sprintf(` AND "an"."title" ILIKE $%d `, argsIndex)
		args = append(args, "%"+filter.Title+"%")
		argsIndex++
	}
	if filter.SchoolName != "" {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d `, argsIndex)
		args = append(args, "%"+filter.SchoolName+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, 0, err
		}
		query += fmt.Sprintf(` ORDER BY "an"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}

	//countQuery := `SELECT COUNT(*)
	//FROM "announcement"."announcement" an
	//LEFT JOIN "school"."school"  s
	//ON "an"."school_id" = "s"."id"
	//WHERE "an"."scope" = 'School' AND "an"."type" = 'system'`
	//countArgs := []interface{}{}
	//countIndex := 1
	//if filter.StartDate != "" {
	//	countQuery += fmt.Sprintf(` AND "an"."started_at"::DATE = $%d`, countIndex)
	//	countArgs = append(countArgs, filter.StartDate)
	//	countIndex++
	//}
	//if filter.EndDate != "" {
	//	countQuery += fmt.Sprintf(` AND "an"."ended_at"::DATE = $%d`, countIndex)
	//	countArgs = append(countArgs, filter.EndDate)
	//	countIndex++
	//}
	//
	//if filter.Status != "" {
	//	countQuery += fmt.Sprintf(` AND "an"."status" = $%d`, countIndex)
	//	countArgs = append(countArgs, filter.Status)
	//	countIndex++
	//}
	//if filter.SchoolId != 0 {
	//	countQuery += fmt.Sprintf(` AND "s"."id" = $%d `, countIndex)
	//	countArgs = append(countArgs, filter.SchoolId)
	//	countIndex++
	//}
	//if filter.AnnouncementId != 0 {
	//	countQuery += fmt.Sprintf(` AND "an"."id" = $%d `, countIndex)
	//	countArgs = append(countArgs, filter.AnnouncementId)
	//	countIndex++
	//}
	//if filter.Title != "" {
	//	countQuery += fmt.Sprintf(` AND "an"."title" ILIKE $%d `, countIndex)
	//	countArgs = append(countArgs, "%"+filter.Title+"%")
	//	countIndex++
	//}
	//if filter.SchoolName != "" {
	//	countQuery += fmt.Sprintf(` AND "s"."name" ILIKE $%d `, countIndex)
	//	countArgs = append(countArgs, "%"+filter.SchoolName+"%")
	//	countIndex++
	//}
	//var totalCount int
	//err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	//if err != nil {
	//	return nil, 0, err
	//}

	responses := []constant.GlobalAnnounceResponse{}
	for rows.Next() {
		announce := constant.GlobalAnnounceResponse{}
		err := rows.Scan(
			&announce.Id,
			&announce.SchoolId,
			&announce.SchoolName,
			&announce.Scope,
			&announce.Type,
			&announce.Title,
			&announce.Description,
			&announce.Status,
			&announce.StartAt,
			&announce.EndAt,
			&announce.CreatedAt,
			&announce.CreatedBy,
			&announce.UpdatedAt,
			&announce.UpdatedBy,
			&announce.AdminLoginas,
		)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, announce)
	}
	return responses, pagination.TotalCount, nil

}
