from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

LOW_STOCK_THRESHOLD = 10


@router.get("/summary", response_model=DashboardSummary)
def get_summary(threshold: int = LOW_STOCK_THRESHOLD, db: Session = Depends(get_db)):
    low_stock = db.query(Product).filter(Product.quantity < threshold).all()
    return DashboardSummary(
        total_products=db.query(Product).count(),
        total_customers=db.query(Customer).count(),
        total_orders=db.query(Order).count(),
        low_stock_count=len(low_stock),
        low_stock_products=low_stock,
    )