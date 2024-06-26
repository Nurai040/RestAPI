module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec).[jt]s?(x)'],
    setupFilesAfterEnv: ['./setUpTest.ts'],
    transformIgnorePatterns: ['/node_modules/(?!(uuid)/)'],
};
//# sourceMappingURL=jest.config.js.map