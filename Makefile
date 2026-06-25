.PHONY: test-backend test-frontend test-all test-coverage install-backend install-frontend run-backend run-frontend lint-backend lint-frontend

test-backend:
	cd orgi-backend && python -m pytest tests/ -v --cov=app --cov-report=term

test-frontend:
	cd orgi-frontend && npx vitest run --config tests/vitest.config.ts

test-all: test-backend test-frontend

test-coverage:
	cd orgi-backend && python -m pytest tests/ --cov=app --cov-report=html --cov-report=term
	@echo "Cobertura HTML generada en orgi-backend/htmlcov/index.html"

install-backend:
	cd orgi-backend && pip install -r requirements.txt

install-frontend:
	cd orgi-frontend && npm install

run-backend:
	cd orgi-backend && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

run-frontend:
	cd orgi-frontend && npm run dev

lint-backend:
	cd orgi-backend && ruff check app/ tests/

lint-frontend:
	cd orgi-frontend && npx tsc --noEmit
