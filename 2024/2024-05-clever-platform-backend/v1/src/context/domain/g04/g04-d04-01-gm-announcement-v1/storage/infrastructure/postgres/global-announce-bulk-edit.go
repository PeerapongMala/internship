package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) GlobalAnnounceBulkEdit(req constant.AnnounceBulkEdit, c constant.User) error {
	query := `
	UPDATE "announcement"."announcement"
	SET status = $1,
	updated_at = $2,
	updated_by = $3,
	admin_login_as = $4
	WHERE scope = 'School' AND type = 'system' AND id = $5 
	`
	result, err := postgresRepository.Database.Exec(
		query,
		req.Status,
		time.Now().UTC(),
		c.UpdatedBy,
		c.AdminLoginAs,
		req.Id,
	)
	if err != nil {

		return err
	}
	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("no result")
	}
	return nil
}
