<?php
$docXml = new DOMDocument();
$docXml->load('resources/xml/books.xml');
transformXml($docXml->saveXML(), 'string', 'books.xsl');

function transformXml($sXmlSource, $sXmlType, $sXslSource) {
  $docXml = new DOMDocument;
  $docXsl = new DOMDocument;

  if ($sXmlType == 'file') {
    $docXml->load('resources/xml/' . $sXmlSource . '.xml');
  } else {
    $docXml->loadXML($sXmlSource);
  }

  $docXsl->load('resources/xsl/' . $sXslSource);

  $sDocView = '';
  if (isset($_GET['output'])) {
    $sDocView = $_GET['output'];
  }

  switch (strtolower($sDocView)) {
    case 'xml':
      header('Content-type: text/xml');
      echo $docXml->saveXML();
      break;
    case 'xsl':
      header('Content-type: text/xml');
      echo $docXsl->saveXML();
      break;
    default:
      $proc = new XSLTProcessor;
      $proc->importStyleSheet($docXsl);
      echo $proc->transformToXML($docXml);
  }
}
?>

