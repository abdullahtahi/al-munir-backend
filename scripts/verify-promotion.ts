
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConsultantService } from '../src/modules/consultant/consultant.service';
import { UserLevel, AdmissionType, ConsultantStatus } from '../src/common/enums';
import { LEVEL_REQUIREMENTS } from '../src/common/constants';
import { GlobalDbService } from '../src/modules/global-db/global-db.service';

async function verifyPromotion() {
  console.log('🚀 Starting verification script...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const consultantService = app.get(ConsultantService);
  const db = app.get(GlobalDbService);

  try {
    console.log('👤 Creating test user...');
    // Create a random test user
    const uniqueId = Math.random().toString(36).substring(7);
    const email = `test-${uniqueId}@example.com`;
    const phone = `+92${Math.floor(Math.random() * 1000000000)}`;
    
    // Create user directly via DB to bypass some checks if needed, or use service
    // Using service create might be safer but requires DTO. 
    // Let's use DB repo directly for setup to ensure specific state.
    
    // Create Bank first (required)
    const [bank] = await db.repo.Bank.findOrCreate({
      where: { name: 'Test Bank' },
      defaults: {
        name: 'Test Bank',
        accountNumber: '1234567890',
        accountAddress: 'Test Address',
      }
    });

    const user = await db.repo.Consultant.create({
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '1234567890',
      level: UserLevel.LEVEL_1, // Start at Level 1 (entry level)
      status: 'active',
      bankId: bank.id,
      dateOfBirth: new Date('1990-01-01'),
      schoolAdmissions: 0,
      academyAdmissions: 0,
      technicalAdmissions: 0,
    });

    console.log(`✅ User created: ${user.id} (Level: ${user.level})`);

    // --- TEST 1: Personal Admission Promotion (Level 1 -> 2) ---
    console.log('\n--- TEST 1: Personal Admission Promotion (Level 1 -> 2) ---');
    
    // Get requirements for Level 2
    const level2Requirements = LEVEL_REQUIREMENTS[UserLevel.LEVEL_2];
    console.log(`🎯 Target Requirements for Level 2: School=${level2Requirements[AdmissionType.SCHOOL]}, Academy=${level2Requirements[AdmissionType.ACADEMY]}, Technical=${level2Requirements[AdmissionType.TECHNICAL]}`);

    // Update user to meet Level 2 requirements
    console.log('📈 Updating user admission counts...');
    await user.update({
      schoolAdmissions: level2Requirements[AdmissionType.SCHOOL],
      academyAdmissions: level2Requirements[AdmissionType.ACADEMY],
      technicalAdmissions: level2Requirements[AdmissionType.TECHNICAL],
    });

    console.log(`📊 Current Counts: School=${user.schoolAdmissions}, Academy=${user.academyAdmissions}, Technical=${user.technicalAdmissions}`);

    // Trigger promotion check
    console.log('🔄 Running checkAndPromoteUser...');
    await consultantService.checkAndPromoteUser(user.id);

    // Verify Level 1 -> 2
    let updatedUser = await db.repo.Consultant.findByPk(user.id);
    console.log(`👮 User Level after check: ${updatedUser.level}`);

    if (updatedUser.level === UserLevel.LEVEL_2) {
      console.log('✅ SUCCESS: User promoted to Level 2!');
    } else {
      console.error(`❌ FAILURE: User level is ${updatedUser.level}, expected ${UserLevel.LEVEL_2}`);
      process.exit(1);
    }

    // --- TEST 2: Team Structure Promotion (Level 3 -> 4) ---
    console.log('\n--- TEST 2: Team Structure Promotion (Level 3 -> 4) ---');
    
    // Manually bump user to Level 3 for this test
    await user.update({ level: UserLevel.LEVEL_3 });
    console.log('👤 Manually updated user to Level 3 to test Level 4 promotion');

    // Trigger promotion check (Should FAIL initially as no team)
    console.log('🔄 Running checkAndPromoteUser (Expect NO promotion)...');
    await consultantService.checkAndPromoteUser(user.id);
    
    updatedUser = await db.repo.Consultant.findByPk(user.id);
    if (updatedUser.level === UserLevel.LEVEL_3) {
        console.log('✅ SUCCESS: User NOT promoted without team structure.');
    } else {
        console.error(`❌ FAILURE: User promoted to ${updatedUser.level} without team structure!`);
    }

    // Create 5 downlines in different lines and promote them to Level 3
    console.log('👥 Creating 5 downline legs with Level 3 consultants...');
    for (let i = 0; i < 5; i++) {
        const downline = await db.repo.Consultant.create({
            firstName: `Downline`,
            lastName: `${i}`,
            email: `downline${i}_${Date.now()}@example.com`,
            password: 'password123',
            phone: `123456789${i}`,
            level: UserLevel.LEVEL_3, // Directly create at Level 3
            status: 'active',
            bankId: bank.id,
            sponsorId: user.id, // Direct downline (different line)
            dateOfBirth: new Date('1990-01-01'),
            schoolAdmissions: 0,
            academyAdmissions: 0,
            technicalAdmissions: 0,
        });
        console.log(`   - Created Downline ${downline.id} at Level 3`);
    }

    // Trigger promotion check (Should PASS now)
    console.log('🔄 Running checkAndPromoteUser (Expect SUCCESS)...');
    await consultantService.checkAndPromoteUser(user.id);

    updatedUser = await db.repo.Consultant.findByPk(user.id);
    console.log(`👮 User Level after check: ${updatedUser.level}`);

    if (updatedUser.level === UserLevel.LEVEL_4) {
        console.log('✅ SUCCESS: User promoted to Level 4 with team structure!');
    } else {
        console.error(`❌ FAILURE: User level is ${updatedUser.level}, expected ${UserLevel.LEVEL_4}`);
    }

    // Verify Bonus
    const bonus = await db.repo.Bonus.findOne({
      where: {
        consultantId: user.id,
        bonusType: 'progression'
      }
    });

    if (bonus) {
      console.log(`✅ SUCCESS: Progression bonus found! Amount: ${bonus.amount}`);
    } else {
      console.error('❌ FAILURE: No progression bonus found.');
      // Note: This might fail if processProgressionBonus logic has issues or if we didn't wait enough (though it's awaited)
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

verifyPromotion();
