package postgres

import (
	"fmt"
	"log"

	"github.com/pkg/errors"
)


func (postgresRepository *postgresRepository) DeleteGradeIndicatorById(id int) error {
	
	query := "DELETE FROM grade.template_indicator WHERE id = $1"
	result, err := postgresRepository.Database.Exec(
		query,
		id,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		log.Printf("%+v", errors.WithStack(err))
		return fmt.Errorf("indicator_id is not exist")
	}

	return nil
}
