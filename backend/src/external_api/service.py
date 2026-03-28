import os
import httpx
import asyncio
from .schemas import Quote

FORISMATIC_URL = os.getenv("FORISMATIC_URL")
TIMEOUT = int(os.getenv("FORISMATIC_TIMEOUT"))
RETRIES = int(os.getenv("FORISMATIC_RETRIES"))
RETRY_DELAY = float(os.getenv("FORISMATIC_RETRY_DELAY"))

async def fetch_quote() -> Quote:
    for attempt in range(1, RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                response = await client.get(FORISMATIC_URL)
                response.raise_for_status()
                data = response.json()

                return Quote(
                    text=data.get("quoteText", "").strip(),
                    author=data.get("quoteAuthor") or None
                )
        except (httpx.HTTPError, httpx.TimeoutException) as e:
            if attempt == RETRIES:
                raise e
            await asyncio.sleep(RETRY_DELAY)
