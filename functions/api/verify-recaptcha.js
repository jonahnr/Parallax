export async function onRequestPost(context) {
  const secret = context.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return json({ success: false, error: "reCAPTCHA is not configured." }, 503);
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch {
    return json({ success: false, error: "Invalid request body." }, 400);
  }

  const token = String(payload?.token || "").trim();
  const expectedAction = String(payload?.action || "").trim();
  if (!token) {
    return json({ success: false, error: "Missing reCAPTCHA token." }, 400);
  }

  const form = new URLSearchParams({ secret, response: token });
  const connectingIp = context.request.headers.get("CF-Connecting-IP");
  if (connectingIp) form.set("remoteip", connectingIp);

  const googleResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form
  });
  const result = await googleResponse.json();

  const score = Number(result.score || 0);
  const actionMatches = !expectedAction || result.action === expectedAction;
  const verified = Boolean(result.success) && actionMatches && score >= 0.5;

  return json({
    success: verified,
    score,
    action: result.action || "",
    errors: result["error-codes"] || []
  }, verified ? 200 : 422);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
}
