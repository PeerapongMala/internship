package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
)

func (postgresRepository *postgresRepository) CreateAnnounce(c constant.CreateAnnounceRequest) error {
	query := `
	INSERT INTO "announcement"."announcement" (
	"school_id",
	"scope",
	"type",
	"started_at",
	"ended_at",
	"title",
	"description",
	"image_url",
	"status",
	"created_at",
	"created_by"
	)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
	`

	_, err := postgresRepository.Database.Exec(
		query,
		c.SchoolId,
		c.Scope,
		c.Type,
		c.StartAt,
		c.EndAt,
		c.Title,
		c.Description,
		c.Image,
		c.Status,
		time.Now().UTC(),
		c.CreatedBy,
	)
	if err != nil {
		return err
	}
	return nil
}
