export async function getButtons(env, parentId = 0) {
  const result = await env.DB
    .prepare(`
      SELECT id, title, mode, position
      FROM buttons
      WHERE parent_id = ?
        AND visible = 1
        AND deleted = 0
      ORDER BY position ASC, id ASC
    `)
    .bind(parentId)
    .all();

  return result.results || [];
}

export async function getButton(env, buttonId) {
  return env.DB
    .prepare(`
      SELECT
        id,
        title,
        mode,
        parent_id,
        content_order
      FROM buttons
      WHERE id = ?
        AND visible = 1
        AND deleted = 0
    `)
    .bind(buttonId)
    .first();
}

export async function getButtonFiles(env, buttonId, contentOrder) {
  let order = "ORDER BY id DESC";

  if (contentOrder === "old") {
    order = "ORDER BY id ASC";
  }

  if (contentOrder === "random") {
    order = "ORDER BY RANDOM()";
  }

  const result = await env.DB
    .prepare(`
      SELECT file_id, file_type, caption
      FROM files
      WHERE button_id = ?
        AND deleted = 0
      ${order}
    `)
    .bind(buttonId)
    .all();

  return result.results || [];
}