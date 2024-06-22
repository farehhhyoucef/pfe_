 <?php

$sql =  "SELECT client.id_client, nom, prenom, type_c, reference, n_affire, categorie, adresse, id_demore_c
FROM demore_compteur
INNER JOIN client ON client.id_client = demore_compteur.id_client
WHERE etat_demore = 'pert' and (
  or (nom LIKE :search OR prenom LIKE :search)
  or (:searchTypeC IS NULL OR type_c LIKE :search)
  or (:search IS NULL OR reference LIKE :search)
  or (:search IS NULL OR categorie LIKE :searchCategorie)
  or (:search IS NULL OR adresse LIKE :search))";
// $sql1="SELECT n_serie from compteur where id_client is null ";
// $result = $conn->query($sql);
// $result1 = $conn->query($sql1);

// $sql = "SELECT n_serie,type,date_entree,categorie,reonnage FROM compteur ORDER BY n_serie asc ";

// $sql = "SELECT date_entree,n_serie,fullname,reference,n_affire,adresse,nom_entreprise FROM compteur inner join(select client.id_client,CONCAT(nom, ' ', prenom) As fullname,reference,n_affire,adresse,n_telephone from client inner join demore_compteur on client.id_client=demore_compteur.id_client ) ss on ss.id_client=compteur.id_client     ";

$result = $conn->query($sql);
// $result = $conn->query($sql);
if ($result->num_rows > 0) {while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
// Embed JSON data into HTML
$json_data = json_encode($rows);

// Write JSON data to a file
echo $json_data;
}
?> -->