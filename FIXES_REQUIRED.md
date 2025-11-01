# MLM System Fixes Required

## Summary of Issues Found

### 1. **Admission Creation Flow Issues**

#### Problem in `admissions.service.ts` (Line 95)
- The admission object passed to `calculateAndDistributeBonuses` is correct
- However, bonus service needs proper handling of the admission object

### 2. **Bonus Calculation Issues (FIXED)**

#### Issues in `bonuses.service.ts`:
✅ **FIXED**: Line 57 - Changed `admission.fee_amount` to `admission.feeAmount`
✅ **FIXED**: Line 69 - Changed `admission.admission_type` to `admission.admissionType`
✅ **FIXED**: Line 85 - Changed `admission.course_name` to `admission.admissionInClass`
✅ **FIXED**: Lines 112-170 - Completely rewrote `calculateIndirectBonuses()` to:
   - Properly traverse sponsor hierarchy using `sponsorId`
   - Use correct field names (camelCase)
   - Fixed transaction model name from `transaction` to `Transactions`
✅ **FIXED**: Lines 172-221 - Fixed `calculateGlobalBonuses()` field names to camelCase

### 3. **Consultant Update Issue**

#### Problem in `consultant.service.ts` (Line 161):
- Uses wrong field name `consultantId` instead of `sponsorId`
- Need to verify this is being used correctly

### 4. **Database vs Model Field Mapping**

The migrations use different field names than the models:

| Model Field | DB Column Name |
|------------|----------------|
| `consultantId` | `fkConsultantId` |
| `studentId` | `fkStudentId` |
| `dependOnId` | `fkDependOnId` |
| `sponsorId` | `fkSponsorId` |
| `bankId` | `fkBankId` |
| `admissionId` | `fkAdmissionId` |

**Sequelize handles this automatically through the `field` option in the model definition.**

## Admission Creation Flow Analysis

### Current Flow:
1. User creates admission with `sponsorId` (consultant who gets the student)
2. System creates DependOn record (guardian info)
3. System creates Student record
4. System creates Admission record with:
   - `consultantId`: The sponsor/consultant who brought the student
   - `studentId`: The student
   - `dependOnId`: The guardian
5. System calculates bonuses:
   - **Direct Bonus**: Goes to the consultant who made the admission
   - **Indirect Bonuses**: Go up the sponsor chain (4 levels)
   - **Global Bonuses**: Go to managers and above

### Potential Issues:

1. **Transaction Management**: 
   - Line 95 in admissions.service.ts calls `calculateAndDistributeBonuses` 
   - Bonus service tries to commit/rollback transaction but it's passed from parent
   - **ISSUE**: Should not commit/rollback inside bonus service

2. **Missing Consultant Check**:
   - If `sponsorId` is null, the admission is created but no bonuses are calculated
   - This is correct behavior but should be documented

## Recommendations

### 1. Fix Transaction Management in Bonus Service
Remove the commit/rollback from `calculateAndDistributeBonuses` since transaction is managed by parent:

```typescript
async calculateAndDistributeBonuses(admission: string, transaction: any): Promise<void> {
    console.log("Calculating bonuses for admission:", admission.id);
    
    try {
        // Calculate direct bonus
        await this.calculateDirectBonus(admission, transaction);
        
        // Calculate indirect bonuses (team bonuses)
        await this.calculateIndirectBonuses(admission, transaction);
        
        // Calculate global bonuses for managers
        await this.calculateGlobalBonuses(admission, transaction);
        
        // Don't commit here - let parent handle it
    } catch (error) {
        // Don't rollback here - let parent handle it
        throw error;
    }
}
```

### 2. Fix Consultant Service Update
Change line 161 in consultant.service.ts from `consultantId` to `sponsorId`

### 3. Add Admission Count Tracking
The consultant entity has fields for tracking admission counts by type:
- `schoolAdmissions`
- `academyAdmissions`  
- `technicalAdmissions`

These are being updated correctly in line 88-91 of admissions.service.ts

## Testing Checklist

- [ ] Test admission creation without sponsor (sponsorId = null)
- [ ] Test admission creation with sponsor at level 4
- [ ] Test admission creation with sponsor at level 1 (should give indirect bonuses up to 4 levels)
- [ ] Verify direct bonus is calculated correctly
- [ ] Verify indirect bonuses traverse up sponsor chain correctly
- [ ] Verify global bonuses go to managers
- [ ] Verify consultant admission counts are incremented
- [ ] Verify consultant balances are updated correctly
- [ ] Check transaction records are created
- [ ] Check bonus records are created with correct fields
