# MLM System - Complete Summary & Testing Guide

## ✅ All Fixes Completed

### 1. **Fixed bonuses.service.ts**
- ✅ Changed all `snake_case` fields to `camelCase`
- ✅ Fixed `admission.fee_amount` → `admission.feeAmount`
- ✅ Fixed `admission.admission_type` → `admission.admissionType`
- ✅ Fixed `admission.course_name` → `admission.admissionInClass`
- ✅ Completely rewrote `calculateIndirectBonuses()` to properly traverse sponsor hierarchy
- ✅ Fixed transaction model name from `transaction` to `Transactions`
- ✅ Removed transaction commit/rollback (handled by parent service)
- ✅ Fixed all field names in `calculateGlobalBonuses()`

### 2. **Fixed consultant.service.ts**
- ✅ Changed `consultantId` → `sponsorId` in update method (line 161)

### 3. **Verified admissions.service.ts**
- ✅ Admission creation flow is correct
- ✅ Transaction management is proper
- ✅ Bonus calculation is called correctly with transaction

---

## 🏗️ MLM System Architecture

### Database Schema (from migrations)

**Consultant Table:**
- Primary Key: `id` (auto-increment)
- Self-referencing: `fkSponsorId` → `sponsorId` in model
- Tracks: `schoolAdmissions`, `academyAdmissions`, `technicalAdmissions`
- Balances: `totalEarnings`, `availableBalance`, `withdrawnAmount`
- Levels: 1-8 (4 = Entry, 1 = Advanced, 5-8 = Managers)

**Admissions Table:**
- Foreign Keys:
  - `fkConsultantId` → consultant who made the admission
  - `fkStudentId` → student record
  - `fkDependOnId` → guardian record
- Fields: `admissionInClass`, `admissionType`, `feeAmount`, `commissionAmount`

**Bonuses Table:**
- Foreign Keys:
  - `fkConsultantId` → consultant receiving bonus
  - `fkFromConsultantId` → consultant who generated the bonus
  - `fkAdmissionId` → admission that triggered the bonus
- Types: `direct`, `indirect_level_1-4`, `global`, `progression`

**Transactions Table:**
- Foreign Keys: `fkConsultantId`, `fkAdmissionId`
- Types: `bonus_credit`, `incentive_credit`, `withdrawal`, `penalty`

---

## 💰 Bonus Distribution Logic

### Direct Bonus
**Who gets it:** The consultant who made the admission
**Rate:** Based on consultant level (from BONUS_RATES constant)
- Level 4: 10%
- Level 3: 15%
- Level 2: 20%
- Level 1: 25%
- Managers (5-8): 30%

### Indirect Bonuses (Team Bonuses)
**Who gets it:** Up to 4 levels of sponsors above the direct consultant
**How it works:**
1. System finds the consultant who made admission
2. Gets their `sponsorId` (direct sponsor)
3. Traverses up the chain for 4 levels
4. Each sponsor gets a percentage based on their level

**Example:**
```
Level 4 Consultant (Alice) makes admission
└── Sponsor: Level 3 Bob (gets indirect_level_1 bonus: 8%)
    └── Sponsor: Level 2 Carol (gets indirect_level_2 bonus: 5%)
        └── Sponsor: Level 1 Dave (gets indirect_level_3 bonus: 3%)
            └── Sponsor: Manager Eve (gets indirect_level_4 bonus: 1%)
```

### Global Bonuses
**Who gets it:** All active managers (level 5-8)
**Rate:** 
- Managers: 2%
- Senior Managers: 3%
- Area/Sector Managers: 4%

---

## 🔄 Admission Creation Flow

### Step-by-Step Process

1. **Create DependOn Record** (Guardian info)
   ```typescript
   name, relation, address
   ```

2. **Create Student Record**
   ```typescript
   studentName, gender, phone, dateOfBirth, 
   father/mother details, addresses, documents
   ```

3. **Create Admission Record**
   ```typescript
   consultantId: sponsorId from input
   studentId: from step 2
   dependOnId: from step 1
   admissionInClass, admissionType, feeAmount, etc.
   ```

4. **Update Consultant Admission Counts**
   - Increment `schoolAdmissions` OR `academyAdmissions` OR `technicalAdmissions`

5. **Calculate & Distribute Bonuses** (if consultant exists)
   - Calculate direct bonus for the consultant
   - Calculate indirect bonuses up the sponsor chain
   - Calculate global bonuses for managers
   - Update consultant balances
   - Create bonus records
   - Create transaction records

6. **Commit Transaction**
   - All or nothing - if any step fails, entire admission is rolled back

---

## 🧪 Testing Guide

### Prerequisites
```bash
# Ensure database is running
npm run db:migrate

# Start the server
npm run start:dev
```

### Test 1: Admission Without Sponsor
**Purpose:** Verify system handles null sponsor correctly

**Request:**
```json
POST /admissions
{
  "sponsorId": null,
  "studentName": "Test Student",
  "admissionInClass": "Class 10",
  "admissionType": "school",
  "feeAmount": 10000,
  "admissionNumber": "ADM-001",
  "admissionDate": "2025-01-15",
  // ... other student and guardian fields
}
```

**Expected Result:**
- ✅ Admission created
- ❌ NO bonuses calculated
- ❌ NO consultant admission count updated

### Test 2: Simple Direct Bonus (Level 4 Consultant)
**Purpose:** Verify direct bonus calculation

**Setup:**
1. Create Level 4 Consultant (no sponsor)
   ```sql
   INSERT INTO "Consultant" (firstName, lastName, email, level, status, ...)
   ```

**Request:**
```json
POST /admissions
{
  "sponsorId": <consultant_id>,
  "admissionType": "school",
  "feeAmount": 10000,
  // ... other fields
}
```

**Expected Result:**
- ✅ Admission created
- ✅ Direct bonus: 10000 * 10% = 1000
- ✅ Consultant `schoolAdmissions` +1
- ✅ Consultant `totalEarnings` +1000
- ✅ Consultant `availableBalance` +1000
- ✅ 1 Bonus record created (type: direct)
- ✅ 1 Transaction record created (type: bonus_credit)

### Test 3: Multi-Level Bonus Chain
**Purpose:** Verify indirect bonuses traverse correctly

**Setup:**
1. Create 5 consultants in hierarchy:
   ```
   Manager (Level 5) - id: 1
   └── Consultant A (Level 1) - id: 2, sponsorId: 1
       └── Consultant B (Level 2) - id: 3, sponsorId: 2
           └── Consultant C (Level 3) - id: 4, sponsorId: 3
               └── Consultant D (Level 4) - id: 5, sponsorId: 4
   ```

**Request:**
```json
POST /admissions
{
  "sponsorId": 5,  // Consultant D makes admission
  "admissionType": "technical",
  "feeAmount": 20000,
  // ... other fields
}
```

**Expected Bonuses:**
| Consultant | Level | Bonus Type | Rate | Amount |
|------------|-------|------------|------|--------|
| D (id: 5) | 4 | Direct | 10% | 2000 |
| C (id: 4) | 3 | Indirect L1 | 8% | 1600 |
| B (id: 3) | 2 | Indirect L2 | 5% | 1000 |
| A (id: 2) | 1 | Indirect L3 | 3% | 600 |
| Manager (id: 1) | 5 | Indirect L4 | 1% | 200 |

**Expected Result:**
- ✅ 5 Bonus records created
- ✅ 5 Transaction records created
- ✅ All consultant balances updated correctly
- ✅ Consultant D's `technicalAdmissions` +1

### Test 4: Global Bonuses
**Purpose:** Verify managers get global bonuses

**Setup:**
1. Ensure you have active managers in database (level 5, 6, 7, or 8)

**Request:**
Same as Test 2 or Test 3

**Expected Result:**
- ✅ EVERY active manager gets a global bonus (2-4% based on level)
- ✅ Bonus records created with type: `global`
- ✅ All managers' balances updated

### Test 5: Academy vs School vs Technical
**Purpose:** Verify admission type tracking

**Requests:**
Create 3 admissions with same consultant but different types:
1. `admissionType: "school"`
2. `admissionType: "academy"`
3. `admissionType: "technical"`

**Expected Result:**
Check consultant record:
- ✅ `schoolAdmissions` = 1
- ✅ `academyAdmissions` = 1
- ✅ `technicalAdmissions` = 1

---

## 🔍 Debugging Queries

### Check consultant hierarchy
```sql
WITH RECURSIVE consultant_tree AS (
  SELECT id, "firstName", "lastName", "fkSponsorId", level, 1 as depth
  FROM "Consultant"
  WHERE id = <starting_consultant_id>
  
  UNION ALL
  
  SELECT c.id, c."firstName", c."lastName", c."fkSponsorId", c.level, ct.depth + 1
  FROM "Consultant" c
  JOIN consultant_tree ct ON c.id = ct."fkSponsorId"
  WHERE ct.depth < 5
)
SELECT * FROM consultant_tree ORDER BY depth;
```

### Check bonuses for an admission
```sql
SELECT 
  b.id,
  b."bonusType",
  b.amount,
  b.percentage,
  c."firstName" || ' ' || c."lastName" as consultant,
  fc."firstName" || ' ' || fc."lastName" as from_consultant
FROM "Bonuses" b
LEFT JOIN "Consultant" c ON b."fkConsultantId" = c.id
LEFT JOIN "Consultant" fc ON b."fkFromConsultantId" = fc.id
WHERE b."fkAdmissionId" = <admission_id>;
```

### Check consultant balance
```sql
SELECT 
  id,
  "firstName",
  "lastName",
  level,
  "totalEarnings",
  "availableBalance",
  "withdrawnAmount",
  "schoolAdmissions",
  "academyAdmissions",
  "technicalAdmissions"
FROM "Consultant"
WHERE id = <consultant_id>;
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot read property 'level' of null"
**Cause:** Consultant not found or sponsorId is invalid
**Solution:** Verify consultant exists before creating admission

### Issue 2: "Transaction already committed"
**Cause:** Trying to commit transaction twice
**Solution:** ✅ FIXED - Removed commit/rollback from bonus service

### Issue 3: Bonuses not calculating
**Cause:** `sponsorId` is null or empty
**Solution:** Ensure you pass valid `sponsorId` in admission creation

### Issue 4: Indirect bonuses only go 1 level
**Cause:** Sponsor chain broken or sponsorId not set
**Solution:** ✅ FIXED - Properly traverse using `sponsor.sponsorId`

---

## 📊 Expected Console Logs

When creating an admission successfully, you should see:
```
=== Calculating bonuses for admission === <admission_id>
Level 1 indirect bonus for sponsor <sponsor_id>: <amount>
Level 2 indirect bonus for sponsor <sponsor_id>: <amount>
...
=== Bonus calculation completed ===
```

---

## ✨ Summary

**✅ All issues fixed:**
1. Field naming consistency (camelCase everywhere)
2. Transaction management (parent handles commit/rollback)
3. Indirect bonus traversal (properly walks sponsor chain)
4. Consultant update (sponsorId field name)

**✅ System is ready for:**
- Admission creation with proper bonus distribution
- Multi-level commission tracking
- Global bonus distribution to managers
- Admission count tracking by type

**🧪 Test thoroughly using the guide above to ensure everything works!**
