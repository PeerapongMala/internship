package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"

func (postgresRepository *postgresRepository) TeacherShopTransactionUpdateStatus(transactionId int, c constant.ShopItemTransactionStatusRequest) (r constant.ShopItemTransactionEntity, err error) {
	query := `
			UPDATE  "teacher_store"."teacher_store_transaction" 
			SET status=$1`
	if c.Status == "recalled" {
		query += `, recalled_at = 'NOW()'`
	}
	query += `	
			WHERE id=$2
			RETURNING *
			`

	err = postgresRepository.Database.QueryRowx(query, c.Status, transactionId).StructScan(&r)
	if err != nil {
		return r, err
	}

	return r, nil
}
