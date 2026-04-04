import http.server
import socketserver
import os
import json

# ═══════════════════════════════════════════════════════════════
#  Admin-Passwort — hier nach Belieben ändern!
ADMIN_PASSWORD = "coaching2026"
# ═══════════════════════════════════════════════════════════════

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTENT_FILE = os.path.join(BASE_DIR, "content", "data.json")
IMAGES_DIR = os.path.join(BASE_DIR, "images")

ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}


class Handler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/api/content":
            self._serve_content()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/auth":
            self._check_auth()
        elif self.path == "/api/content":
            self._save_content()
        elif self.path == "/api/upload":
            self._handle_upload()
        else:
            self.send_error(404)

    # ── Hilfsfunktionen ────────────────────────────────────────

    def _auth_ok(self):
        return self.headers.get("X-Admin-Password", "") == ADMIN_PASSWORD

    def _json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return self.rfile.read(length) if length else b""

    # ── Endpunkte ──────────────────────────────────────────────

    def _check_auth(self):
        try:
            pw = json.loads(self._read_body()).get("password", "")
        except Exception:
            pw = ""
        if pw == ADMIN_PASSWORD:
            self._json({"ok": True})
        else:
            self._json({"error": "Falsches Passwort"}, 401)

    def _serve_content(self):
        try:
            with open(CONTENT_FILE, "r", encoding="utf-8") as f:
                body = f.read().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except FileNotFoundError:
            self._json({"error": "content/data.json nicht gefunden"}, 404)

    def _save_content(self):
        if not self._auth_ok():
            self._json({"error": "Nicht autorisiert — bitte Passwort prüfen"}, 401)
            return
        try:
            payload = json.loads(self._read_body().decode("utf-8"))
            os.makedirs(os.path.dirname(CONTENT_FILE), exist_ok=True)
            with open(CONTENT_FILE, "w", encoding="utf-8") as f:
                json.dump(payload, f, ensure_ascii=False, indent=2)
            self._json({"ok": True})
        except json.JSONDecodeError as e:
            self._json({"error": f"Ungültiges JSON: {e}"}, 400)
        except Exception as e:
            self._json({"error": str(e)}, 500)

    def _handle_upload(self):
        if not self._auth_ok():
            self._json({"error": "Nicht autorisiert"}, 401)
            return
        ct = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in ct:
            self._json({"error": "multipart/form-data erwartet"}, 400)
            return
        try:
            boundary = ct.split("boundary=")[1].strip().encode()
        except (IndexError, ValueError):
            self._json({"error": "Kein Boundary gefunden"}, 400)
            return
        body = self._read_body()
        for part in body.split(b"--" + boundary):
            if b'filename="' not in part:
                continue
            sep = part.find(b"\r\n\r\n")
            if sep == -1:
                continue
            head = part[:sep].decode("latin-1")
            data = part[sep + 4:]
            if data.endswith(b"\r\n"):
                data = data[:-2]
            for line in head.split("\r\n"):
                if 'filename="' not in line:
                    continue
                filename = line.split('filename="')[1].rstrip('"')
                filename = os.path.basename(filename)
                if not filename:
                    break
                ext = os.path.splitext(filename)[1].lower()
                if ext not in ALLOWED_IMAGE_EXTS:
                    self._json({"error": f"Nur Bildformate erlaubt: {', '.join(ALLOWED_IMAGE_EXTS)}"}, 400)
                    return
                os.makedirs(IMAGES_DIR, exist_ok=True)
                with open(os.path.join(IMAGES_DIR, filename), "wb") as f:
                    f.write(data)
                self._json({"ok": True, "path": f"images/{filename}"})
                return
        self._json({"error": "Keine Datei im Upload gefunden"}, 400)

    def log_message(self, *args):
        pass  # Konsolenausgabe unterdrücken


class ThreadingServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


os.chdir(BASE_DIR)
print(f"Server gestartet: http://localhost:{PORT}")
print(f"Admin-Bereich:   http://localhost:{PORT}/admin/")
print(f'Admin-Passwort:  "{ADMIN_PASSWORD}"  (in serve.py aenderbar)')
with ThreadingServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
