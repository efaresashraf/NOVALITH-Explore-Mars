# NOVALITH Explore Mars Backend

Minimal modular FastAPI backend for NOVALITH Explore Mars.

## Setup

From the `backend/` directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

The health endpoint is available at `GET /api/health`.

## Test

```bash
pytest
```
