import json
import re
from app.core.config import settings


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response that may have markdown code fences."""
    cleaned = re.sub(r"```(?:json)?\s*", "", text).replace("```", "").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError(f"Could not parse JSON from response: {text[:200]}")


def _call_claude(prompt: str, system: str) -> str:
    import anthropic
    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    message = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


def _call_openai(prompt: str, system: str) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=4096,
    )
    return response.choices[0].message.content


def _call_openrouter(prompt: str, system: str) -> str:
    from openai import OpenAI
    client = OpenAI(
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL,
    )
    response = client.chat.completions.create(
        model=settings.OPENROUTER_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        max_tokens=4096,
    )
    return response.choices[0].message.content


def call_ai(prompt: str, system: str = "You are a helpful assistant. Always respond with valid JSON.") -> dict:
    """Call configured AI provider and return parsed JSON response."""
    if settings.AI_PROVIDER == "claude":
        raw = _call_claude(prompt, system)
    elif settings.AI_PROVIDER == "openrouter":
        raw = _call_openrouter(prompt, system)
    else:
        raw = _call_openai(prompt, system)
    return _extract_json(raw)


def call_ai_text(prompt: str, system: str = "You are a helpful assistant.") -> str:
    """Call configured AI provider and return raw text response."""
    if settings.AI_PROVIDER == "claude":
        return _call_claude(prompt, system)
    elif settings.AI_PROVIDER == "openrouter":
        return _call_openrouter(prompt, system)
    else:
        return _call_openai(prompt, system)
