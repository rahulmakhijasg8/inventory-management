from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import product, customer, order
from app.routers import products, customers, orders, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management System")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)

@app.get("/")
def health_check():
    return {"status": "ok"}