import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'public/amplitudes/image-settings.json');

export async function GET() {
  try {
    const data = readFileSync(CONFIG_PATH, 'utf8');
    return Response.json(JSON.parse(data));
  } catch {
    return Response.json({ version: 1, images: {} });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'Write failed' }, { status: 500 });
  }
}
