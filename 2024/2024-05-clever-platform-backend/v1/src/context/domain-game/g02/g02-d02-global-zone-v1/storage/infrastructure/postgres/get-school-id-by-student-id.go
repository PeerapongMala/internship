package postgres

func (postgresRepository *postgresRepository) GetSchoolByStudentId(studentId string) (int, error) {
	query := `
		SELECT
		school_id 
		FROM "user"."student"
		WHERE user_id = $1
`
	var SchoolId int
	err := postgresRepository.Database.QueryRow(query, studentId).Scan(&SchoolId)
	if err != nil {
		return 0, err
	}
	return SchoolId, nil
}
