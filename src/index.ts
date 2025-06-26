import type { AstroIntegration } from "astro";
import { Plugin, registerPlugin } from "@recogito/studio-sdk";

const NERPlugin: Plugin = {
  name: "NER plugin",

  module_name: "@recogito/plugin-ner",

  description:
    "Recogito Studio plugin which can perform Named Entity Recognition on TEI and Plain Text.",

  author: "Performant Software",

  homepage: "https://www.performantsoftware.com/",

  thumbnail: 'thumbnail.jpg',

  extensions: [
    {
      name: "ner-document-menu-items",

      component_name: "NERMenuExtension",

      extension_point: "project:document-actions",
    },
  ],
};

const plugin = (): AstroIntegration => ({
  name: "plugin-ner",
  hooks: {
    "astro:config:setup": ({ config, logger, injectRoute }) => {
      registerPlugin(NERPlugin, config, logger);

      logger.info(
        "Injecting new API route /api/[projectId]/[documentId]/agent/ner"
      );

      injectRoute({
        pattern: "/api/[projectId]/[documentId]/agent/ner",
        entrypoint:
          "node_modules/@recogito/plugin-ner/src/api/NERAgentRoute.ts",
        prerender: false,
      });
    },
  },
});

export default plugin;
