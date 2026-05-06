package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateEventAnnounce(c constant.UpdateEventAnnounceRequest) error {
	err := postgresRepository.UpdateGlobalAnnounce(constant.UpdateGlobalAnnounceRequest{
		Id:           c.Id,
		SchoolId:     c.SchoolId,
		Scope:        c.Scope,
		Type:         c.Type,
		StartAt:      c.StartAt,
		EndAt:        c.EndAt,
		Title:        c.Title,
		Description:  c.Description,
		Image:        c.Image,
		Status:       c.Status,
		UpdatedBy:    c.UpdatedBy,
		AdminLoginAs: c.AdminLoginAs,
	})
	if err != nil {
		if err.Error() == "Announce id is not Exist" {
			return fmt.Errorf("Announce id is not Exist")
		}
		return err
	}
	query := `UPDATE "announcement"."announcement_event"
	SET subject_id = $1,
	academic_year = $2,
	arcade_game_id = $3
	WHERE announcement_id = $4 
	`
	_, err = postgresRepository.Database.Exec(query,
		c.SubjectId,
		c.AcademicYear,
		c.ArcadeGameId,
		c.Id,
	)
	if err != nil {
		return err
	}
	return nil
}
