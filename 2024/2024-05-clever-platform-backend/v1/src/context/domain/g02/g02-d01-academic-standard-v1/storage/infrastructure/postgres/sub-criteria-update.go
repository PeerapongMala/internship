package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
)

func (postgresRepository *postgresRepository) SubCriteriaUpdate(c constant.SubCriteriaUpdateRequest) error {
	query := `UPDATE "curriculum_group"."sub_criteria"
	SET curriculum_group_id = $1,
	name = $2,
	updated_at = $3,
	updated_by = $4
	WHERE id = $5
	`
	result, err := postgresRepository.Database.Exec(query,
		c.CurriculumGroupId,
		c.Name,
		time.Now().UTC(),
		c.UpdatedBy,
		c.Id,
	)
	if err != nil {
		return err
	}
	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("Subcriteria id is not exist")
	}
	return nil
}
