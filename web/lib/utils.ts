import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract variables from template content using {{variable_name}} syntax
 * Returns array of unique variable names found
 */
export function extractTemplateVariables(content: string): string[] {
  if (!content) return [];
  
  // Regex to match {{variable_name}} pattern
  const variableRegex = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
  const matches = new Set<string>();
  
  let match;
  while ((match = variableRegex.exec(content)) !== null) {
    matches.add(match[1]);
  }
  
  return Array.from(matches).sort();
}

/**
 * Render template content with provided values
 * Replaces all {{variable}} with corresponding values
 */
export function renderTemplate(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(
    /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g,
    (match, variable) => values[variable] || match
  );
}
