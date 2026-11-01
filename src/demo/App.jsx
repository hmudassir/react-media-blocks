import { BlockRenderer } from "../media";
import content from "./content.json";

export default function App() {
  return (
    <main className="demo">
      <h1>{content.title}</h1>
      <BlockRenderer blocks={content.blocks} />
      <details className="demo-source">
        <summary>View the JSON behind this page</summary>
        <pre>{JSON.stringify(content.blocks, null, 2)}</pre>
      </details>
    </main>
  );
}
