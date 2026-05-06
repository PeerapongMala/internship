package constant

import "time"

type CouponEntity struct {
	Id               *int       `json:"id" db:"id"`
	Code             *string    `json:"code" db:"code"`
	StartedAt        *time.Time `json:"started_at" db:"started_at"`
	EndedAt          *time.Time `json:"ended_at" db:"ended_at"`
	InitialStock     *int       `json:"initial_stock,omitempty" db:"initial_stock"`
	Stock            *int       `json:"stock,omitempty" db:"stock"`
	AvatarId         *int       `json:"avatar_id" db:"avatar_id"`
	PetId            *int       `json:"pet_id" db:"pet_id"`
	GoldCoinAmount   *int       `json:"gold_coin_amount,omitempty" db:"gold_coin_amount"`
	ArcadeCoinAmount *int       `json:"arcade_coin_amount,omitempty" db:"arcade_coin_amount"`
	IceAmount        *int       `json:"ice_amount,omitempty" db:"ice_amount"`
	Status           *string    `json:"status" db:"status"`
	CreatedAt        *time.Time `json:"created_at" db:"created_at"`
	CreatedBy        *string    `json:"created_by" db:"created_by"`
	UpdatedAt        *time.Time `json:"updated_at,omitempty" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by,omitempty" db:"updated_by"`
	AdminLoginAs     *string    `json:"admin_login_as,omitempty" db:"admin_login_as"`
}

type CouponListEntity struct {
	Id           *int       `json:"id" db:"id"`
	Code         *string    `json:"code" db:"code"`
	StartedAt    *time.Time `json:"started_at" db:"started_at"`
	EndedAt      *time.Time `json:"ended_at" db:"ended_at"`
	Status       *string    `json:"status" db:"status"`
	ShowStatus   *string    `json:"show_status" db:"show_status"`
	InitialStock *int       `json:"initial_stock,omitempty" db:"initial_stock"`
	UsedCount    *int       `json:"used_count" db:"used_count"`
}

type CouponTransactionListEntity struct {
	CouponTrasactionId *int       `json:"coupon_transaction_id" db:"coupon_transaction_id"`
	UserId             *string    `json:"user_id" db:"user_id"`
	StudentId          *string    `json:"student_id" db:"student_id"`
	Title              *string    `json:"title" db:"title"`
	FirstName          *string    `json:"first_name" db:"first_name"`
	LastName           *string    `json:"last_name" db:"last_name"`
	SchoolName         *string    `json:"school_name" db:"school_name"`
	UsedAt             *time.Time `json:"used_at" db:"used_at"`
	RecalledAt         *time.Time `json:"recalled_at" db:"recalled_at"`
	Status             *string    `json:"status" db:"status"`
}

type AvatarEntity struct {
	Id      *int    `json:"id" db:"id"`
	ModelId *string `json:"model_id" db:"model_id"`
	Level   *int    `json:"level" db:"level"`
}

type PetEntity struct {
	Id      *int    `json:"id" db:"id"`
	ModelId *string `json:"model_id" db:"model_id"`
}