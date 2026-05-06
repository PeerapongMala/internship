package postgres

func (postgresRepository *postgresRepository) TeacherShopItemCaseCountUsage(userId string, shopItemId int) (int, error) {
	query := `
		SELECT
			COUNT(*)
		FROM "teacher_store"."teacher_store_transaction"
		WHERE "teacher_store_item_id" = $1 AND "student_id" = $2
	`
	usage := 0
	err := postgresRepository.Database.QueryRowx(query, shopItemId, userId).Scan(&usage)
	if err != nil {
		return 0, err
	}
	return usage, nil
}
