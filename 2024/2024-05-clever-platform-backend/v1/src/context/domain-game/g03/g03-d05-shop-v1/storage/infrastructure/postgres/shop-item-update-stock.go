package postgres

func (postgresRepository *postgresRepository) ShopItemUpdateStock(shopItemId int) error {
	query := `
		UPDATE "teacher_store"."teacher_store_item"
		SET "stock" = "stock" - 1
		WHERE
			"id" = $1
			AND "initial_stock" != -1
	`
	_, err := postgresRepository.Database.Exec(query, shopItemId)
	if err != nil {
		return err
	}

	return nil
}
