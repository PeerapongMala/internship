package postgres

func (postgresRepository *postgresRepository) HelperCaseHealthCheck() (bool, error) {
	query := `
		SELECT TRUE AS db_health
	`
	var health bool
	err := postgresRepository.Database.QueryRowx(query).Scan(&health)
	if err != nil {
		return false, err
	}
	return health, nil
}
