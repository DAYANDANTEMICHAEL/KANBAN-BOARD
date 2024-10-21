<?php
require_once __DIR__ . '/../config/database.php';

class TaskService
{
    private $conn;
    private $table_name = "tasks";
    private $userId;
    private $token;

    public function __construct($db, $userId, $token)
    {
        $this->conn = $db;
        $this->userId = $userId;
        $this->token = $token;
    }
    public function createTask($data)
    {

        // Verify the token before creating the task
        $userService = new UserService($this->conn);
        $tokenValidation = json_decode($userService->validateToken($this->token), true);
        if (!$tokenValidation['valid']) {
            http_response_code(401);
            return json_encode(["error" => "Invalid token."]);
        }

        $query = "INSERT INTO " . $this->table_name . " 
                  SET taskName=:taskName, description=:description, createdDate=:createdDate, dueDate=:dueDate, assignee=:assignee, status=:status, position=:position, user_id=:user_id";
        $stmt = $this->conn->prepare($query);

        $taskName = htmlspecialchars(strip_tags($data->taskName));
        $description = htmlspecialchars(strip_tags($data->description));
        $createdDate = htmlspecialchars(strip_tags($data->createdDate));
        $dueDate = htmlspecialchars(strip_tags($data->dueDate));
        $assignee = htmlspecialchars(strip_tags($data->assignee));
        $status = htmlspecialchars(strip_tags($data->status));
        $position = isset($data->position) ? htmlspecialchars(strip_tags($data->position)) : 0;

        $stmt->bindParam(":taskName", $taskName);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":createdDate", $createdDate);
        $stmt->bindParam(":dueDate", $dueDate);
        $stmt->bindParam(":assignee", $assignee);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":position", $position);
        $stmt->bindParam(":user_id", $this->userId);



        if ($stmt->execute()) {
            http_response_code(201);
            return json_encode(["message" => "Task was created."]);
        } else {
            http_response_code(503);
            return json_encode(["message" => "Unable to create task."]);
        }
    }

    public function deleteTask($data)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        $id = htmlspecialchars(strip_tags($data->id));

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $this->userId);

        if ($stmt->execute()) {
            http_response_code(200);
            return json_encode(["message" => "Task was deleted."]);
        } else {
            http_response_code(503);
            return json_encode(["message" => "Unable to delete task."]);
        }
    }

    public function getTaskStatus($taskId)
    {
        $query = "SELECT status FROM " . $this->table_name . " WHERE id = :task_id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":task_id", $taskId);
        $stmt->bindParam(":user_id", $this->userId);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return json_encode(["status" => $row['status']]);
        } else {
            return json_encode(["status" => null]);
        }
    }

    public function readTasks()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE user_id = :user_id ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->userId);
        $stmt->execute();

        $tasks_arr = ["records" => []];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $tasks_arr["records"][] = $row;
        }

        return json_encode($tasks_arr);
    }

    public function updateTask($data)
    {
        $query = "UPDATE " . $this->table_name . " 
              SET taskName = :taskName, description = :description, createdDate = :createdDate, dueDate = :dueDate, assignee = :assignee, status = :status, position = :position 
              WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        $taskName = htmlspecialchars(strip_tags($data->taskName));
        $description = htmlspecialchars(strip_tags($data->description));
        $createdDate = htmlspecialchars(strip_tags($data->createdDate));
        $dueDate = htmlspecialchars(strip_tags($data->dueDate));
        $assignee = htmlspecialchars(strip_tags($data->assignee));
        $status = htmlspecialchars(strip_tags($data->status));
        $position = htmlspecialchars(strip_tags($data->position));
        $id = htmlspecialchars(strip_tags($data->id));

        $stmt->bindParam(':taskName', $taskName);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':createdDate', $createdDate);
        $stmt->bindParam(':dueDate', $dueDate);
        $stmt->bindParam(':assignee', $assignee);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':position', $position);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':user_id', $this->userId);

        if ($stmt->execute()) {
            return json_encode(["message" => "Task was updated."]);
        } else {
            http_response_code(503);
            return json_encode(["message" => "Unable to update task."]);
        }
    }

    public function readOneTask($id)
    {
        $query = "SELECT id, taskName, description, createdDate, dueDate, assignee, status, position 
              FROM " . $this->table_name . " 
              WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":user_id", $this->userId);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $task = $stmt->fetch(PDO::FETCH_ASSOC);
            return json_encode($task);
        } else {
            http_response_code(404);
            return json_encode(["message" => "Task not found."]);
        }
    }
}
