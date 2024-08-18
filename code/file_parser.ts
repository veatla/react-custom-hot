import fs from "fs";
import path from "path";
import ts from "typescript";

class FileParser {
  removeTypes(sourceCode: string) {
    const sourceFile = ts.createSourceFile(
      "file.ts",
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
    const result: string[] = [];

    function visit(node: ts.Node) {
      if (ts.isTypeNode(node)) {
        return;
      }

      result.push(node.getText());
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return result.join("\n");
  }

  async build(filePath: string) {
    const fileName = path.basename(filePath);
    const extension = path.extname(fileName);
    const is_ts_file = extension.startsWith(".ts");
    // const output_filename = is_ts_file
    //   ? path.basename(fileName, extension) + ".js"
    //   : fileName;
    // const output_folder = path.join(process.cwd(), ".temp");
    // const output_path = path.join(output_folder, output_filename);
    // if (!fs.existsSync(output_folder)) {
    //   fs.mkdirSync(output_folder, { recursive: true });
    // }
    const sourceCode = fs.readFileSync(filePath, "utf8");
    if (is_ts_file) return this.removeTypes(sourceCode);

    return sourceCode;
  }
}
const fileParser = new FileParser();

export default fileParser;
