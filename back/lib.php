<?php
require_once 'connectDB.php';


switch ($_POST['request']) {
    case 'checkConnectDB':
        echo json_encode(checkConnectDB($pdo));
        break;
    case 'addNewComment':
        echo json_encode(addNewComment($pdo, $_POST['name'], $_POST['email'], $_POST['text']));
        break;
    case 'loadCommentList':
        echo json_encode(loadCommentList($pdo));
        break;
}


function checkConnectDB($pdo) {
    return $pdo;
}

function loadCommentList($pdo) {
    $output = [];

    try {
        $stmt = $pdo->prepare("SELECT * FROM comment");
        $stmt->execute();

        $output['result'] = true;
        $output['comments'] = $stmt->fetchAll();       
    } catch (Exception $e) {
        $output['result'] = false;
        $output['error'] = $e->getMessage();
    }
    
    return $output;
}

function addNewComment($pdo, $name, $email, $text) {
    $output = [];
    
    try {
        $stmt = $pdo->prepare("INSERT INTO comment 
            SET name = ?, email = ?, text = ?
        ");

        $stmt->execute(
            array(
                htmlspecialchars($name), 
                htmlspecialchars($email), 
                htmlspecialchars($text)
            )
        );
    } catch (Exception $e) {
        $output['result'] = false;
        $output['error'] = $e->getMessage();

        return $output;
    }

    return $output['result'] = true;
}