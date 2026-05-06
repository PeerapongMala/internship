package postgres

import (
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

// //////////////////////// CLMS Global announcement - add PAGE //////////////////////////
func (postgresRepository *postgresRepository) AddGlobalAnnounce(c constant.CreateGlobalAnnounceRequest) (int, error) {
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
	"created_by",
	"admin_login_as"
	)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
	RETURNING id;
	`
	var id int
	err := postgresRepository.Database.QueryRow(
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
		c.AdminLoginAs,
	).Scan(&id)
	if err != nil {
		log.Print(err)
		return 0, err
	}
	return id, nil

}
