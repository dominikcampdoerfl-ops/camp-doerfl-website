export const contactTopics = Object.freeze([
  Object.freeze({
    key: "premium-training",
    label: "Premium Personal Training",
    aliases: Object.freeze(["premium-personal-training", "personal-training", "personal-coaching"])
  }),
  Object.freeze({
    key: "executive-performance",
    label: "Executive Performance",
    aliases: Object.freeze(["executive", "executive-coaching", "performance-coaching"])
  }),
  Object.freeze({
    key: "firmenfitness",
    label: "Firmenfitness",
    aliases: Object.freeze(["corporate-fitness", "gesundheitstag", "gesundheitstage", "bgm"])
  }),
  Object.freeze({
    key: "events",
    label: "Events und Moderation",
    aliases: Object.freeze(["event", "moderation", "eventmoderation", "events-und-moderation"])
  }),
  Object.freeze({
    key: "app",
    label: "Camp Dörfl App",
    aliases: Object.freeze(["camp-doerfl-app", "camp-dorfl-app", "fitness-app"])
  }),
  Object.freeze({
    key: "kooperation",
    label: "Kooperation und Sponsoring",
    aliases: Object.freeze(["partner", "partnerschaft", "sponsoring"])
  }),
  Object.freeze({
    key: "allgemein",
    label: "Allgemeine Anfrage",
    aliases: Object.freeze(["allgemeine-anfrage", "erfolge-im-team"])
  })
]);

export const normalizeContactTopicKey = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const contactTopicLookup = new Map();

for (const topic of contactTopics) {
  for (const candidate of [topic.key, topic.label, ...topic.aliases]) {
    contactTopicLookup.set(normalizeContactTopicKey(candidate), topic);
  }
}

export function resolveContactTopic(value = "") {
  return contactTopicLookup.get(normalizeContactTopicKey(value)) ?? null;
}

export function resolveContactTopicKey(value = "") {
  return resolveContactTopic(value)?.key ?? "";
}

export function resolveContactTopicValue(value = "") {
  return resolveContactTopic(value)?.label ?? "";
}
