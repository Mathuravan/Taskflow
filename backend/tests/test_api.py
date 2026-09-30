from datetime import date, timedelta

from fastapi.testclient import TestClient


def register_and_login(client: TestClient, email: str) -> dict[str, str]:
    register_response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "a-secure-password"},
    )
    assert register_response.status_code == 201
    assert "password" not in register_response.json()

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "a-secure-password"},
    )
    assert login_response.status_code == 200
    return {"Authorization": f"Bearer {login_response.json()['access_token']}"}


def test_auth_and_task_lifecycle_is_private(client: TestClient) -> None:
    first_user_headers = register_and_login(client, "first@example.com")
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    create_response = client.post(
        "/api/v1/tasks",
        headers=first_user_headers,
        json={
            "title": " Prepare API demo ",
            "description": "Show the dashboard",
            "priority": "high",
            "due_date": yesterday,
        },
    )
    assert create_response.status_code == 201
    task = create_response.json()
    assert task["title"] == "Prepare API demo"
    assert task["status"] == "pending"

    stats_response = client.get("/api/v1/dashboard/stats", headers=first_user_headers)
    assert stats_response.json() == {
        "total_tasks": 1,
        "pending_tasks": 1,
        "in_progress_tasks": 0,
        "completed_tasks": 0,
        "overdue_tasks": 1,
    }

    second_user_headers = register_and_login(client, "second@example.com")
    private_task_response = client.get(
        f"/api/v1/tasks/{task['id']}",
        headers=second_user_headers,
    )
    assert private_task_response.status_code == 404

    update_response = client.patch(
        f"/api/v1/tasks/{task['id']}",
        headers=first_user_headers,
        json={"status": "completed"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "completed"

    delete_response = client.delete(
        f"/api/v1/tasks/{task['id']}",
        headers=first_user_headers,
    )
    assert delete_response.status_code == 204
    assert client.get("/api/v1/tasks", headers=first_user_headers).json() == []
