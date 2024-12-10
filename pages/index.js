// pages/index.js
import { useState } from "react";

export default function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      console.error("Nenhum arquivo selecionado");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "https://borders-converter.squareweb.app/post",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } else {
        console.error("Erro ao fazer upload do arquivo");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    }
  };

  return (
    <div>
      <h1>Upload de Imagem</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Enviar Imagem</button>
      {imageSrc && (
        <div>
          <img src={imageSrc} alt="Imagem Processada" />
          <a href={imageSrc} download="resultado.jpg">
            Salvar Imagem
          </a>
        </div>
      )}
    </div>
  );
}
