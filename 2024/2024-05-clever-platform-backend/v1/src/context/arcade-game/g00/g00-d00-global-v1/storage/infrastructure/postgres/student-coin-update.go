package postgres

func (postgresRepository *postgresRepository) UpdateStudentCoin(studentId string, coin int) error {
	query := `
	UPDATE "inventory"."inventory"
	SET arcade_coin = $1
	WHERE student_id = $2
	`
	_, err := postgresRepository.Database.Exec(query, coin, studentId)
	if err != nil {
		return err
	}

	return nil
}
