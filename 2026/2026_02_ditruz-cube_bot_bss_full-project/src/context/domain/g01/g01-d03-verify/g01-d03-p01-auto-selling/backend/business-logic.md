# Business Logic — Verify Auto Selling (Backend)

## Status Flow
```
Approved (16) → Verify (17) → SendToCBMS (18)
Cancel: Verify (17) → Approved (16)
```

## Key Business Rules

### Scan Header Card
- Input: HeaderCardCode, DepartmentId, MachineId, SorterId
- Validate header card exists and is in Approved (16) status
- Create VerifyTran record with status = Verify (17)
- TODO: Implement full validation logic

### Verify Action
- Input: VerifyTranId, denomination items, SupervisorId, OtpCode
- Validate OTP from supervisor
- Update status from Verify (17) → SendToCBMS (18)
- TODO: Implement denomination matching logic

### Cancel Verify
- Input: VerifyTranId, Remark, SupervisorId, OtpCode
- Validate OTP from supervisor
- Update status from Verify (17) → Approved (16)
- TODO: Implement rollback logic

### Edit Verify Tran
- Can change HeaderCardCode
- Requires remark
- TODO: Implement header card swap logic

### Delete Verify Tran
- Soft delete (set IsActive = false)
- Requires remark
- TODO: Implement cascade logic

## DI Registration
- Scrutor auto-registers by class name suffix (Service, Repository)
- No manual registration needed in backend
