from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.portfolio import (
    Position,
    PositionCreate,
    PortfolioSummary,
    Goal,
    GoalCreate,
    Transaction,
    TransactionCreate
)

router = APIRouter()

# Mock data storage (in production, use a database)
mock_positions: List[Position] = []
mock_goals: List[Goal] = []
mock_transactions: List[Transaction] = []


@router.get(
    "/positions",
    response_model=List[Position],
    summary="Get Portfolio Positions",
    description="Retrieve all positions in the user's investment portfolio."
)
async def get_positions():
    """
    Get all portfolio positions.
    
    Returns a list of all investment positions including stocks, ETFs,
    bonds, and cryptocurrencies with current values and performance metrics.
    """
    return mock_positions


@router.post(
    "/positions",
    response_model=Position,
    summary="Add Portfolio Position",
    description="Add a new investment position to the portfolio.",
    status_code=status.HTTP_201_CREATED
)
async def create_position(position: PositionCreate):
    """
    Create a new portfolio position.
    
    Args:
        position: Position details including symbol, quantity, and prices
        
    Returns:
        The created position with calculated values
    """
    # Calculate derived values
    total_value = position.quantity * position.current_price
    cost_basis = position.quantity * position.avg_price
    change = total_value - cost_basis
    change_percent = (change / cost_basis) * 100 if cost_basis > 0 else 0
    
    new_position = Position(
        id=f"pos_{len(mock_positions) + 1}",
        symbol=position.symbol,
        name=position.name,
        quantity=position.quantity,
        avg_price=position.avg_price,
        current_price=position.current_price,
        total_value=total_value,
        change=change,
        change_percent=change_percent,
        sector=position.sector,
        type=position.type
    )
    
    mock_positions.append(new_position)
    return new_position


@router.get(
    "/summary",
    response_model=PortfolioSummary,
    summary="Get Portfolio Summary",
    description="Get aggregated portfolio performance and value summary."
)
async def get_portfolio_summary():
    """
    Get portfolio summary with aggregated metrics.
    
    Returns total portfolio value, gains/losses, and daily changes.
    """
    if not mock_positions:
        return PortfolioSummary(
            total_value=0,
            total_gain=0,
            total_gain_percent=0,
            day_change=0,
            day_change_percent=0
        )
    
    total_value = sum(p.total_value for p in mock_positions)
    total_gain = sum(p.change for p in mock_positions)
    total_cost = sum(p.quantity * p.avg_price for p in mock_positions)
    total_gain_percent = (total_gain / total_cost * 100) if total_cost > 0 else 0
    
    # Mock day change (in production, calculate from actual daily data)
    day_change = total_value * 0.012  # Mock 1.2% daily change
    day_change_percent = 1.2
    
    return PortfolioSummary(
        total_value=total_value,
        total_gain=total_gain,
        total_gain_percent=total_gain_percent,
        day_change=day_change,
        day_change_percent=day_change_percent
    )


@router.get(
    "/goals",
    response_model=List[Goal],
    summary="Get Investment Goals",
    description="Retrieve all user investment goals."
)
async def get_goals():
    """Get all investment goals."""
    return mock_goals


@router.post(
    "/goals",
    response_model=Goal,
    summary="Create Investment Goal",
    description="Create a new investment goal.",
    status_code=status.HTTP_201_CREATED
)
async def create_goal(goal: GoalCreate):
    """
    Create a new investment goal.
    
    Args:
        goal: Goal details including name, target amount, and deadline
        
    Returns:
        The created goal
    """
    new_goal = Goal(
        id=f"goal_{len(mock_goals) + 1}",
        **goal.model_dump()
    )
    mock_goals.append(new_goal)
    return new_goal


@router.get(
    "/transactions",
    response_model=List[Transaction],
    summary="Get Transactions",
    description="Retrieve all portfolio transactions."
)
async def get_transactions():
    """Get all portfolio transactions."""
    return mock_transactions


@router.post(
    "/transactions",
    response_model=Transaction,
    summary="Record Transaction",
    description="Record a new portfolio transaction.",
    status_code=status.HTTP_201_CREATED
)
async def create_transaction(transaction: TransactionCreate):
    """
    Record a new transaction.
    
    Args:
        transaction: Transaction details
        
    Returns:
        The recorded transaction
    """
    from datetime import datetime
    
    new_transaction = Transaction(
        id=f"txn_{len(mock_transactions) + 1}",
        date=datetime.now().isoformat(),
        **transaction.model_dump()
    )
    mock_transactions.append(new_transaction)
    return new_transaction


@router.delete(
    "/positions/{position_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Position",
    description="Remove a position from the portfolio."
)
async def delete_position(position_id: str):
    """Delete a portfolio position."""
    global mock_positions
    mock_positions = [p for p in mock_positions if p.id != position_id]
    return None


@router.delete(
    "/goals/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Goal",
    description="Remove an investment goal."
)
async def delete_goal(goal_id: str):
    """Delete an investment goal."""
    global mock_goals
    mock_goals = [g for g in mock_goals if g.id != goal_id]
    return None
