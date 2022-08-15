const path = require("path");
const { shenanigans } = require("./package.json");

const corePackages = [
    {{ #dependencyNames }}
    "{{{ . }}}",
    {{ /dependencyNames }}
];

const resolveAliasBase = path.join(__dirname, "{{{ resolveAliasBase }}}");

module.exports = {
    devtool: "source-map",
    entry: Object.fromEntries(
        (
            shenanigans.loading?.entries ?? [
                {
                    entry: `./src/main.ts`,
                    name: shenanigans.loading?.name || shenanigans.name,
                },
            ]
        ).map((pair) => [pair.name, pair.entry])
    ),
    externals: Object.fromEntries(
        shenanigans.loading?.externals?.map((external) => [external.name, external.name]) ?? []
    ),
    mode: "production",
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.(tsx?)|(jsx?)$/,
                use: {
                    loader: require.resolve("ts-loader"),
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
    output: {
        filename: `[name].js`,
        publicPath: "dist/",
    },
    resolve: {
        alias: Object.fromEntries(
            corePackages.map((corePackage) => [
                corePackage,
                path.join(resolveAliasBase, corePackage, "src/index.ts"),
            ])
        ),
        extensions: [".ts", ".tsx", ".json"],
        symlinks: true,
    },
};
