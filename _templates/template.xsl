<?xml version="1.0" encoding="UTF-8"?>
  <xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxml="urn:schemas-microsoft-com:xslt"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="msxml">
<xsl:output method="xml" indent="yes" omit-xml-declaration="yes" version="1.0" encoding="UTF-8"
    doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    media-type="text/html" /> 
<xsl:template match="/">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
    <title>title</title>  
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body> 
  <xsl:apply-templates select="//item"/>
  </body>
</html>
</xsl:template>

<xsl:template match="//item">
</xsl:template>

</xsl:stylesheet>
