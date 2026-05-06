package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GetNewsAnnounce(pagination *helper.Pagination, filter constant.NewsAnnounceFilter) ([]constant.NewsAnnounceResponse, int, error) {
	query := `
	SELECT
	"an"."id",
	"sch"."id" AS "school_id",
	"sch"."name" AS "school_name",
	"sj"."id" AS "subject_id",
	"sj"."name" AS "subject_name",
	"asy"."academic_year",
	"y"."id" AS "year_id"  ,
	"sy"."short_name" AS "seed_year_name",
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
	LEFT JOIN "school"."school" sch
	ON "an"."school_id" = "sch"."id"
	LEFT JOIN "announcement"."announcement_system" asy
	ON "an"."id" = "asy"."announcement_id"
	LEFT JOIN "subject"."subject" sj
	ON "asy"."subject_id" = "sj"."id"
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "sj"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
	ON "y"."seed_year_id"  = "sy"."id"
	LEFT JOIN "user"."user" u
	ON "an"."updated_by" = "u"."id"
	WHERE "an"."scope" = 'Subject' AND "an"."type" = 'notification'
	
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
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "an"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.SchoolId != 0 {
		query += fmt.Sprintf(` AND "sch"."id" = $%d `, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "sj"."id" = $%d `, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "asy"."academic_year" = $%d `, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d `, argsIndex)
		args = append(args, filter.YearId)
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
		query += fmt.Sprintf(` AND "sch"."name" ILIKE $%d `, argsIndex)
		args = append(args, "%"+filter.SchoolName+"%")
		argsIndex++
	}
	query += fmt.Sprintf(` ORDER BY "an"."id" LIMIT $%d OFFSET $%d`, argsIndex, argsIndex+1)
	args = append(args, pagination.Limit, pagination.Offset)
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return nil, 0, err
	}

	responses := []constant.NewsAnnounceResponse{}
	for rows.Next() {
		response := constant.NewsAnnounceResponse{}
		err = rows.StructScan(&response)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, response)
	}

	countQuery := `
	SELECT COUNT (*) FROM
	 "announcement"."announcement" an
	LEFT JOIN "school"."school" sch
	ON "an"."school_id" = "sch"."id"
	LEFT JOIN "announcement"."announcement_system" asy
	ON "an"."id" = "asy"."announcement_id"
	LEFT JOIN "subject"."subject" sj
	ON "asy"."subject_id" = "sj"."id"
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "sj"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
	ON "y"."seed_year_id"  = "sy"."id"
	WHERE "an"."scope" = 'Subject' AND type = 'notification'
	`
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
		countQuery += fmt.Sprintf(` AND "sch"."id" = $%d `, countIndex)
		countArgs = append(countArgs, filter.SchoolId)
		countIndex++
	}
	if filter.SubjectId != 0 {
		countQuery += fmt.Sprintf(` AND "sj"."id" = $%d `, countIndex)
		countArgs = append(countArgs, filter.SubjectId)
		countIndex++
	}
	if filter.AcademicYear != 0 {
		countQuery += fmt.Sprintf(` AND "asy"."academic_year" = $%d `, countIndex)
		countArgs = append(countArgs, filter.AcademicYear)
		countIndex++
	}
	if filter.YearId != 0 {
		countQuery += fmt.Sprintf(` AND "sj"."id" = $%d `, countIndex)
		countArgs = append(countArgs, filter.YearId)
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
		countQuery += fmt.Sprintf(` AND "sch"."name" ILIKE $%d `, countIndex)
		countArgs = append(countArgs, "%"+filter.SchoolName+"%")
		countIndex++
	}
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
