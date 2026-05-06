package postgres

func (postgresRepository *postgresRepository) GetStudentArcadeCoinById(studentId string) (int, error) {
	query := `
	SELECT 
	arcade_coin 
	FROM "inventory"."inventory"
	WHERE student_id = $1
	`
	var arcadeCoin int
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&arcadeCoin)
	if err != nil {
		return 0, err
	}
	return arcadeCoin, nil
}
