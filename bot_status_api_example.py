"""
Exemple simple à intégrer à ton bot discord.py.
Il expose l'état du bot pour le site.

Installation :
    py -m pip install aiohttp

Important :
- Il faut héberger cette route sur une machine accessible publiquement.
- GitHub Pages ne peut pas appeler localhost.
"""

import time
from aiohttp import web

BOT_STARTED_AT = time.time()
BOT_VERSION = "1.0.0"
CURRENT_STATUS = "connected"  # connected / disconnected / maintenance / updating

async def status_handler(request: web.Request) -> web.Response:
    bot = request.app["bot"]
    latency_ms = round(bot.latency * 1000) if bot.is_ready() else None

    payload = {
        "status": CURRENT_STATUS if bot.is_ready() else "disconnected",
        "message": "Le bot fonctionne normalement." if bot.is_ready()
                   else "Le bot est actuellement indisponible.",
        "latency": latency_ms,
        "uptime": int(time.time() - BOT_STARTED_AT),
        "version": BOT_VERSION,
    }

    return web.json_response(
        payload,
        headers={"Access-Control-Allow-Origin": "*"}
    )

async def start_status_api(bot, host="0.0.0.0", port=8080):
    app = web.Application()
    app["bot"] = bot
    app.router.add_get("/status", status_handler)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host, port)
    await site.start()
