package postgres

import (
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GetShopItemTransactionList(pagination *helper.Pagination, filter *constant.ShopItemListFilter, storeItemId int) (r []constant.ShopItemTransactionResponse, err error) {

	values := []interface{}{}
	query := `
				SELECT tst.*, student.title, student.first_name, student.last_name 
				FROM "teacher_store"."teacher_store_transaction" as tst
				LEFT JOIN "user"."user" as student ON tst.student_id = student."id"
				WHERE tst.teacher_store_item_id = $1`
	values = append(values, storeItemId)

	if filter.SearchText != nil {
		query += ` AND ( student.first_name LIKE $` + strconv.Itoa(len(values)+1) + ` 
				OR student.last_name LIKE $` + strconv.Itoa(len(values)+2) + `)`
		values = append(values, "%"+*filter.SearchText+"%", "%"+*filter.SearchText+"%")
	}
	queryCount := `SELECT count(*) FROM (` + query + `)`
	err = postgresRepository.Database.QueryRow(queryCount, values...).Scan(&pagination.TotalCount)
	if err != nil {
		return r, err
	}

	if pagination != nil {
		query += ` ORDER BY tst."id" DESC LIMIT $` + strconv.Itoa(len(values)+1) +
			` OFFSET $` + strconv.Itoa(len(values)+2)
		values = append(values, pagination.Limit)
		values = append(values, pagination.Offset)
	}

	if err = postgresRepository.Database.Select(&r, query, values...); err != nil {
		return r, err
	}

	return r, nil
}
