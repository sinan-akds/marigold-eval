#!/usr/bin/env node
/**
 * Minimal MCP server that provides Marigold documentation lookups.
 * Replaces the OAuth-protected HTTP MCP with a local stdio server
 * that fetches docs from the public website.
 */

import { createInterface } from 'node:readline';

const MANIFEST_URL = 'https://www.marigold-ui.io/manifest.json';
const BASE_URL = 'https://www.marigold-ui.io';

let cachedManifest = null;

async function fetchManifest() {
  if (cachedManifest) return cachedManifest;
  const res = await fetch(MANIFEST_URL);
  const data = await res.json();
  cachedManifest = data.pages || [];
  return cachedManifest;
}

async function searchComponents(query) {
  const pages = await fetchManifest();
  const q = query.toLowerCase();
  const matches = pages.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.category?.toLowerCase().includes(q)
  );
  return matches.slice(0, 15).map(p => ({
    name: p.name,
    category: p.category,
    description: p.description,
    url: `${BASE_URL}/${p.slug}`,
    slug: p.slug,
  }));
}

async function getComponentDocs(slug) {
  const url = `${BASE_URL}/${slug}`;
  try {
    const res = await fetch(url);
    const html = await res.text();
    // Extract main content — strip nav, scripts, styles
    const bodyMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
      || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    let content = bodyMatch ? bodyMatch[1] : html;
    // Strip HTML tags, keep text
    content = content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    // Limit to 8000 chars
    if (content.length > 8000) content = content.slice(0, 8000) + '...';
    return { url, content };
  } catch (err) {
    return { url, content: `Error fetching docs: ${err.message}` };
  }
}

async function listAllComponents() {
  const pages = await fetchManifest();
  const components = pages
    .filter(p => p.category?.startsWith('components/'))
    .map(p => ({ name: p.name, category: p.category, description: p.description, slug: p.slug }));
  return components;
}

const TOOLS = [
  {
    name: 'search_docs',
    description: 'Search the official Marigold documentation by component name, category, or keyword. Returns matching components with their documentation URLs. This is the primary docs lookup tool — call it before writing any component code.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search query (component name, category, or keyword)' } },
      required: ['query'],
    },
  },
  {
    name: 'search_components',
    description: 'Alias of search_docs. Search for Marigold components by name, category, or description. Returns matching components with their documentation URLs.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Search query (component name, category, or keyword)' } },
      required: ['query'],
    },
  },
  {
    name: 'get_component_docs',
    description: 'Get the full documentation page for a specific Marigold component. Provide the slug from the manifest (e.g. "components/form/textfield").',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'Component slug from the manifest (e.g. "components/form/textfield")' } },
      required: ['slug'],
    },
  },
  {
    name: 'list_all_components',
    description: 'List all available Marigold components with their categories and descriptions.',
    inputSchema: { type: 'object', properties: {} },
  },
];

function sendResponse(id, result) {
  const response = JSON.stringify({ jsonrpc: '2.0', id, result });
  process.stdout.write(response + '\n');
}

function sendError(id, code, message) {
  const response = JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } });
  process.stdout.write(response + '\n');
}

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }

  const { method, id, params } = msg;

  if (method === 'initialize') {
    sendResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'marigold-docs', version: '1.0.0' },
    });
    return;
  }

  if (method === 'notifications/initialized') return;

  if (method === 'tools/list') {
    sendResponse(id, { tools: TOOLS });
    return;
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    try {
      if (toolName === 'search_docs' || toolName === 'search_components') {
        const results = await searchComponents(args.query);
        sendResponse(id, { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] });
      } else if (toolName === 'get_component_docs') {
        const docs = await getComponentDocs(args.slug);
        sendResponse(id, { content: [{ type: 'text', text: `# ${args.slug}\nURL: ${docs.url}\n\n${docs.content}` }] });
      } else if (toolName === 'list_all_components') {
        const components = await listAllComponents();
        sendResponse(id, { content: [{ type: 'text', text: JSON.stringify(components, null, 2) }] });
      } else {
        sendError(id, -32601, `Unknown tool: ${toolName}`);
      }
    } catch (err) {
      sendError(id, -32000, err.message);
    }
    return;
  }

  if (id !== undefined) {
    sendError(id, -32601, `Method not found: ${method}`);
  }
});
