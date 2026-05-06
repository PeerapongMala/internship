package postgres

import (
	"database/sql"
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) GetGlobalAnnounceById(AnnounceId int) (*constant.GlobalAnnounceResponse, error) {
	query := `
	SELECT
	"an"."id",
	"s"."id" AS "school_id",
	"s"."name" AS "school_name",
	"an"."scope",
	"an"."type",
	"an"."title",
	"an"."image_url",
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
	WHERE  scope = 'School' AND type = 'system' AND "an"."id" = $1
	`
	row := postgresRepository.Database.QueryRow(query, AnnounceId)
	response := constant.GlobalAnnounceResponse{}

	err := row.Scan(
		&response.Id,
		&response.SchoolId,
		&response.SchoolName,
		&response.Scope,
		&response.Type,
		&response.Title,
		&response.ImageUrl,
		&response.Description,
		&response.Status,
		&response.StartAt,
		&response.EndAt,
		&response.CreatedAt,
		&response.CreatedBy,
		&response.UpdatedAt,
		&response.UpdatedBy,
		&response.AdminLoginas,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("not found")
		}
		return nil, err
	}
	return &response, nil
}
