package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
)

func (postgresRepository *postgresRepository) SubjectBulkEdit(SchoolId int, req constant.SubjectBulkEdit) error {
	query := `UPDATE "school"."school_subject"
	SET is_enabled = $1
	WHERE subject_id = $2 AND school_id = $3
	`
	result, err := postgresRepository.Database.Exec(query, req.IsEnabled, req.SubjectId, SchoolId)
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
