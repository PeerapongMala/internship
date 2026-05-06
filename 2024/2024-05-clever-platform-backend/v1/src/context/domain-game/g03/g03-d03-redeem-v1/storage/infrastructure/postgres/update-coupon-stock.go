package postgres

import "github.com/jmoiron/sqlx"

func (postgresRepository *postgresRepository) ReduceCouponStockById(tx *sqlx.Tx, id int) error {
	query := `
	UPDATE "coupon"."coupon"
	SET stock = stock - 1	
	WHERE id = $1
	`
	_, err := postgresRepository.Database.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}