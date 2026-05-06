package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) AnnouncementCreate(req constant.TeacherAnnounceCreate) error {
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

	`

	_, err := postgresRepository.Database.Exec(
		query,
		req.SchoolId,
		req.Scope,
		req.Type,
		req.StartAt,
		req.EndAt,
		req.Title,
		req.Description,
		req.Image,
		req.Status,
		time.Now().UTC(),
		req.CreatedBy,
		req.AdminLoginAs,
	)
	if err != nil {
		return err
	}
	return nil
}
