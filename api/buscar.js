// Servidor intermedio del Buscador de Autos (Vercel). Solo consulta Chileautos, MercadoLibre y Yapo.
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const destino = req.query.url;
  if (!destino) return res.status(200).send("Servidor del Buscador de Autos funcionando.");
  if (!/^https:\/\/([a-z0-9-]+\.)*(chileautos\.cl|mercadolibre\.cl|yapo\.cl)(\/|$)/i.test(destino))
    return res.status(403).send("Sitio no permitido");
  try {
    const r = await fetch(destino, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-CL,es;q=0.9"
      },
      redirect: "follow"
    });
    res.setHeader("Content-Type", r.headers.get("content-type") || "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=600");
    return res.status(r.status).send(await r.text());
  } catch (e) {
    return res.status(502).send("No se pudo consultar el sitio: " + e.message);
  }
}
