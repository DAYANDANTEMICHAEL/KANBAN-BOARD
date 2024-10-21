<?php
// Router.php
session_start();
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once  __DIR__ . '/config/database.php';
require_once  __DIR__ . '/services/TaskService.php';
require_once  __DIR__ . '/services/UserService.php';

$db = (new Connection())->connect();

$method = $_SERVER['REQUEST_METHOD'];
$url = $_GET['request'] ?? '';
$request = explode('/', trim($url, '/'));

$taskService = isset($_SESSION['user_id']) ? new TaskService($db, $_SESSION['user_id'], $_SESSION['token']) : null;
$userService = new UserService($db);

function requireAuthentication()
{
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['token'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    // Validate token
    global $userService;
    $tokenValidation = json_decode($userService->validateToken($_SESSION['token']), true);
    if (!$tokenValidation['valid']) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token."]);
        exit();
    }
}


switch ($method) {
    case 'GET':
        switch ($request[0]) {
            case 'tasks':
                requireAuthentication();
                echo $taskService->readTasks();
                break;
            case 'tasks-status':
                requireAuthentication();
                $taskId = $_GET['taskId'] ?? null;
                echo $taskService->getTaskStatus($taskId);
                break;
            case 'tasks-read':
                requireAuthentication();
                $taskId = $_GET['taskId'] ?? null;
                if (!empty($taskId)) {
                    echo $taskService->readOneTask($taskId);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Task ID is required"]);
                }
                break;
            case 'check_login_status':
                echo $userService->checkLoginStatus();
                break;
            default:
                http_response_code(404);
                echo json_encode(["error" => "Endpoint not found"]);
        }
        break;

    case 'POST':
        switch ($request[0]) {
            case 'tasks-create':
                requireAuthentication();
                $data = json_decode(file_get_contents("php://input"));
                echo $taskService->createTask($data);
                break;
            case 'tasks-delete':
                requireAuthentication();
                $data = json_decode(file_get_contents("php://input"));
                echo $taskService->deleteTask($data);
                break;
            case 'tasks-update':
                requireAuthentication();
                $data = json_decode(file_get_contents("php://input"));
                echo $taskService->updateTask($data);
                break;
            case 'login':
                $data = json_decode(file_get_contents("php://input"), true);
                echo $userService->loginUser($data);
                break;
            case 'logout':
                echo $userService->logoutUser();
                break;
            case 'register':
                $data = json_decode(file_get_contents("php://input"), true);
                echo $userService->registerUser($data);
                break;
            case 'set_session':
                $data = json_decode(file_get_contents("php://input"), true);
                echo $userService->setSession($data);
                break;
            default:
                http_response_code(404);
                echo json_encode(["error" => "Endpoint not found"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}
