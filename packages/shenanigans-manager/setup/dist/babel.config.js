module.exports = {
    plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-proposal-class-properties",
    ],
    presets: ["@babel/react", "@babel/typescript"],
};
