/**
 * Models Registry - Shared models accessed by all modules
 */

const registry = {
  User: null,
  Company: null,
  Booking: null,
  Wallet: null,
  WalletTransaction: null,
  Notification: null,
  PromotionalCampaign: null
};

const getModel = (modelName) => {
  if (!registry[modelName]) {
    throw new Error(`Model ${modelName} not initialized`);
  }
  return registry[modelName];
};

const registerModels = (modelsObj) => {
  Object.keys(modelsObj).forEach(key => {
    registry[key] = modelsObj[key];
  });
};

const getAllModels = () => registry;

module.exports = {
  getModel,
  registerModels,
  getAllModels,
  registry
};
