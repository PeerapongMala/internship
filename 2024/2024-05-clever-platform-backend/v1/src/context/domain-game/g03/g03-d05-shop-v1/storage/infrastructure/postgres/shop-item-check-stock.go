package postgres

func (postgresRepository *postgresRepository) ShopItemCheckStock(shopItemId int) (*bool, error) {
	query := `
		SELECT
			CASE
				WHEN (stock > 0 OR stock = -1 OR stock IS NULL) AND 
				(NOW() >= open_date AND (NOW() <= closed_date OR closed_date IS NULL)) THEN TRUE
				ELSE FALSE
			END AS valid
		FROM
		    "teacher_store"."teacher_store_item"
		WHERE
		    "id" = $1
	`
	var valid bool
	err := postgresRepository.Database.QueryRowx(query, shopItemId).Scan(&valid)
	if err != nil {
		return nil, err
	}

	return &valid, nil
}
