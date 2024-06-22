<?php
session_start();
if(!isset($_SESSION['role'])){
  if($_SESSION['role']=='agent'){
$servername="localhost";
$dbname="pfe";
$username="root";
$password="";
// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

  
  $sql1=" SELECT c.* ,cl.*
  FROM compteur c 
  INNER JOIN client cl ON c.id_client = cl.id_client 
  LEFT JOIN remise r ON cl.id_client = r.id_client 
  WHERE r.id_client IS NULL;
  ";


  
  // $sql1="SELECT "
  $result = $conn->query($sql1);
  if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      $rows[]=$row;
      
    }
    // **Ensure only the JSON data is echoed**
  
  // Set Content-Type header for JSON
  header('Content-Type: application/json');
  
    echo json_encode($rows);

   
    
  } else {
  
  // Set Content-Type header for JSON
  header('Content-Type: application/json');
  
    // **Return an empty JSON array if no data found**
    echo json_encode(array());
  }
 
 
  


if (isset($_POST['idClient'])  )  {

  $id_client = mysqli_real_escape_string($conn, $_POST['idClient']);  // Escape for security

  $entreprise = mysqli_real_escape_string($conn, $_POST['entrprise']);
 
  $type = mysqli_real_escape_string($conn, $_POST['type']);
  $date = mysqli_real_escape_string($conn, $_POST['date']);
  $id_agent=$_SESSION['user_id'];

  // Build the query with escaped values
  $sql2="INSERT INTO `remise` (`id_client`, `nom_entreprise`,  `type`,`id_agent`,`date_coupure`) VALUES('$id_client','$entreprise','$type',' $id_agent','$date')";

  // Execute the query (handle potential errors)
  if ($conn->query($sql2) === TRUE) {
      echo "Remise inserted successfully!";
      header('location: addremise.html');
     
  } else {
      echo "Error inserting remise: " . $conn->error;
  }
}
  //sql statment
  

$conn->close();
  }}
?>