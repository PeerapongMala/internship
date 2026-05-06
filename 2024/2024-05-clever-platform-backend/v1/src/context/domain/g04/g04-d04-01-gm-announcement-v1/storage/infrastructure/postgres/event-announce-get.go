package postgres

import (
	"database/sql"
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) GetEventAnnounceById(AnnounceId int) (*constant.EventAnnounceResponse, error) {
	query := `
	SELECT
	"an"."id",
	"sch"."id" AS "school_id",
	"sch"."name" AS "school_name" ,
	"sj"."id" AS "subject_id",
	"sj"."name" AS "subject_name" ,
	"ae"."academic_year",
	"y"."id" AS "year_id",
	"sy"."short_name" AS "seed_year_name" ,
	"an"."scope",
	"an"."type",
	"an"."title",
	"an"."image_url",
	"an"."description",
	"an"."status",
	"ag"."id" AS "arcade_game_id",
	"ag"."name" AS "arcade_game_name" ,
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
	LEFT JOIN "announcement"."announcement_event" ae
	ON "an"."id" = "ae"."announcement_id"
	LEFT JOIN "subject"."subject" sj
	ON "ae"."subject_id" = "sj"."id"
	LEFT JOIN "curriculum_group"."subject_group" sg
	ON "sj"."subject_group_id" = "sg"."id"
	LEFT JOIN "curriculum_group"."year" y
	ON "sg"."year_id" = "y"."id"
	LEFT JOIN "curriculum_group"."seed_year" sy
	ON "y"."seed_year_id" = "sy"."id"
	LEFT JOIN "arcade"."arcade_game" ag
	ON "ae"."arcade_game_id" = "ag"."id"
	LEFT JOIN "user"."user" u
	ON "an"."updated_by" = "u"."id"
	WHERE "an"."scope" = 'Subject' AND"an"."type" = 'event' AND "an"."id" = $1
	`

	row := postgresRepository.Database.QueryRow(query, AnnounceId)

	response := constant.EventAnnounceResponse{}
	err := row.Scan(
		&response.Id,
		&response.SchoolId,
		&response.SchoolName,
		&response.SubjectId,
		&response.SubjectName,
		&response.AcademicYear,
		&response.YearId,
		&response.SeedYearName,
		&response.Scope,
		&response.Type,
		&response.TiTle,
		&response.ImageUrl,
		&response.Description,
		&response.Status,
		&response.ArcadeGameId,
		&response.ArcadeGameName,
		&response.StartAt,
		&response.EndAt,
		&response.CreatedAt,
		&response.CreatedBy,
		&response.UpdatedAt,
		&response.UpdatedBy,
		&response.AdminLoginAs,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("not found")
		}
		return nil, err
	}
	return &response, nil
}
