<?php
    header('Content-type: application/json');
    $data = '{
         "results": [
             {"id": 0, "rank": 1, "name": "blabla", "score": 1900, "time": 41},
             {"id": 1, "rank": 1, "name": "blabla2", "score": 2600, "time": 33},
             {"id": 2, "rank": 1, "name": "blabla3", "score": 2550, "time": 41},
             {"id": 3, "rank": 1, "name": "blabla4", "score": 2550, "time": 41},
             {"id": 4, "rank": 1, "name": "blabla5", "score": 1900, "time": 34},
             {"id": 5, "rank": 1, "name": "blabla6", "score": 1900, "time": 88},
             {"id": 6, "rank": 1, "name": "blabla7", "score": 5555, "time": 41},
             {"id": 7, "rank": 2, "name": "blbala8", "score": 3900, "time": 41}
         ],
        "current_id": 7
    }';
    $data = json_decode($data);
    if(isset($_POST['time'])){
        $data->current_id += 1;
        array_push($data->results, [
            "id" => $data->current_id,
            "rank" => "呂瑞風你在衝三小!!不是說API不會排名?",
            "name" => $_POST['name'],
            "score" => $_POST['score'],
            "time" => $_POST['time']
        ]);
    }

    echo json_encode($data, JSON_PRETTY_PRINT);
