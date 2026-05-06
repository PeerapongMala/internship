package constant

type CouponFilter struct {
	Search         string `query:"search"`
	StartedAtStart string `query:"started_at_start"`
	StartedAtEnd   string `query:"started_at_end"`
	EnedAtStart    string `query:"ended_at_start"`
	EnedAtEnd      string `query:"ended_at_end"`
	Status 			   string `query:"status"`
}

type CouponTransactionFilter struct {
	Search         string `query:"search"`
	UsedAtStart    string `query:"used_at_start"`
	UsedAtEnd 		 string `query:"used_at_end"`
}
