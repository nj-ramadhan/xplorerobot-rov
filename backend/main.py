"""
main.py — REST API untuk Mission Database (PostgreSQL)
Jalankan: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os

# ══════════════════════════════════════════════════════════════════════════════
# KONFIGURASI DATABASE — sesuaikan dengan setup PostgreSQL kamu
# ══════════════════════════════════════════════════════════════════════════════

DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "port":     int(os.getenv("DB_PORT", "5432")),
    "database": os.getenv("DB_NAME",     "db_xplorerobot"),
    "user":     os.getenv("DB_USER",     "xplorerobot_user"),       # ← sesuaikan
    "password": os.getenv("DB_PASSWORD", "xplorerobot"),     # ← sesuaikan
}

# ══════════════════════════════════════════════════════════════════════════════
# DATABASE HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def get_db():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


def init_db():
    """Buat tabel missions kalau belum ada."""
    try:
        conn = get_db()
        cur  = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS missions (
                id          SERIAL       PRIMARY KEY,
                label       TEXT         NOT NULL,
                mode        TEXT         NOT NULL CHECK (mode IN ('waypoint', 'path')),
                waypoints   JSONB        NOT NULL DEFAULT '[]',
                saved_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ PostgreSQL terhubung — tabel 'missions' siap")
    except Exception as e:
        print(f"❌ Gagal konek ke PostgreSQL: {e}")
        print("   Pastikan PostgreSQL sudah berjalan dan DB_CONFIG sudah benar")


def row_to_dict(row: dict) -> dict:
    wps = row["waypoints"]
    if isinstance(wps, str):
        wps = json.loads(wps)
    return {
        "id":        row["id"],
        "label":     row["label"],
        "mode":      row["mode"],
        "waypoints": wps,
        "saved_at":  row["saved_at"].isoformat() if hasattr(row["saved_at"], "isoformat") else str(row["saved_at"]),
        "wp_count":  len(wps),
    }

# ══════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ══════════════════════════════════════════════════════════════════════════════

class WaypointItem(BaseModel):
    id:     int
    rosX:   float
    rosY:   float
    depth:  float
    yawDeg: Optional[float] = 0.0

class MissionCreate(BaseModel):
    label:     str
    mode:      str
    waypoints: List[WaypointItem]

# ══════════════════════════════════════════════════════════════════════════════
# FASTAPI APP
# ══════════════════════════════════════════════════════════════════════════════

app = FastAPI(title="ROV Mission Database API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/missions")
def list_missions():
    conn = get_db()
    cur  = conn.cursor()
    cur.execute("SELECT id, label, mode, waypoints, saved_at FROM missions ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [row_to_dict(dict(r)) for r in rows]


@app.get("/missions/{mission_id}")
def get_mission(mission_id: int):
    conn = get_db()
    cur  = conn.cursor()
    cur.execute(
        "SELECT id, label, mode, waypoints, saved_at FROM missions WHERE id = %s",
        (mission_id,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Misi tidak ditemukan")
    return row_to_dict(dict(row))


@app.post("/missions", status_code=201)
def save_mission(data: MissionCreate):
    if data.mode not in ("waypoint", "path"):
        raise HTTPException(status_code=400, detail="mode harus 'waypoint' atau 'path'")
    if not data.waypoints:
        raise HTTPException(status_code=400, detail="Waypoints tidak boleh kosong")

    label    = data.label.strip() or "Misi Baru"
    wps_json = json.dumps([wp.dict() for wp in data.waypoints])

    conn = get_db()
    cur  = conn.cursor()
    cur.execute(
        "INSERT INTO missions (label, mode, waypoints) VALUES (%s, %s, %s::jsonb) RETURNING id, label, mode, waypoints, saved_at",
        (label, data.mode, wps_json)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return row_to_dict(dict(row))


@app.put("/missions/{mission_id}")
def update_mission(mission_id: int, data: MissionCreate):
    label    = data.label.strip() or "Misi Baru"
    wps_json = json.dumps([wp.dict() for wp in data.waypoints])

    conn = get_db()
    cur  = conn.cursor()
    cur.execute(
        "UPDATE missions SET label=%s, mode=%s, waypoints=%s::jsonb, saved_at=NOW() WHERE id=%s RETURNING id, label, mode, waypoints, saved_at",
        (label, data.mode, wps_json, mission_id)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if row is None:
        raise HTTPException(status_code=404, detail="Misi tidak ditemukan")
    return row_to_dict(dict(row))


@app.delete("/missions/{mission_id}")
def delete_mission(mission_id: int):
    conn = get_db()
    cur  = conn.cursor()
    cur.execute("DELETE FROM missions WHERE id = %s RETURNING id", (mission_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if deleted is None:
        raise HTTPException(status_code=404, detail="Misi tidak ditemukan")
    return {"ok": True, "deleted_id": mission_id}