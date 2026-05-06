package postgres

import "fmt"

func (postgresRepository *postgresRepository) DeletePlayId(PlayId string) error {
	query := `
	DELETE 
	FROM "arcade"."play_id"
	WHERE play_id = $1
	`
	result, err := postgresRepository.Database.Exec(query, PlayId)
	if err != nil {
		return err
	}
	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("not found")
	}
	return nil
}
