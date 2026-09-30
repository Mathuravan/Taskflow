from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def count_tasks(db: Session, *conditions: object) -> int:
    return int(db.scalar(select(func.count(Task.id)).where(*conditions)) or 0)


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> DashboardStats:
    owner_filter = Task.user_id == current_user.id
    return DashboardStats(
        total_tasks=count_tasks(db, owner_filter),
        pending_tasks=count_tasks(db, owner_filter, Task.status == TaskStatus.PENDING),
        in_progress_tasks=count_tasks(db, owner_filter, Task.status == TaskStatus.IN_PROGRESS),
        completed_tasks=count_tasks(db, owner_filter, Task.status == TaskStatus.COMPLETED),
        overdue_tasks=count_tasks(
            db,
            owner_filter,
            Task.due_date.is_not(None),
            Task.due_date < date.today(),
            Task.status != TaskStatus.COMPLETED,
        ),
    )
