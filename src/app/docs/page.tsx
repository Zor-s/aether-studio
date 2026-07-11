import fs from "fs";
import path from "path";
import DocsClient from "./docs-client";

export const metadata = {
  title: "Aether Developer Documentation Hub",
  description: "Read plan roadmap, system architecture details, and official UI systems tokens.",
};

export default async function DocsPage() {
  const docsDir = path.join(process.cwd(), "docs");
  const files = ["plan.md", "architecture.md", "ui-documentation.md"];

  const documents = files.map((filename) => {
    const filePath = path.join(docsDir, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    return {
      id: filename.replace(".md", ""),
      title:
        filename === "plan.md"
          ? "Roadmap & Plan"
          : filename === "architecture.md"
          ? "Edge Architecture"
          : "UI Specifications",
      filename,
      content,
    };
  });

  return <DocsClient documents={documents} />;
}
