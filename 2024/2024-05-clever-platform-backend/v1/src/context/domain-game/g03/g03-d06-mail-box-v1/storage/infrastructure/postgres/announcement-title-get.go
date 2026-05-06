package postgres

func (postgresRepository *postgresRepository) GetAnnouncementType(announceId int) (string, error) {
	query := `
	SELECT 
	type
	FROM "announcement"."announcement"
	WHERE id = $1
	`
	var Type string
	err := postgresRepository.Database.QueryRow(query, announceId).Scan(&Type)
	if err != nil {
		return "", err
	}
	return Type, nil
}
