import subprocess
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/setup")

@router.get("/rootca")
def download_rootca():
    try:
        caroot = subprocess.check_output(["mkcert", "-CAROOT"], text=True).strip()
    except Exception:
        raise HTTPException(503, "mkcert not found on server")
    cert = Path(caroot) / "rootCA.pem"
    if not cert.exists():
        raise HTTPException(404, "CA cert missing — run: mkcert -install")
    return FileResponse(cert, filename="MoDeck-CA.pem", media_type="application/x-pem-file")
