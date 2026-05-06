package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d00-01-global-announce-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateAnnounce(c constant.UpdateAnnounceRequest) error {
	query := `
	UPDATE "announcement"."announcement"
	SET school_id = $1,
	scope = $2,
	type = $3,
	started_at = $4,
	ended_at = $5,
	title = $6,
	description = $7,
	image_url = $8,
	status = $9,
	updated_at = $10,
	updated_by = $11
	WHERE id = $12
	`

	result, err := postgresRepository.Database.Exec(query,
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
		c.UpdatedBy,
		c.Id,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("Announce Id is not exist")
	}

	return nil
}
