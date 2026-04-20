const nodemailer = require("nodemailer");

const INCIDENTS_API_URL =
  process.env.INCIDENTS_API_URL ||
  "https://69dfcd3629c070e6597ae821.mockapi.io/incidents";

const NOT_REACTED_STATUSES = new Set(["Новый", "На рассмотрении"]);

function isIncidentOverdue(incident) {
  const status = (incident.status || "").trim();
  if (!NOT_REACTED_STATUSES.has(status)) return false;
  if (incident.alertedAt) return false;

  const reportedAt = Date.parse(incident.reportedAt || "");
  const reactionWindowMinutes = Number(incident.etaMinutes);

  if (!Number.isFinite(reportedAt) || !Number.isFinite(reactionWindowMinutes)) {
    return false;
  }

  const deadline = reportedAt + reactionWindowMinutes * 60 * 1000;
  return Date.now() > deadline;
}

async function fetchIncidents() {
  const response = await fetch(INCIDENTS_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to load incidents: ${response.status}`);
  }
  return response.json();
}

async function markAlerted(incidentId) {
  await fetch(`${INCIDENTS_API_URL}/${incidentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alertedAt: new Date().toISOString() }),
  });
}

function buildEmailBody(overdueIncidents) {
  return overdueIncidents
    .map(
      (incident) =>
        `ID: ${incident.id}\n` +
        `Название: ${incident.title}\n` +
        `Станция: ${incident.station}\n` +
        `Статус: ${incident.status}\n` +
        `Время регистрации: ${incident.reportedAt}\n` +
        `Допустимое время реакции (мин): ${incident.etaMinutes}\n` +
        `Ответственный: ${incident.assignedTo || "-"}\n` +
        `Описание: ${incident.description || "-"}`
    )
    .join("\n\n------------------------\n\n");
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

module.exports = async (req, res) => {
  try {
    if (process.env.CRON_SECRET) {
      const authHeader = req.headers.authorization || "";
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const incidents = await fetchIncidents();
    const overdueIncidents = incidents.filter(isIncidentOverdue);

    if (!overdueIncidents.length) {
      return res.status(200).json({ message: "No overdue incidents." });
    }

    const transporter = createTransporter();
    const to = process.env.ALERT_TO_EMAIL;
    const from = process.env.ALERT_FROM_EMAIL || process.env.SMTP_USER;

    if (!to || !from) {
      return res.status(500).json({
        error: "Email recipient/sender not configured.",
      });
    }

    await transporter.sendMail({
      from,
      to,
      subject: `Предупреждение: ${overdueIncidents.length} просроченных инцидентов`,
      text: buildEmailBody(overdueIncidents),
    });

    await Promise.all(overdueIncidents.map((item) => markAlerted(item.id)));

    return res.status(200).json({
      message: "Alert sent.",
      alertedIncidents: overdueIncidents.map((item) => item.id),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to process overdue incidents.",
      details: error.message,
    });
  }
};
