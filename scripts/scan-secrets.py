#!/usr/bin/env python3
"""Supplemental offline scan. Prints locations only; not a replacement for Gitleaks."""
import pathlib, re, subprocess, sys
root = pathlib.Path(__file__).resolve().parents[1]
rules = {
    'Discord token': r'(?:mfa\.[\w-]{60,}|[A-Za-z\d_-]{23,28}\.[A-Za-z\d_-]{6}\.[A-Za-z\d_-]{25,110})',
    'Authenticated MongoDB URI': r'mongodb(?:\+srv)?://[^\s\x27\x22`]+@',
    'Webhook credential': r'https://(?:canary\.|ptb\.)?discord(?:app)?\.com/api/webhooks/[^\s\x27\x22`]+',
    'Private key': r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'Literal API authorization': r'''["'](?:Authorization|X-RapidAPI-Key|api[_-]?key|password|token|secret)["']\s*:\s*["']([A-Za-z\d_./+=-]{20,})["']''',
    'Credential-bearing HTTP URL': r'https?://[^/\s\x27\x22]+:[^/\s\x27\x22]+@',
    'AWS access key': r'(?:AKIA|ASIA)[A-Z0-9]{16}',
    'GitHub token': r'(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})',
}
findings = []
def scan(text, location):
    for name, pattern in rules.items():
        for match in re.finditer(pattern, text):
            findings.append((name, location, text.count('\n', 0, match.start()) + 1))
for path in root.rglob('*'):
    if not path.is_file() or any(part in {'.git', 'node_modules', 'reports'} for part in path.relative_to(root).parts):
        continue
    try: scan(path.read_text(), str(path.relative_to(root)))
    except (UnicodeError, OSError): pass
if '--history' in sys.argv:
    result = subprocess.run(['git', '-C', str(root), 'cat-file', '--batch-all-objects', '--batch-check=%(objectname) %(objecttype)'], capture_output=True, text=True, check=True)
    for row in result.stdout.splitlines():
        oid, kind = row.split()
        if kind != 'blob': continue
        data = subprocess.run(['git', '-C', str(root), 'cat-file', 'blob', oid], capture_output=True, check=True).stdout
        scan(data.decode('utf8', 'replace'), 'history blob ' + oid[:12])
for name, location, line in findings:
    print(f'{name}: {location}:{line} (value withheld)')
print(f'Supplemental scan: {len(findings)} findings. Gitleaks and manual review remain required.')
sys.exit(bool(findings))
