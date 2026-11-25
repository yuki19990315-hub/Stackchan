#!/usr/bin/env python3
"""Read-only backup of the board's 16 MiB flash. Never erase or write."""
import argparse, hashlib, json, pathlib, subprocess, sys
p=argparse.ArgumentParser()
p.add_argument("--port",required=True)
p.add_argument("--output",required=True,type=pathlib.Path)
a=p.parse_args()
size=16*1024*1024
out=a.output.resolve()
if out.exists(): p.error("output already exists")
if not out.parent.is_dir(): p.error("output directory does not exist")
partial=out.with_name(out.name+".partial")
meta=out.with_name(out.name+".json")
if partial.exists() or meta.exists(): p.error("partial or metadata already exists")
base=[sys.executable,"-m","esptool","--chip","esp32s3","--port",a.port,"--baud","460800"]
subprocess.run(base+["flash-id"],check=True)
subprocess.run(base+["read-flash","0",hex(size),str(partial)],check=True)
if partial.stat().st_size!=size: raise SystemExit("unexpected backup size; partial retained")
sha=hashlib.sha256()
with partial.open("rb") as f:
    for chunk in iter(lambda:f.read(1024*1024),b""): sha.update(chunk)
# Exclusive creation: avoid replacing an earlier backup.
with out.open("xb") as f, partial.open("rb") as src:
    for chunk in iter(lambda:src.read(1024*1024),b""): f.write(chunk)
with meta.open("x",encoding="utf-8") as f:
    json.dump({"chip":"esp32s3","bytes":size,"sha256":sha.hexdigest(),"verification":"length and hash only; device restore not verified"},f,indent=2)
partial.unlink()
print("Backup:",out,"SHA256:",sha.hexdigest())
