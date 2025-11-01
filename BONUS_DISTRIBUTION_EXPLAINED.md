# MLM Bonus Distribution - Detailed Explanation

## ✅ Fix Applied
**Issue:** `this.consultantService.updateBalance is not a function`  
**Solution:** Changed to use `this.updateBalance()` (the local method in bonuses.service.ts)

---

## 💰 How Bonus Distribution Works

### Scenario: Complete Example

Let's say we have this consultant hierarchy:

```
Manager Eve (Level 5, id: 1)
└── Consultant Dave (Level 1, id: 2, sponsorId: 1)
    └── Consultant Carol (Level 2, id: 3, sponsorId: 2)
        └── Consultant Bob (Level 3, id: 4, sponsorId: 3)
            └── Consultant Alice (Level 4, id: 5, sponsorId: 4)
```

**Alice makes an admission:**
- Fee Amount: 100,000 PKR
- Admission Type: School

---

## Step 1: Direct Bonus (Alice)

**Who gets it:** Alice (the consultant who made the admission)

**Calculation:**
```javascript
Level 4 Direct Rate: 10%
Bonus = 100,000 × 10% = 10,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 5,           -- Alice gets the bonus
  fromConsultantId: 5,       -- From Alice's admission
  bonusType: 'direct',
  amount: 10000,
  percentage: 10,
  baseAmount: 100000,
  admissionId: <admission_id>
)

-- Consultant Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 10000,
    availableBalance = availableBalance + 10000,
    schoolAdmissions = schoolAdmissions + 1
WHERE id = 5

-- Transaction Record
INSERT INTO Transactions (
  consultantId: 5,
  transactionType: 'bonus_credit',
  amount: 10000,
  netAmount: 10000,
  referenceType: 'admission_bonus'
)
```

---

## Step 2: Indirect Bonuses (Up the Chain)

The system now walks up the sponsor chain, giving bonuses to each sponsor level.

### Level 1 Indirect: Bob (Alice's Direct Sponsor)

**Calculation:**
```javascript
Bob (Level 3) Indirect Level 1 Rate: 8%
Bonus = 100,000 × 8% = 8,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 4,           -- Bob gets the bonus
  fromConsultantId: 5,       -- From Alice's admission
  bonusType: 'indirect_level_1',
  amount: 8000,
  percentage: 8,
  levelDepth: 1
)

-- Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 8000,
    availableBalance = availableBalance + 8000
WHERE id = 4
```

### Level 2 Indirect: Carol (Bob's Sponsor)

**Calculation:**
```javascript
Carol (Level 2) Indirect Level 2 Rate: 5%
Bonus = 100,000 × 5% = 5,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 3,           -- Carol gets the bonus
  fromConsultantId: 5,       -- Still from Alice's admission
  bonusType: 'indirect_level_2',
  amount: 5000,
  percentage: 5,
  levelDepth: 2
)

-- Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 5000,
    availableBalance = availableBalance + 5000
WHERE id = 3
```

### Level 3 Indirect: Dave (Carol's Sponsor)

**Calculation:**
```javascript
Dave (Level 1) Indirect Level 3 Rate: 3%
Bonus = 100,000 × 3% = 3,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 2,           -- Dave gets the bonus
  fromConsultantId: 5,       -- Still from Alice's admission
  bonusType: 'indirect_level_3',
  amount: 3000,
  percentage: 3,
  levelDepth: 3
)

-- Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 3000,
    availableBalance = availableBalance + 3000
WHERE id = 2
```

### Level 4 Indirect: Manager Eve (Dave's Sponsor)

**Calculation:**
```javascript
Eve (Level 5 - Manager) Indirect Level 4 Rate: 1%
Bonus = 100,000 × 1% = 1,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 1,           -- Eve gets the bonus
  fromConsultantId: 5,       -- Still from Alice's admission
  bonusType: 'indirect_level_4',
  amount: 1000,
  percentage: 1,
  levelDepth: 4
)

-- Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 1000,
    availableBalance = availableBalance + 1000
WHERE id = 1
```

---

## Step 3: Global Bonuses (All Managers)

**Who gets it:** ALL active managers (Level 5-8) in the entire system

Let's say we have 3 managers:
- Eve (Level 5) - Already in hierarchy above
- Frank (Level 6) - Senior Manager, somewhere else
- Grace (Level 7) - Area Manager, somewhere else

### Manager Eve (Level 5)

**Calculation:**
```javascript
Level 5 Global Rate: 2%
Bonus = 100,000 × 2% = 2,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 1,           -- Eve gets ANOTHER bonus
  fromConsultantId: 5,       -- From Alice's admission
  bonusType: 'global',
  amount: 2000,
  percentage: 2
)

-- Balance Update (adds to existing balance)
UPDATE Consultant
SET totalEarnings = totalEarnings + 2000,
    availableBalance = availableBalance + 2000
WHERE id = 1
```

### Senior Manager Frank (Level 6)

**Calculation:**
```javascript
Level 6 Global Rate: 3%
Bonus = 100,000 × 3% = 3,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 6,           -- Frank gets bonus
  fromConsultantId: 5,       -- From Alice's admission
  bonusType: 'global',
  amount: 3000,
  percentage: 3
)

-- Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 3000,
    availableBalance = availableBalance + 3000
WHERE id = 6
```

### Area Manager Grace (Level 7)

**Calculation:**
```javascript
Level 7 Global Rate: 4%
Bonus = 100,000 × 4% = 4,000 PKR
```

**Database Updates:**
```sql
-- Bonus Record
INSERT INTO Bonuses (
  consultantId: 7,           -- Grace gets bonus
  fromConsultantId: 5,       -- From Alice's admission
  bonusType: 'global',
  amount: 4000,
  percentage: 4
)

-- Balance Update
UPDATE Consultant
SET totalEarnings = totalEarnings + 4000,
    availableBalance = availableBalance + 4000
WHERE id = 7
```

---

## 📊 Complete Summary

### Total Bonuses Created: 8

| Consultant | Type | Level | Rate | Amount |
|------------|------|-------|------|--------|
| Alice (5) | Direct | 4 | 10% | 10,000 |
| Bob (4) | Indirect L1 | 3 | 8% | 8,000 |
| Carol (3) | Indirect L2 | 2 | 5% | 5,000 |
| Dave (2) | Indirect L3 | 1 | 3% | 3,000 |
| Eve (1) | Indirect L4 | 5 | 1% | 1,000 |
| Eve (1) | Global | 5 | 2% | 2,000 |
| Frank (6) | Global | 6 | 3% | 3,000 |
| Grace (7) | Global | 7 | 4% | 4,000 |
| **TOTAL** | | | | **36,000** |

### Money Distribution
- **Original Fee:** 100,000 PKR
- **Total Bonuses:** 36,000 PKR (36%)
- **Company Keeps:** 64,000 PKR (64%)

### Consultant Earnings
- **Alice (Direct):** 10,000 PKR
- **Bob (Sponsor L1):** 8,000 PKR
- **Carol (Sponsor L2):** 5,000 PKR
- **Dave (Sponsor L3):** 3,000 PKR
- **Eve (Sponsor L4 + Global):** 1,000 + 2,000 = 3,000 PKR
- **Frank (Global only):** 3,000 PKR
- **Grace (Global only):** 4,000 PKR

---

## 🔍 Code Flow

### 1. Admission Creation
```typescript
// admissions.service.ts
const admission = await this.db.repo.Admission.create({
  consultantId: 5,  // Alice
  feeAmount: 100000,
  // ... other fields
}, { transaction });

// Calculate bonuses
await this.bonusesService.calculateAndDistributeBonuses(admission, transaction);
```

### 2. Direct Bonus
```typescript
// bonuses.service.ts - calculateDirectBonus()
const consultant = await this.db.repo.Consultant.findOne({
  where: { id: admission.consultantId }  // Alice (id: 5)
});

const bonusAmount = (admission.feeAmount * BONUS_RATES[consultant.level].direct) / 100;
// 100000 × 10% = 10000

await this.updateBalance(consultant, bonusAmount, transaction);
```

### 3. Indirect Bonuses
```typescript
// bonuses.service.ts - calculateIndirectBonuses()
const directConsultant = await this.db.repo.Consultant.findByPk(admission.consultantId);
// Alice (id: 5)

let currentSponsorId = directConsultant.sponsorId;  // Bob (id: 4)
let level = 1;

while (level <= 4 && currentSponsorId) {
  const sponsor = await this.db.repo.Consultant.findByPk(currentSponsorId);
  // Loop 1: Bob (4), Loop 2: Carol (3), Loop 3: Dave (2), Loop 4: Eve (1)
  
  const bonusKey = this.getIndirectBonusKey(level);
  // 'indirect_level_1', 'indirect_level_2', etc.
  
  const bonusAmount = (admission.feeAmount * BONUS_RATES[sponsor.level][bonusKey]) / 100;
  
  await this.updateBalance(sponsor, bonusAmount, transaction);
  
  currentSponsorId = sponsor.sponsorId;  // Move up the chain
  level++;
}
```

### 4. Global Bonuses
```typescript
// bonuses.service.ts - calculateGlobalBonuses()
const managers = await this.db.repo.Consultant.findAll({
  where: {
    level: { [Op.in]: [5, 6, 7, 8] },
    status: 'active'
  }
});
// Returns: Eve (5), Frank (6), Grace (7)

for (const manager of managers) {
  const bonusAmount = (admission.feeAmount * BONUS_RATES[manager.level].global) / 100;
  await this.updateBalance(manager, bonusAmount, transaction);
}
```

---

## 🧪 Testing Verification

### Query to Check All Bonuses for an Admission
```sql
SELECT 
  b.id,
  b."bonusType",
  b.amount,
  b.percentage,
  b."levelDepth",
  c."firstName" || ' ' || c."lastName" as consultant_name,
  c.level as consultant_level,
  fc."firstName" || ' ' || fc."lastName" as from_consultant_name
FROM "Bonuses" b
LEFT JOIN "Consultant" c ON b."fkConsultantId" = c.id
LEFT JOIN "Consultant" fc ON b."fkFromConsultantId" = fc.id
WHERE b."fkAdmissionId" = <admission_id>
ORDER BY 
  CASE b."bonusType"
    WHEN 'direct' THEN 1
    WHEN 'indirect_level_1' THEN 2
    WHEN 'indirect_level_2' THEN 3
    WHEN 'indirect_level_3' THEN 4
    WHEN 'indirect_level_4' THEN 5
    WHEN 'global' THEN 6
  END;
```

### Expected Result
```
| id | bonusType | amount | percentage | levelDepth | consultant_name | level | from_consultant_name |
|----|-----------|--------|------------|------------|-----------------|-------|----------------------|
| 1  | direct    | 10000  | 10         | null       | Alice           | 4     | Alice                |
| 2  | indirect_level_1 | 8000 | 8    | 1          | Bob             | 3     | Alice                |
| 3  | indirect_level_2 | 5000 | 5    | 2          | Carol           | 2     | Alice                |
| 4  | indirect_level_3 | 3000 | 3    | 3          | Dave            | 1     | Alice                |
| 5  | indirect_level_4 | 1000 | 1    | 4          | Eve             | 5     | Alice                |
| 6  | global    | 2000   | 2         | null       | Eve             | 5     | Alice                |
| 7  | global    | 3000   | 3         | null       | Frank           | 6     | Alice                |
| 8  | global    | 4000   | 4         | null       | Grace           | 7     | Alice                |
```

---

## ✅ Confirmation: Bonus Distribution is Correct

**YES**, the bonus distribution is properly handled:

1. ✅ **Direct bonus** goes to the consultant who made the admission
2. ✅ **Indirect bonuses** traverse up the sponsor chain correctly (up to 4 levels)
3. ✅ **Global bonuses** go to ALL active managers in the system
4. ✅ **Balances are updated** for each consultant
5. ✅ **Transaction records** are created for accounting
6. ✅ **Bonus records** are created with proper references

The logic correctly:
- Uses `currentSponsorId = sponsor.sponsorId` to move up the chain
- Checks each sponsor's level and gives appropriate bonus rate
- Stops after 4 levels or when there's no more sponsor
- Gives global bonuses to ALL managers, not just those in the chain
