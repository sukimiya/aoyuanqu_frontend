<?php

function create_uuid($prefix = ""){    //可以指定前缀
    $str = md5(uniqid(mt_rand(), true));   
    $uuid  = substr($str,0,8) . '-';   
    $uuid .= substr($str,8,4) . '-';   
    $uuid .= substr($str,12,4) . '-';   
    $uuid .= substr($str,16,4) . '-';   
    $uuid .= substr($str,20,12);   
    return $prefix . $uuid;
}

$file_type = $_POST["fileType"];
$file_Data = $_POST["fileData"];
        $tmp_name = create_uuid();
        $tmp_extention = ".png";
          if(($file_type == "image/jpeg")|| ($file_type == "image/pjpeg")){
              $tmp_extention = ".jpg";
          }else if($file_type == "image/gif"){
              $tmp_extention = ".gif";
          }else if($file_type == "image/svg"){
              $tmp_extention = ".svg";
          }else if($file_type == "image/png"){
              $tmp_extention = ".png";
          }
$img = base64_decode($file_Data);
$a = file_put_contents("uploads/" . $tmp_name.$tmp_extention, $img);//返回的是字节数
      echo '{"result":0,"msg":"file uploaded","fileName":"'.$tmp_name.$tmp_extention.'"}';

?>
