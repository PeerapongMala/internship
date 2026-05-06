package postgres

func (postgresRepository *postgresRepository) GetStudentIdByStudentName(firstname string, lastname string) (string, error) {
	query := `
	SELECT
	id
	FROM "user"."user"
	WHERE first_name = $1 AND last_name = $2
	`
	var id string
	err := postgresRepository.Database.QueryRow(query, firstname, lastname).Scan(&id)
	if err != nil {
		return "", err
	}
	return id, nil
}
