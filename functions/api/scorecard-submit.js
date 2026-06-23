const DEFAULT_TO_EMAIL = "jonahnr@gmail.com";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function parseSubmission(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

async function sendEmail({ env, submission }) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "missing_resend_api_key" };
  }

  const to = env.SCORECARD_TO_EMAIL || DEFAULT_TO_EMAIL;
  const from = env.SCORECARD_FROM_EMAIL || "Parallax Data Lab <scorecard@parallaxdatalab.com>";
  const subject = "Dashboard Trust Scorecard Request";
  const html = `
    <h2>New Dashboard Trust Scorecard Request</h2>
    <table cellpadding="8" cellspacing="0" border="0">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(submission.name)}</td></tr>
      <tr><td><strong>Work Email</strong></td><td>${escapeHtml(submission.email)}</td></tr>
      <tr><td><strong>Weakest Dimension</strong></td><td>${escapeHtml(submission.weakest_dimension)}</td></tr>
      <tr><td><strong>Live Score Lowest Dimension</strong></td><td>${escapeHtml(submission.scorecard_lowest_dimension)}</td></tr>
      <tr><td><strong>Live Score Average</strong></td><td>${escapeHtml(submission.scorecard_average_score)}</td></tr>
      <tr><td><strong>Live Score Details</strong></td><td>${escapeHtml(submission.scorecard_scores)}</td></tr>
      <tr><td><strong>Additional Context</strong></td><td>${escapeHtml(submission.additional_context)}</td></tr>
      <tr><td><strong>Source</strong></td><td>${escapeHtml(submission.source)}</td></tr>
      <tr><td><strong>Submitted At</strong></td><td>${escapeHtml(submission.submitted_at)}</td></tr>
    </table>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      reply_to: submission.email || undefined
    })
  });

  if (!response.ok) {
    return {
      sent: false,
      reason: "resend_error",
      status: response.status,
      detail: await response.text()
    };
  }

  return { sent: true };
}

async function archiveSubmission({ env, submission }) {
  if (!env.SCORECARD_SUBMISSIONS) {
    return { archived: false, reason: "missing_kv_binding" };
  }

  const key = `scorecard:${submission.submitted_at}:${crypto.randomUUID()}`;
  await env.SCORECARD_SUBMISSIONS.put(key, JSON.stringify(submission));
  return { archived: true, key };
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await parseSubmission(request);
    if (data._honey) {
      return jsonResponse({ ok: true, skipped: true });
    }

    const submission = {
      submitted_at: new Date().toISOString(),
      name: data.Name || data.name || "",
      email: data["Work Email"] || data.email || "",
      weakest_dimension: data["Weakest Scorecard Dimension"] || data.weakest_dimension || "",
      scorecard_lowest_dimension: data["Scorecard Lowest Dimension"] || data.scorecard_lowest_dimension || "",
      scorecard_average_score: data["Scorecard Average Score"] || data.scorecard_average_score || "",
      scorecard_scores: data["Scorecard Scores"] || data.scorecard_scores || "",
      additional_context: data["Additional Context"] || data.additional_context || "",
      source: data["Submitted From"] || data.source || request.headers.get("referer") || "Dashboard Trust Scorecard"
    };

    if (!submission.weakest_dimension && submission.scorecard_lowest_dimension) {
      submission.weakest_dimension = submission.scorecard_lowest_dimension;
    }

    if (!submission.name || !submission.email || !submission.weakest_dimension) {
      return jsonResponse({ ok: false, error: "missing_required_fields" }, 400);
    }

    const [email, archive] = await Promise.all([
      sendEmail({ env, submission }),
      archiveSubmission({ env, submission })
    ]);

    return jsonResponse({
      ok: true,
      email,
      archive,
      redirect: "/dashboard-trust-scorecard-download/"
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: "scorecard_submission_failed",
      detail: error?.message || String(error)
    }, 500);
  }
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}
