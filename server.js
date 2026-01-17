const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Security-ish headers (basic)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

// No homepage (hide site)
app.get("/", (req, res) => {
  res.status(404).send("Not Found");
});

// Verification page (only visible with token)
app.get("/verify", (req, res) => {
  const token = String(req.query.token || "").trim();

  if (!token || token.length < 10) {
    return res.status(404).send("Not Found");
  }

  // NOTE: We do NOT show token on page (so screenshots won’t leak it)
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Verification</title>
  <meta name="theme-color" content="#0b0f1a" />
  <style>
    :root{
      --bg:#070a12;
      --card:#0c1222cc;
      --stroke:#ffffff14;
      --text:#e9ecff;
      --muted:#b9c0ffb0;
      --brand:#5865f2;
      --brand2:#8b5cf6;
      --good:#22c55e;
      --bad:#ef4444;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
      background: radial-gradient(1200px 800px at 70% 20%, #1b2a6f30, transparent 60%),
                  radial-gradient(900px 700px at 20% 80%, #8b5cf620, transparent 55%),
                  linear-gradient(180deg, #050714, #070a12);
      color:var(--text);
      overflow:hidden;
    }

    /* Animated blobs */
    .blob{
      position:absolute;
      width:520px;height:520px;
      filter: blur(40px);
      opacity:.55;
      border-radius: 50%;
      animation: float 10s ease-in-out infinite;
      transform: translate3d(0,0,0);
      pointer-events:none;
    }
    .b1{left:-140px; top:-160px; background: radial-gradient(circle at 30% 30%, #5865f2, transparent 60%);}
    .b2{right:-180px; bottom:-200px; background: radial-gradient(circle at 60% 40%, #8b5cf6, transparent 60%); animation-delay:-3s;}
    .b3{left:30%; bottom:-260px; background: radial-gradient(circle at 50% 50%, #22c55e40, transparent 65%); animation-delay:-6s; opacity:.35;}
    @keyframes float{
      0%,100%{ transform: translate(0,0) scale(1); }
      50%{ transform: translate(18px,-22px) scale(1.04); }
    }

    /* Subtle stars */
    .noise{
      position:absolute; inset:0;
      background-image:
        radial-gradient(#ffffff12 1px, transparent 1px);
      background-size: 22px 22px;
      opacity:.35;
      mask-image: radial-gradient(circle at 50% 40%, black 40%, transparent 70%);
      pointer-events:none;
      animation: drift 12s linear infinite;
    }
    @keyframes drift{
      0%{ transform: translate(0,0); }
      100%{ transform: translate(-40px, 20px); }
    }

    .wrap{
      position:relative;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      padding: 22px;
    }

    .card{
      width:min(420px, 92vw);
      background: var(--card);
      border: 1px solid var(--stroke);
      border-radius: 18px;
      box-shadow: 0 20px 60px #00000080;
      backdrop-filter: blur(12px);
      padding: 22px;
      overflow:hidden;
      position:relative;
      animation: pop .5s ease-out both;
    }
    @keyframes pop{
      from{ transform: translateY(10px); opacity:0;}
      to{ transform: translateY(0); opacity:1;}
    }

    .top{
      display:flex;
      gap:12px;
      align-items:center;
      margin-bottom: 14px;
    }
    .logo{
      width:44px;height:44px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--brand), var(--brand2));
      box-shadow: 0 12px 30px #5865f240;
      position:relative;
      overflow:hidden;
      flex:0 0 auto;
    }
    .logo::after{
      content:"";
      position:absolute; inset:-40px;
      background: linear-gradient(90deg, transparent, #ffffff30, transparent);
      transform: rotate(25deg);
      animation: shimmer 2.2s linear infinite;
    }
    @keyframes shimmer{
      0%{ transform: translateX(-60%) rotate(25deg); }
      100%{ transform: translateX(60%) rotate(25deg); }
    }

    h1{
      font-size: 18px;
      margin:0;
      letter-spacing:.2px;
    }
    .sub{
      font-size: 13px;
      color: var(--muted);
      margin-top: 3px;
      line-height: 1.4;
    }

    .steps{
      margin-top: 14px;
      display:grid;
      gap: 10px;
    }
    .step{
      display:flex;
      gap: 10px;
      align-items:flex-start;
      padding: 12px 12px;
      border-radius: 14px;
      border: 1px solid var(--stroke);
      background: #0b1020aa;
    }
    .dot{
      width: 10px;height:10px;
      border-radius:999px;
      margin-top: 4px;
      background: #ffffff22;
      box-shadow: 0 0 0 6px #ffffff07;
      flex:0 0 auto;
    }
    .step strong{
      display:block;
      font-size: 13px;
      margin-bottom: 3px;
    }
    .step span{
      font-size: 12px;
      color: var(--muted);
      line-height: 1.45;
    }

    .cta{
      margin-top: 16px;
      display:grid;
      gap: 10px;
    }
    .btn{
      width:100%;
      border: none;
      border-radius: 14px;
      padding: 12px 14px;
      cursor:pointer;
      color: white;
      font-weight: 700;
      letter-spacing:.2px;
      background: linear-gradient(135deg, var(--brand), var(--brand2));
      box-shadow: 0 14px 34px #5865f235;
      transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
      position:relative;
      overflow:hidden;
    }
    .btn:hover{ transform: translateY(-1px); filter: brightness(1.03); }
    .btn:active{ transform: translateY(0); filter: brightness(.98); box-shadow: 0 10px 26px #5865f225; }
    .btn[disabled]{ cursor:not-allowed; opacity:.7; filter: grayscale(.2); }

    .btn .spark{
      position:absolute; inset:-40px;
      background: radial-gradient(circle at 30% 20%, #ffffff25, transparent 45%),
                  radial-gradient(circle at 70% 80%, #ffffff20, transparent 50%);
      animation: spark 3.2s ease-in-out infinite;
      pointer-events:none;
    }
    @keyframes spark{
      0%,100%{ transform: translate(0,0); opacity:.8; }
      50%{ transform: translate(10px,-8px); opacity:1; }
    }

    .hint{
      font-size: 12px;
      color: #ffb4b4;
      text-align:center;
      margin-top: 6px;
    }

    .footer{
      margin-top: 12px;
      font-size: 11px;
      color: #aab0ff90;
      text-align:center;
    }

    /* Loading state */
    .loading{
      display:none;
      gap:8px;
      align-items:center;
      justify-content:center;
      font-size: 13px;
      color: var(--muted);
      padding: 10px 0 0;
    }
    .spinner{
      width:14px;height:14px;
      border-radius:999px;
      border: 2px solid #ffffff1f;
      border-top-color: #ffffffaa;
      animation: spin .7s linear infinite;
    }
    @keyframes spin{ to{ transform: rotate(360deg);} }

    .ok{
      display:none;
      margin-top: 10px;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid #22c55e40;
      background: #22c55e12;
      color: #d8ffe6;
      text-align:center;
      font-size: 13px;
      animation: pop .35s ease-out both;
    }
  </style>
</head>
<body>
  <div class="blob b1"></div>
  <div class="blob b2"></div>
  <div class="blob b3"></div>
  <div class="noise"></div>

  <div class="wrap">
    <div class="card">
      <div class="top">
        <div class="logo"></div>
        <div>
          <h1>Server Verification</h1>
          <div class="sub">Complete the final step to unlock access.</div>
        </div>
      </div>

      <div class="steps">
        <div class="step">
          <div class="dot"></div>
          <div>
            <strong>VPN / VPS must be OFF</strong>
            <span>If a VPN is detected, verification will be blocked.</span>
          </div>
        </div>
        <div class="step">
          <div class="dot"></div>
          <div>
            <strong>Continue to verification</strong>
            <span>You’ll be asked to confirm via Discord (OAuth) in the next step.</span>
          </div>
        </div>
      </div>

      <div class="cta">
        <button id="btn" class="btn">
          <span class="spark"></span>
          Click to Continue
        </button>
        <div class="hint">Tip: If you get blocked, disable VPN and try again.</div>
        <div id="loading" class="loading"><div class="spinner"></div>Opening verification…</div>
        <div id="ok" class="ok">✅ Request submitted. You can return to Discord.</div>
      </div>

      <div class="footer">FluxPay Verification • Secure Access</div>
    </div>
  </div>

  <script>
    // Right now this is just UI. Next step we’ll redirect to Discord OAuth + VPN check.
    const btn = document.getElementById("btn");
    const loading = document.getElementById("loading");
    const ok = document.getElementById("ok");

    btn.addEventListener("click", () => {
      btn.disabled = true;
      loading.style.display = "flex";

      // Simulate the next step (we'll replace this with real OAuth redirect)
      setTimeout(() => {
        loading.style.display = "none";
        ok.style.display = "block";
      }, 900);
    });
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log("🌐 Verify site running on port", PORT);
});
