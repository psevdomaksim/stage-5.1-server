module.exports = {
  testEnvironment: "jsdom", // Required for React components
  moduleFileExtensions: ["js", "json", "node"], // Include relevant extensions
  transformIgnorePatterns: ["/node_modules/(?!axios).+\\.js$"],
};
