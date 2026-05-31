import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import math

PORT = int(os.environ.get('PORT', 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend')

class APIServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def do_POST(self):
        if self.path.startswith('/api/'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            self.handle_api_call(data)
        else:
            self.send_error(404, "Not Found")

    def handle_api_call(self, data):
        if self.path == '/api/vectors':
            self.api_vectors(data)
        elif self.path == '/api/projectile':
            self.api_projectile(data)
        elif self.path == '/api/motion1d':
            self.api_motion1d(data)
        elif self.path == '/api/relative_motion':
            self.api_relative_motion(data)
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def send_json(self, response_data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))

    # --- MATH ENDPOINTS ---

    def api_vectors(self, data):
        ax, ay, az = data.get('ax', 0), data.get('ay', 0), data.get('az', 0)
        bx, by, bz = data.get('bx', 0), data.get('by', 0), data.get('bz', 0)
        
        # Addition
        rx, ry, rz = ax + bx, ay + by, az + bz
        mag_r = math.sqrt(rx**2 + ry**2 + rz**2)
        
        # Products
        dot = ax * bx + ay * by + az * bz
        cross_x = ay * bz - az * by
        cross_y = az * bx - ax * bz
        cross_z = ax * by - ay * bx
        
        mag_a = math.sqrt(ax**2 + ay**2 + az**2)
        mag_b = math.sqrt(bx**2 + by**2 + bz**2)
        
        angle = 0
        if mag_a > 0 and mag_b > 0:
            cos_theta = dot / (mag_a * mag_b)
            # Clamp to prevent floating point errors
            cos_theta = max(-1.0, min(1.0, cos_theta))
            angle = math.degrees(math.acos(cos_theta))
            
        self.send_json({
            "rx": rx, "ry": ry, "rz": rz, "mag_r": mag_r,
            "dot": dot, "cross_x": cross_x, "cross_y": cross_y, "cross_z": cross_z,
            "mag_a": mag_a, "mag_b": mag_b,
            "angle": angle
        })

    def api_projectile(self, data):
        v0 = data.get('v0', 0)
        theta_deg = data.get('theta', 0)
        g = 9.8
        
        theta = math.radians(theta_deg)
        vx0 = v0 * math.cos(theta)
        vy0 = v0 * math.sin(theta)
        
        t_flight = (2 * vy0) / g if g != 0 else 0
        h_max = (vy0 ** 2) / (2 * g) if g != 0 else 0
        range_max = vx0 * t_flight
        
        # Generate trajectory array for animation (60 points)
        trajectory = []
        steps = 60
        dt = t_flight / steps if steps > 0 else 0
        for i in range(steps + 1):
            t = i * dt
            x = vx0 * t
            y = vy0 * t - 0.5 * g * t**2
            vy = vy0 - g * t
            trajectory.append({"t": t, "x": x, "y": max(0, y), "vx": vx0, "vy": vy})
            
        self.send_json({
            "t_flight": t_flight,
            "h_max": h_max,
            "range": range_max,
            "trajectory": trajectory
        })

    def api_motion1d(self, data):
        v0 = data.get('v0', 0)
        a = data.get('a', 0)
        t_total = data.get('t_total', 10)
        
        trajectory = []
        steps = 60
        dt = t_total / steps if steps > 0 else 0
        for i in range(steps + 1):
            t = i * dt
            x = v0 * t + 0.5 * a * t**2
            v = v0 + a * t
            trajectory.append({"t": t, "x": x, "v": v, "a": a})
            
        self.send_json({
            "trajectory": trajectory
        })
        
    def api_relative_motion(self, data):
        # Car chase example
        va = data.get('va', 0)
        vb = data.get('vb', 0)
        relative_v = va - vb
        self.send_json({"relative_v": relative_v})

if __name__ == "__main__":
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, APIServerHandler)
    print(f"Starting Python API Server on port {PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        sys.exit(0)
