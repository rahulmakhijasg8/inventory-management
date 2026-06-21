from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    customer = db.get(Customer, payload.customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    validated = []
    total = 0.0

    # pass 1: validate everything, change nothing
    for item in payload.items:
        product = db.get(Product, item.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product_id} not found",
            )
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.name}' "
                       f"(requested {item.quantity}, available {product.quantity})",
            )
        validated.append((product, item.quantity))
        total += product.price * item.quantity

    # pass 2: all valid — build the order, snapshot prices, reduce stock
    order = Order(customer_id=payload.customer_id, total_amount=total)
    for product, quantity in validated:
        order.items.append(OrderItem(
            product_id=product.id,
            quantity=quantity,
            unit_price=product.price,
        ))
        product.quantity -= quantity

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=list[OrderRead])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.get("/{order_id}", response_model=OrderRead)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    db.delete(order)
    db.commit()