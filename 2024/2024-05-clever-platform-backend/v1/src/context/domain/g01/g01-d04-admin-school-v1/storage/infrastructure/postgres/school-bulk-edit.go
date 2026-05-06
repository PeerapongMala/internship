package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
)

func (postgresRepository *postgresRepository) SchoolBulkEdit(req constant.SchoolBulkEdit, SubjectId string) error {
	query := `UPDATE "school"."school"
	SET status = $1,
	updated_at = $2,
	updated_by = $3
	WHERE id = $4
	`
	result, err := postgresRepository.Database.Exec(query, req.Status, time.Now().UTC(), SubjectId, req.Id)
	if err != nil {
		return err
	}
	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("row not update")
	}
	return nil
}
