<?xml version="1.0" encoding="UTF-8"?>
<!-- ===================================================================== -->
<!-- The talk's reveal.js conversion: PreTeXt's own, plus one script tag   -->
<!-- that adds the table-of-contents dropdown (assets/toc-dropdown.js).    -->
<!-- project.ptx points the "talk" target here with xsl="...".             -->
<!-- ===================================================================== -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:import href="./core/pretext-revealjs.xsl"/>

  <!-- PreTeXt writes the LaTeX macros at the top of div.reveal; keep    -->
  <!-- that, then load the script. "defer" runs it once the page is      -->
  <!-- parsed, after reveal.js has started.                              -->
  <xsl:template match="slideshow" mode="latex-macros">
    <xsl:apply-imports/>
    <script src="external/toc-dropdown.js" defer="defer"></script>
  </xsl:template>

</xsl:stylesheet>
