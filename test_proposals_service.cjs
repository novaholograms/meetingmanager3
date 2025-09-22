// Test script to verify proposals service
const { exec } = require('child_process');

// Test the import directly using tsx
exec('cd server && npx tsx -e "import { proposalsService } from \'./proposals-service\'; console.log(\'Service loaded:\', typeof proposalsService); proposalsService.createProposal({keyPointId: 3848, meetingId: 831, proposal: \'Test proposal\', userId: 7}).then(r => console.log(\'✅ Proposal created:\', r)).catch(e => console.log(\'❌ Error:\', e.message));"', 
  (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Test failed:', error.message);
      return;
    }
    
    if (stderr) {
      console.log('⚠️ Warnings:', stderr);
    }
    
    console.log('📋 Test output:');
    console.log(stdout);
  }
);