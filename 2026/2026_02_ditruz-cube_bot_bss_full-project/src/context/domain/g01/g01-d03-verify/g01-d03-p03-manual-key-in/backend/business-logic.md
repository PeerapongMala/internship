# Business Logic — Manual Key-in (Backend)

## Status: Not Started

รอ business logic จากลูกค้า

## Planned Flows (เบื้องต้น)

### Save Counting Results
- Input: Header Card ID, list of denomination items (denom, type, series, qty)
- Validate: header card exists, qty > 0
- Save/update counting results
- TODO: Confirm exact API contract

### Review & Approval
- Input: changed items, Manager ID, OTP code, reason
- Validate: OTP from Manager
- Apply changes to counting results
- TODO: Confirm approval flow with customer

## Database Tables
- TBD — รอ confirm จากลูกค้าว่าใช้ table เดียวกับ Verify หรือแยก
