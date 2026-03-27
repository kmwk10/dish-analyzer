from fastapi import APIRouter
from fastapi.responses import Response, PlainTextResponse

router = APIRouter()


@router.get("/sitemap.xml", response_class=Response)
async def sitemap():
    xml_content = """<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>http://localhost:3000/dishes</loc>
        </url>
        <url>
            <loc>http://localhost:3000/products</loc>
        </url>
    </urlset>
    """
    return Response(content=xml_content, media_type="application/xml")


@router.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    return """
User-agent: *
Allow: /

Disallow: /auth
Disallow: /settings
Disallow: /dishes/editor
"""
