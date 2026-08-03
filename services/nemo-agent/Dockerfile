FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

RUN pip install --no-cache-dir uv
COPY pyproject.toml ./
RUN uv pip install --system .

COPY configs ./configs

EXPOSE 8000

CMD ["sh", "-c", "nat serve --config_file=configs/brf_agent.yml --host 0.0.0.0 --port ${PORT}"]
