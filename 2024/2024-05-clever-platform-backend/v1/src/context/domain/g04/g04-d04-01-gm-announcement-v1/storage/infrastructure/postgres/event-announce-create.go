package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"

func (postgresRepository *postgresRepository) AddEventAnnounce(c constant.CreateEventAnnounceRequest) error {
	id, err := postgresRepository.AddGlobalAnnounce(constant.CreateGlobalAnnounceRequest{
		SchoolId:     c.SchoolId,
		Scope:        c.Scope,
		Type:         c.Type,
		StartAt:      c.StartAt,
		EndAt:        c.EndAt,
		Title:        c.Title,
		Description:  c.Description,
		Image:        c.Image,
		Status:       c.Status,
		CreatedBy:    c.CreatedBy,
		AdminLoginAs: c.AdminLoginAs,
	})
	if err != nil {
		return err
	}

	query := `INSERT INTO "announcement"."announcement_event"(
	"announcement_id",
	"subject_id",
	"academic_year",
	"arcade_game_id"
)
	VALUES ($1,$2,$3,$4)
	`
	_, err = postgresRepository.Database.Exec(query,
		id,
		c.SubjectId,
		c.AcademicYear,
		c.ArcadeGameId,
	)
	if err != nil {
		return err
	}

	return nil
}
