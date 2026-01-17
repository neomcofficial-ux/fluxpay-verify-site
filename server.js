const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/verify", (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.send("Invalid verification link.");
  }

  res.send(`
    <html>
      <body style="background:#111;color:white;font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh">
        <div style="background:#1c1c1c;padding:30px;border-radius:10px;text-align:center">
          <h2>Verification</h2>
          <p>Click below to continue</p>
          <button onclick="done()" style="padding:10px 20px;background:#5865f2;color:white;border:none;border-radius:5px">Continue</button>
        </div>

        <script>
          function done() {
            document.body.innerHTML = '<h2>Verification submitted. Return to Discord.</h2>';
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log("Website running on port", PORT);
});

