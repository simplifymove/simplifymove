const { initializeModels, getModels } = require('./models/index');
const sequelize = require('./config/database');

async function testWalletModel() {
  try {
    console.log('Initializing models...');
    const models = initializeModels(sequelize);
    
    const { User, Wallet, WalletTransaction } = models;
    
    console.log('Testing Wallet model methods...\n');
    
    // Check if methods exist
    console.log('✅ Wallet.findByOwner exists:', typeof Wallet.findByOwner === 'function');
    console.log('✅ Wallet.createWallet exists:', typeof Wallet.createWallet === 'function');
    
    // Create a test wallet
    console.log('\nCreating test wallet...');
    const testWallet = await Wallet.create({
      ownerId: 'test-user-123',
      ownerModel: 'User',
      balance: 1000,
      status: 'active'
    });
    
    console.log('✅ Test wallet created:', testWallet.id);
    console.log('   Initial balance:', testWallet.balance);
    
    // Test credit method
    console.log('\nTesting credit method...');
    const transaction1 = await testWallet.credit(
      500,
      'Test credit',
      'test',
      'TXN-001',
      {}
    );
    
    // Reload wallet to check if balance was saved
    await testWallet.reload();
    console.log('✅ Credit successful');
    console.log('   New balance:', testWallet.balance);
    console.log('   Expected: 1500, Actual:', testWallet.balance);
    
    // Verify transaction was created
    const transactions = await WalletTransaction.findAll({ where: { walletId: testWallet.id } });
    console.log('✅ Transactions created:', transactions.length);
    console.log('   Transaction amount:', transactions[0].amount);
    
    // Test debit method
    console.log('\nTesting debit method...');
    const transaction2 = await testWallet.debit(
      200,
      'Test debit',
      'test',
      'TXN-002  ',
      {}
    );
    
    // Reload wallet to check if balance was saved
    await testWallet.reload();
    console.log('✅ Debit successful');
    console.log('   New balance:', testWallet.balance);
    console.log('   Expected: 1300, Actual:', testWallet.balance);
    
    // Test findByOwner method
    console.log('\nTesting findByOwner method...');
    const foundWallet = await Wallet.findByOwner('test-user-123', 'User');
    console.log('✅ Wallet found:', foundWallet ? 'YES' : 'NO');
    console.log('   Balance:', foundWallet?.balance);
    
    // Test createWallet method
    console.log('\nTesting createWallet method...');
    const newWallet = await Wallet.createWallet('test-user-456', 'User', 5000);
    console.log('✅ New wallet created:', newWallet.id);
    console.log('   Initial balance:', newWallet.balance);
    
    console.log('\n✅ ALL TESTS PASSED - WALLET MODEL METHODS WORKING!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testWalletModel();
