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

if ($_FILES["file"]["size"] < 20000000)
  {
  if ($_FILES["file"]["error"] > 0)
    {
    echo '{"result":1,"msg":"'.$_FILES["file"]["error"].'"}';
    }
  else
    {

    if (file_exists("uploads/" . $_FILES["file"]["name"]))
      {
      echo '{"result":2,"msg":"file name:'.$_FILES["file"]["name"].' exxists"}';
      }
    else
      {
        $tmp_name = create_uuid();
        $tmp_extention = ".png";
          if(($_FILES["file"]["type"] == "image/jpeg")|| ($_FILES["file"]["type"] == "image/pjpeg")){
              $tmp_extention = ".jpg";
          }else if($_FILES["file"]["type"] == "image/gif"){
              $tmp_extention = ".gif";
          }else if($_FILES["file"]["type"] == "image/svg"){
              $tmp_extention = ".svg";
          }else if($_FILES["file"]["type"] == "image/png"){
              $tmp_extention = ".png";
          }
      move_uploaded_file($_FILES["file"]["tmp_name"],"uploads/" . $tmp_name.$tmp_extention);
      echo '{"result":0,"msg":"file uploaded","fileName":"'.$tmp_name.$tmp_extention.'"}';
      }
    }
  }
else
  {
      echo '{"result":1,"msg":"Invalid file '.$_FILES["file"]["name"].'"}';
  }
?>
