<%--<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@include file="header/headerCookies_2.jsp" %>

<html>

    <head>
        <meta http-equiv="Content-Type" content="text/html; hcarset=iso-8859-1">
        <title>IdeiaWare - Storytelling</title>
        <link type="text/css" rel="stylesheet" href="css/storytelling.css">
    </head>
    </head>
  <body class="indigo lighten-5"> 
    <div id="overlay">
      <div class="loader"></div>
    </div>
    <div>
        <div class="row" style="min-height: 80vh; padding-top: 20px; width: 95%">                 
            <div class="col s3 grey lighten-2 z-depth-2" style="min-height: 85vh; padding-top: 20px;">
            <h5 class="center grey-text text-darken-3" style="padding-top: 10px; padding-bottom: 5px">Ferramentas</h5>
            <div class="story-tools">
            <button class="btn indigo accent-2" style="display: " id="deletarAlgo">Borracha (OFF)</button>
          </div>
          <ul class="collapsible" data-collapsible="accordion">
            <li class="white">
              <div id="b1" class="collapsible-header"><i class="material-icons">image</i>Adicionar Imagem</div>
               <!--revisar linhas
              <div class="collapsible-body">  
                <form id="enviarImagem" method="POST" onsubmit="salvarProgresso()" action="UploadArquivoServlet" enctype="multipart/form-data">
                  </br><input type="file" id="arquivo" name="UploadImg" value="Carregar Imagem" /></br>
                  </br><input class="btn indigo accent-2" id="b1_1" type="submit" value="inserir arquivo" />
                </form>
                <output id="nomeArquivo"></output>
              </div>-->
               </li>
            <li class="white">
              <div class="collapsible-header"><i class="material-icons">format_paint</i>Adicionar Forma</div>
              <div class="collapsible-body">	

                <label>Cor</label>
                <select class="browser-default" id="corForma">
                  <option value="Color">Amarelo</option>
                </select>

</html>