package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) AnnouncementList(pagination *helper.Pagination, schoolId int, filter constant.TeacherAnnounceFilter) ([]constant.TeacherAnnounceResponse, int, error) {
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
	WHERE  "an"."scope" = 'School' AND type = 'teacher'
	AND "s"."id" = $1
	`
	args := []interface{}{schoolId}
	argsIndex := 2
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
	query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
	args = append(args, schoolId)
	argsIndex++

	query += fmt.Sprintf(` ORDER BY "an"."id" LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}

	countQuery := `SELECT COUNT(*) 
	FROM "announcement"."announcement" an
	LEFT JOIN "school"."school"  s
	ON "an"."school_id" = "s"."id"
	WHERE "an"."scope" = 'School' AND "an"."type" = 'teacher'`
	countArgs := []interface{}{}
	countIndex := 1
	if filter.StartDate != "" {
		countQuery += fmt.Sprintf(` AND "an"."started_at"::DATE = $%d`, countIndex)
		countArgs = append(countArgs, filter.StartDate)
		countIndex++
	}
	if filter.EndDate != "" {
		countQuery += fmt.Sprintf(` AND "an"."ended_at"::DATE = $%d`, countIndex)
		countArgs = append(countArgs, filter.EndDate)
		countIndex++
	}

	if filter.Status != "" {
		countQuery += fmt.Sprintf(` AND "an"."status" = $%d`, countIndex)
		countArgs = append(countArgs, filter.Status)
		countIndex++
	}
	if filter.SchoolId != 0 {
		countQuery += fmt.Sprintf(` AND "s"."id" = $%d `, countIndex)
		countArgs = append(countArgs, filter.SchoolId)
		countIndex++
	}
	if filter.AnnouncementId != 0 {
		countQuery += fmt.Sprintf(` AND "an"."id" = $%d `, countIndex)
		countArgs = append(countArgs, filter.AnnouncementId)
		countIndex++
	}
	if filter.Title != "" {
		countQuery += fmt.Sprintf(` AND "an"."title" ILIKE $%d `, countIndex)
		countArgs = append(countArgs, "%"+filter.Title+"%")
		countIndex++
	}
	if filter.SchoolName != "" {
		countQuery += fmt.Sprintf(` AND "s"."name" ILIKE $%d `, countIndex)
		countArgs = append(countArgs, "%"+filter.SchoolName+"%")
		countIndex++
	}
	countQuery += fmt.Sprintf(` AND "s"."id" = $%d`, countIndex)
	countArgs = append(countArgs, schoolId)
	countIndex++
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.TeacherAnnounceResponse{}
	for rows.Next() {
		announce := constant.TeacherAnnounceResponse{}
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
	return responses, totalCount, nil
}
