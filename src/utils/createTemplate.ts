type TemplateInput = {
  title: string;
  overview: string;
  releaseDate: string;
};

/**
 * Creates a formatted template string from the given input.
 */
export function createTemplate(input: TemplateInput): string {
  const releaseDate = "release date: " + input.releaseDate;
  return [input.title, input.overview, releaseDate].join("\n\n");
}
