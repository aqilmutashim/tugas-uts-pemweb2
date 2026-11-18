// Study Buddy - backend: Express + SQLite (better-sqlite3) + WebSocket (ws)
const express = require('express'), http = require('http'), path = require('path'), crypto = require('crypto');
const Database = require('better-sqlite3'), bcrypt = require('bcryptjs'), { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 3000, PROD = process.env.NODE_ENV === 'production';

const db = new Database(process.env.DB_PATH || path.join(__dirname, 'studybuddy.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, pw TEXT NOT NULL,
  prodi TEXT, sem TEXT, bio TEXT, sub TEXT, sch TEXT, mode TEXT, ready INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions_auth(token TEXT PRIMARY KEY, uid INTEGER NOT NULL, exp INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS study_requests(id INTEGER PRIMARY KEY, uid INTEGER, sub TEXT, topic TEXT, date TEXT, time TEXT, mode TEXT, st TEXT DEFAULT 'aktif');
CREATE TABLE IF NOT EXISTS match_requests(id INTEGER PRIMARY KEY, from_id INTEGER, to_id INTEGER, topic TEXT, msg TEXT, st TEXT DEFAULT 'pending', at INTEGER);
CREATE TABLE IF NOT EXISTS discussions(id INTEGER PRIMARY KEY, a INTEGER, b INTEGER, topic TEXT, t0 INTEGER, t1 INTEGER);
-- DATA SEMENTARA: dihapus saat diskusi berakhir
CREATE TABLE IF NOT EXISTS tmp_msgs(id INTEGER PRIMARY KEY, did INTEGER, sender INTEGER, t TEXT, x TEXT, name TEXT, url TEXT, data TEXT, allow INTEGER DEFAULT 0, ts INTEGER);
CREATE TABLE IF NOT EXISTS tmp_notes(did INTEGER, uid INTEGER, body TEXT, PRIMARY KEY(did, uid));
-- DATA ARSIP: tabel terpisah, tidak tersentuh saat pembersihan diskusi
CREATE TABLE IF NOT EXISTS archive(id INTEGER PRIMARY KEY, uid INTEGER, name TEXT, type TEXT, url TEXT, data TEXT, from_name TEXT, at INTEGER, disc TEXT, did INTEGER, src INTEGER, UNIQUE(uid, src));
CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY, uid INTEGER, pid INTEGER, topic TEXT, at INTEGER, dur INTEGER, items TEXT);
`);

const q = (s, ...p) => db.prepare(s).all(...p), q1 = (s, ...p) => db.prepare(s).get(...p), run = (s, ...p) => db.prepare(s).run(...p);
const str = (v, m) => String(v == null ? '' : v).trim().slice(0, m);
const bad = (res, m, c = 400) => res.status(c).json({ error: m });
const COL = ['#a78bfa', '#f0abfc', '#818cf8', '#c084fc', '#e879f9', '#a5b4fc'];
const active = id => q1('SELECT * FROM discussions WHERE t1 IS NULL AND (a=? OR b=?)', id, id);
const buddy = u => ({ id: u.id, n: u.name, p: u.prodi, s: +u.sem || 0, sub: JSON.parse(u.sub || '[]'), bio: u.bio, m: u.mode, c: COL[u.id % COL.length] });

/* ---------- Auth ---------- */
const cookie = (req, k) => ((req.headers.cookie || '').split(';').map(s => s.trim().split('=')).find(a => a[0] === k) || [])[1];
const authU = req => {
  const t = cookie(req, 'sid'); if (!t) return null;
  const s = q1('SELECT uid FROM sessions_auth WHERE token=? AND exp>?', t, Date.now());
  return s ? q1('SELECT * FROM users WHERE id=?', s.uid) : null;
};
const needAuth = (req, res, next) => { const u = authU(req); if (!u) return bad(res, 'Silakan masuk terlebih dahulu', 401); req.u = u; next(); };
const ready = (req, res, next) => req.u.ready ? next() : bad(res, 'Lengkapi profil terlebih dahulu', 403);
const A = [needAuth, ready];
function startAuth(res, uid) {
  const t = crypto.randomBytes(32).toString('hex');
  run('INSERT INTO sessions_auth VALUES(?,?,?)', t, uid, Date.now() + 30 * 864e5);
  res.setHeader('Set-Cookie', `sid=${t}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${30 * 86400}${PROD ? '; Secure' : ''}`);
}
const hits = new Map();
const limit = (req, res, next) => {
  const n = (hits.get(req.ip) || []).filter(t => Date.now() - t < 6e4);
  if (n.length >= 10) return bad(res, 'Terlalu banyak percobaan, coba lagi sebentar', 429);
  n.push(Date.now()); hits.set(req.ip, n); next();
};

/* ---------- App ---------- */
const app = express();
app.set('trust proxy', 1);
app.use((req, res, next) => { res.set('X-Content-Type-Options', 'nosniff'); next(); });
app.use('/api', (req, res, next) => req.method === 'POST' && !req.is('json') ? bad(res, 'Content-Type harus application/json', 415) : next()); // proteksi CSRF dasar
app.use(express.json({ limit: '8mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/register', limit, (req, res) => {
  const b = req.body || {}, e = str(b.email, 120).toLowerCase(), n = str(b.name, 80);
  if (!n || !/^[^@\s]+@[^@\s]+\.(ac\.id|edu)$/.test(e)) return bad(res, 'Nama atau email kampus (.ac.id / .edu) tidak valid');
  if (String(b.password || '').length < 6) return bad(res, 'Kata sandi minimal 6 karakter');
  if (q1('SELECT 1 FROM users WHERE email=?', e)) return bad(res, 'Email sudah terdaftar', 409);
  const r = run('INSERT INTO users(email,name,pw) VALUES(?,?,?)', e, n, bcrypt.hashSync(String(b.password), 10));
  startAuth(res, r.lastInsertRowid); res.json({ ok: 1 });
});
app.post('/api/login', limit, (req, res) => {
  const b = req.body || {}, u = q1('SELECT * FROM users WHERE email=?', str(b.email, 120).toLowerCase());
  if (!u || !bcrypt.compareSync(String(b.password || ''), u.pw)) return bad(res, 'Email atau kata sandi salah', 401);
  startAuth(res, u.id); res.json({ ok: 1 });
});
app.post('/api/logout', (req, res) => {
  const t = cookie(req, 'sid'); if (t) run('DELETE FROM sessions_auth WHERE token=?', t);
  res.setHeader('Set-Cookie', 'sid=; HttpOnly; Path=/; Max-Age=0'); res.json({ ok: 1 });
});
app.post('/api/password', needAuth, (req, res) => {
  const b = req.body || {};
  if (!bcrypt.compareSync(String(b.old || ''), req.u.pw)) return bad(res, 'Kata sandi lama salah');
  if (String(b.neu || '').length < 6) return bad(res, 'Minimal 6 karakter');
  run('UPDATE users SET pw=? WHERE id=?', bcrypt.hashSync(String(b.neu), 10), req.u.id); res.json({ ok: 1 });
});

/* ---------- State (semua data milik user yang sedang login) ---------- */
function stateFor(u) {
  const me = u.id, ses = active(me), fmt = t => new Date(t).toLocaleDateString('id-ID');
  const d = {
    name: u.name,
    prof: u.ready ? { name: u.name, prodi: u.prodi, sem: u.sem, mode: u.mode, bio: u.bio, sub: JSON.parse(u.sub || '[]'), sch: u.sch } : null,
    ses: null, sent: [],
    reqs: q('SELECT * FROM study_requests WHERE uid=? ORDER BY id DESC', me),
    inc: q(`SELECT m.*, u.sch, u.mode FROM match_requests m JOIN users u ON u.id=m.from_id WHERE m.to_id=? AND m.st='pending' ORDER BY m.id`, me)
      .map(r => ({ id: r.id, from: r.from_id, topic: r.topic, time: r.sch || '-', mode: r.mode || '-', msg: r.msg || '' })),
    arc: q('SELECT id,name,type,url,from_name,at,disc,did FROM archive WHERE uid=? ORDER BY id DESC', me)
      .map(a => ({ id: a.id, name: a.name, type: a.type, url: a.url, from: a.from_name, date: fmt(a.at), disc: a.disc, sid: a.did })),
    hist: q('SELECT * FROM history WHERE uid=? ORDER BY id DESC', me)
      .map(h => ({ id: h.id, p: h.pid, topic: h.topic, date: fmt(h.at), dur: h.dur, st: 'Selesai', items: JSON.parse(h.items || '[]') })),
  };
  d.stat = { h: d.hist.reduce((s, x) => s + x.dur, 0) / 60, d: d.hist.length, b: new Set(d.hist.map(x => x.p)).size };
  if (ses) {
    const saved = new Set(q('SELECT src FROM archive WHERE uid=?', me).map(r => r.src));
    d.ses = {
      id: ses.id, p: ses.a === me ? ses.b : ses.a, topic: ses.topic, t0: ses.t0,
      notes: (q1('SELECT body FROM tmp_notes WHERE did=? AND uid=?', ses.id, me) || {}).body || '',
      msgs: q('SELECT id,sender,t,x,name,url,allow,ts FROM tmp_msgs WHERE did=? ORDER BY id', ses.id)
        .map(m => ({ id: m.id, f: m.sender === me ? 'me' : 'p', t: m.t, x: m.x, name: m.name, url: m.url, allow: !!m.allow, ts: m.ts, saved: saved.has(m.id) })),
    };
  }
  return { me: u.email, d, buddies: q('SELECT * FROM users WHERE ready=1 AND id<>?', me).map(buddy) };
}
app.get('/api/state', (req, res) => { const u = authU(req); res.json(u ? stateFor(u) : { me: null, d: null, buddies: [] }); });

app.post('/api/profile', needAuth, (req, res) => {
  const b = req.body || {}, name = str(b.name, 80), prodi = str(b.prodi, 80), sem = str(b.sem, 3);
  const sub = (Array.isArray(b.sub) ? b.sub : []).map(x => str(x, 60)).filter(Boolean).slice(0, 10);
  const mode = ['Online', 'Offline', 'Keduanya'].includes(b.mode) ? b.mode : 'Online';
  if (!name || !prodi || !sem || !sub.length) return bad(res, 'Data profil belum lengkap');
  run('UPDATE users SET name=?,prodi=?,sem=?,bio=?,sch=?,mode=?,sub=?,ready=1 WHERE id=?', name, prodi, sem, str(b.bio, 300), str(b.sch, 120), mode, JSON.stringify(sub), req.u.id);
  res.json({ ok: 1 });
});

/* ---------- Study request & match ---------- */
app.post('/api/studyreq', A, (req, res) => {
  const b = req.body || {};
  if (!str(b.sub, 80) || !str(b.topic, 120)) return bad(res, 'Isi mata kuliah dan topik');
  run('INSERT INTO study_requests(uid,sub,topic,date,time,mode) VALUES(?,?,?,?,?,?)', req.u.id, str(b.sub, 80), str(b.topic, 120), str(b.date, 10), str(b.time, 5), b.mode === 'Offline' ? 'Offline' : 'Online');
  res.json({ ok: 1 });
});
app.post('/api/studyreq/cancel', A, (req, res) => { run("UPDATE study_requests SET st='dibatalkan' WHERE id=? AND uid=?", req.body.id, req.u.id); res.json({ ok: 1 }); });

app.post('/api/request', A, (req, res) => {
  const me = req.u.id, to = +req.body.to, t = q1('SELECT id FROM users WHERE id=? AND ready=1', to);
  if (!t || to === me) return bad(res, 'Pengguna tidak ditemukan', 404);
  if (active(me)) return bad(res, 'Akhiri diskusi aktif terlebih dahulu');
  if (active(to)) return bad(res, 'Buddy ini sedang dalam diskusi');
  if (q1("SELECT 1 FROM match_requests WHERE from_id=? AND to_id=? AND st='pending'", me, to)) return bad(res, 'Permintaan ke buddy ini masih menunggu', 409); // cegah duplikat
  run('INSERT INTO match_requests(from_id,to_id,topic,msg,at) VALUES(?,?,?,?,?)', me, to, str(req.body.topic, 120) || 'Belajar bareng', str(req.body.msg, 300), Date.now());
  push(to, 'incoming'); res.json({ ok: 1 });
});
app.post('/api/accept', A, (req, res) => {
  const me = req.u.id, r = q1("SELECT * FROM match_requests WHERE id=? AND to_id=? AND st='pending'", req.body.id, me);
  if (!r) return bad(res, 'Permintaan tidak ditemukan', 404);
  if (active(me) || active(r.from_id)) return bad(res, 'Salah satu pihak sedang dalam diskusi');
  db.transaction(() => {
    run("UPDATE match_requests SET st='accepted' WHERE id=?", r.id);
    run("UPDATE match_requests SET st='expired' WHERE st='pending' AND (to_id IN (?,?) OR from_id IN (?,?))", me, r.from_id, me, r.from_id);
    run('INSERT INTO discussions(a,b,topic,t0) VALUES(?,?,?,?)', r.from_id, me, r.topic, Date.now());
  })();
  push(r.from_id, 'accepted'); res.json({ ok: 1 });
});
app.post('/api/reject', A, (req, res) => {
  const r = q1("SELECT * FROM match_requests WHERE id=? AND to_id=? AND st='pending'", req.body.id, req.u.id);
  if (!r) return bad(res, 'Permintaan tidak ditemukan', 404);
  run("UPDATE match_requests SET st='rejected' WHERE id=?", r.id); push(r.from_id, 'rejected'); res.json({ ok: 1 });
});

/* ---------- Discussion: chat, berkas, tautan ---------- */
const EXT = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];
app.post('/api/msg', A, (req, res) => {
  const me = req.u.id, s = active(me), b = req.body || {};
  if (!s) return bad(res, 'Tidak ada diskusi aktif');
  let x = null, name = null, url = null, data = null;
  if (b.t === 'txt') { x = str(b.x, 2000); if (!x) return bad(res, 'Pesan kosong'); }
  else if (b.t === 'link') {
    try { const u = new URL(String(b.url)); if (!/^https?:$/.test(u.protocol)) throw 0; url = u.href.slice(0, 500); name = url; }
    catch (e) { return bad(res, 'URL tidak valid'); }
  } else if (b.t === 'file') {
    name = str(b.name, 120);
    if (!EXT.includes(name.split('.').pop().toLowerCase())) return bad(res, 'Tipe berkas tidak didukung');
    data = String(b.data || '');
    if (data.length > 7e6 || !/^data:[\w.+\/-]*;base64,[A-Za-z0-9+\/]*={0,2}$/.test(data)) return bad(res, 'Berkas tidak valid atau lebih dari 5 MB');
  } else return bad(res, 'Tipe pesan tidak valid');
  // izin simpan: default TIDAK; hanya true persis yang mengizinkan
  run('INSERT INTO tmp_msgs(did,sender,t,x,name,url,data,allow,ts) VALUES(?,?,?,?,?,?,?,?,?)', s.id, me, b.t, x, name, url, data, b.allow === true ? 1 : 0, Date.now());
  push(s.a === me ? s.b : s.a, 'msg'); res.json({ ok: 1 });
});
app.get('/api/msgfile/:id', A, (req, res) => {
  const m = q1('SELECT m.* FROM tmp_msgs m JOIN discussions d ON d.id=m.did WHERE m.id=? AND d.t1 IS NULL AND (d.a=? OR d.b=?)', req.params.id, req.u.id, req.u.id);
  if (!m || m.t !== 'file') return bad(res, 'Tidak ditemukan', 404);
  res.json({ name: m.name, data: m.data });
});
app.post('/api/save', A, (req, res) => { // satu-satunya jalan masuk ke Arsip; izin dicek di server
  const me = req.u.id, s = active(me), m = s && q1('SELECT * FROM tmp_msgs WHERE id=? AND did=?', req.body.mid, s.id);
  if (!m || m.sender === me) return bad(res, 'Item tidak ditemukan', 404);
  if (!m.allow) return bad(res, 'Pengirim tidak mengizinkan penyimpanan item ini', 403);
  const sender = q1('SELECT name FROM users WHERE id=?', m.sender);
  run('INSERT OR IGNORE INTO archive(uid,name,type,url,data,from_name,at,disc,did,src) VALUES(?,?,?,?,?,?,?,?,?,?)', me, m.name, m.t, m.url, m.data, sender.name, Date.now(), s.topic, s.id, m.id);
  res.json({ ok: 1 });
});
app.post('/api/notes', A, (req, res) => {
  const s = active(req.u.id);
  if (s) run('INSERT INTO tmp_notes(did,uid,body) VALUES(?,?,?) ON CONFLICT(did,uid) DO UPDATE SET body=excluded.body', s.id, req.u.id, str(req.body.v, 5000));
  res.json({ ok: 1 });
});
app.post('/api/end', A, (req, res) => {
  const me = req.u.id, s = active(me);
  if (!s) return bad(res, 'Tidak ada diskusi aktif');
  const now = Date.now(), dur = Math.max(1, Math.round((now - s.t0) / 6e4));
  db.transaction(() => {
    for (const [uid, pid] of [[s.a, s.b], [s.b, s.a]]) {
      const items = q('SELECT name FROM archive WHERE uid=? AND did=?', uid, s.id).map(r => r.name);
      run('INSERT INTO history(uid,pid,topic,at,dur,items) VALUES(?,?,?,?,?,?)', uid, pid, s.topic, now, dur, JSON.stringify(items));
    }
    run('UPDATE discussions SET t1=? WHERE id=?', now, s.id);
    run('DELETE FROM tmp_msgs WHERE did=?', s.id); // bersihkan data sementara
    run('DELETE FROM tmp_notes WHERE did=?', s.id); // arsip TIDAK disentuh
  })();
  push(s.a === me ? s.b : s.a, 'ended'); res.json({ ok: 1 });
});

/* ---------- Arsip ---------- */
app.get('/api/archive/:id/download', A, (req, res) => {
  const a = q1("SELECT * FROM archive WHERE id=? AND uid=? AND type='file'", req.params.id, req.u.id);
  if (!a) return res.status(404).end();
  res.set({ 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(a.name)}` })
    .send(Buffer.from(a.data.split(',')[1], 'base64'));
});
app.post('/api/archive/delete', A, (req, res) => { run('DELETE FROM archive WHERE id=? AND uid=?', req.body.id, req.u.id); res.json({ ok: 1 }); });

app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.type === 'entity.too.large' ? 'Berkas terlalu besar' : 'Terjadi kesalahan server' }));

/* ---------- Real-time (WebSocket) ---------- */
const server = http.createServer(app), wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, sock, head) => {
  let okOrigin = false; try { okOrigin = new URL(req.headers.origin).host === req.headers.host; } catch (e) {}
  const u = req.url === '/ws' && okOrigin && authU(req);
  if (!u) return sock.destroy();
  wss.handleUpgrade(req, sock, head, ws => { ws.uid = u.id; });
});
function push(uid, ev) { for (const c of wss.clients) if (c.uid === uid && c.readyState === 1) c.send(JSON.stringify({ ev })); }

server.listen(PORT, () => console.log(`Study Buddy berjalan di http://localhost:${PORT}`));
