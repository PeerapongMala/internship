package postgres

import "fmt"

func (postgresRepository *postgresRepository) DeleteAnnounce(id int) error {
	query := `DELETE FROM "announcement"."announcement" WHERE id = $1`

	result, err := postgresRepository.Database.Exec(query, id)
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
