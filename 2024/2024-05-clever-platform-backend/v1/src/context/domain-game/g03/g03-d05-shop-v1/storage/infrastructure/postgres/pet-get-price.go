package postgres

func (postgresRepository *postgresRepository) PetGetPrice(petId int) (*int, error) {
	query := `
		SELECT
			"sp"."price"
		FROM
		    "game"."pet" p
		LEFT JOIN
			"game"."shop_price" sp
			ON "p"."model_id" = "sp"."model_id"
		WHERE
		    "p"."id" = $1
	`
	var price int
	err := postgresRepository.Database.QueryRowx(query, petId).Scan(&price)
	if err != nil {
		return nil, err
	}

	return &price, nil
}
