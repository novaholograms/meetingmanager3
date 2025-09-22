// Test script to verify proposals service
const { proposalsService } = require('./server/proposals-service.ts');

async function testProposalsService() {
  try {
    console.log("🧪 Testing proposals service...");
    
    // Test creating a proposal
    const testProposal = await proposalsService.createProposal({
      keyPointId: 3848, // Use an existing key point
      meetingId: 831,   // Use an existing meeting
      proposal: "Test proposal from script",
      userId: 7
    });
    
    console.log("✅ Proposal created successfully:", testProposal);
    
    // Test creating a response
    const testResponse = await proposalsService.addResponse({
      proposalId: testProposal.id,
      response: "Test response from script", 
      userId: 7
    });
    
    console.log("✅ Response created successfully:", testResponse);
    
  } catch (error) {
    console.log("❌ Test failed:", error.message);
    console.log("Error details:", error);
  }
}

testProposalsService();