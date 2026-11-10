import type { CodegenConfig } from "@graphql-codegen/cli";

export default {
    schema: "./github.schema.graphql",
    documents: "src/client/queries/github/**/*.query.ts",
    generates: {
        "src/types/github/graphql/operations.generated.ts": {
            plugins: ["typescript", "typescript-operations"],
            config: {
                onlyOperationTypes: true,
                useTypeImports: true,
            },
        },
    },
} satisfies CodegenConfig;
