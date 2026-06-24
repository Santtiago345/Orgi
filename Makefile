.PHONY: test-backend test-frontend test-all test-coverage

test-backend:
	cd orgi-backend && pip install -r requirements.txt && pip install pytest pytest-cov && pytest tests/ -v --cov=app --cov-report=term

test-frontend:
	cd orgi-frontend && npx vitest run --reporter=verbose

test-all: test-backend test-frontend

test-coverage:
	cd orgi-backend && pytest tests/ -v --cov=app --cov-report=html
