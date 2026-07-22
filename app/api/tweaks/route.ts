import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const CONTENT_PATH = join(process.cwd(), "data", "content.json");
const CWD = process.cwd();

export async function GET() {
  try {
    const raw = readFileSync(CONTENT_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Cannot read content.json" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    writeFileSync(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8");

    /* ── Git : add → commit → push ── */
    let pushed = false;
    let gitError: string | undefined;

    try {
      execSync("git add data/content.json", { cwd: CWD, stdio: "pipe" });

      try {
        execSync('git commit -m "tweaks: mise à jour du contenu"', {
          cwd: CWD, stdio: "pipe",
        });
      } catch (commitErr: unknown) {
        const stderr = (commitErr as { stderr?: Buffer }).stderr?.toString() ?? "";
        if (!stderr.includes("nothing to commit")) throw commitErr;
        /* rien à committer = contenu identique, on push quand même */
      }

      execSync("git push origin main", { cwd: CWD, stdio: "pipe" });
      pushed = true;
    } catch (err: unknown) {
      gitError =
        (err as { stderr?: Buffer }).stderr?.toString().trim() ||
        (err as Error).message ||
        "Erreur git inconnue";
    }

    return NextResponse.json({ ok: true, pushed, gitError });
  } catch {
    return NextResponse.json({ error: "Cannot write content.json" }, { status: 500 });
  }
}
