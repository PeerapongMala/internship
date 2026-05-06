package postgres

func (postgresRepository *postgresRepository) CheckStudyGroupExist(studentGroupID int) (bool, error) {
	query := `
	SELECT EXISTS (
		SELECT 1
		FROM class.study_group as sg
		WHERE 
			sg.id = $1
		)`

	var hasAccess bool
	err := postgresRepository.Database.QueryRow(query, studentGroupID).Scan(&hasAccess)
	if err != nil {
		return false, err
	}
	return hasAccess, nil
}
