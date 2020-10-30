<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:output method="xml" indent="yes" omit-xml-declaration="yes" version="1.0"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
		media-type="text/html"
		encoding="UTF-8" />
	<xsl:template match="/">
		<html xml:lang="en" lang="en">
			<head>
				<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
				<meta name="robots" content="index,follow" />
				<meta name="author" content="Mohadjer &amp; Mohadjer" />
			</head>
			<body>
				<h2>Example of PHP parsing XML with XSLT</h2>
				<p class="bold">List of Books</p>
				<ul><xsl:apply-templates select="books/book" /></ul>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template match="book">
		<li><xsl:apply-templates select="title" /></li>
	</xsl:template>	
</xsl:stylesheet>

