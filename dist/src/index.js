import { registerPlugin } from "@recogito/studio-sdk";
const NERPlugin = {
    name: "NER plugin",
    module_name: "@recogito/plugin-ner",
    description: "Recogito Studio plugin which can perform Named Entity Recognition on TEI and Plain Text.",
    author: "Performant Software",
    homepage: "https://www.performantsoftware.com/",
    extensions: [
        {
            name: "ner-document-menu-items",
            component_name: "DocumentMenuExtension",
            extension_point: "project:document-actions",
        },
    ],
};
const plugin = () => ({
    name: "plugin-ner",
    hooks: {
        "astro:config:setup": ({ config, logger, injectRoute }) => {
            registerPlugin(NERPlugin, config, logger);
            logger.info("Injecting new API route /api/[projectId]/[documentId]/agent/ner");
            injectRoute({
                pattern: "/api/[projectId]/[documentId]/agent/ner",
                entrypoint: "node_modules/@recogito/plugin-ner/src/api/NERAgentRoute.ts",
                prerender: false,
            });
        },
    },
});
export default plugin;
