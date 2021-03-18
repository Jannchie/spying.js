module.exports = {
  roots: ["<rootDir>/test"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testTimeout: 5000,
};
