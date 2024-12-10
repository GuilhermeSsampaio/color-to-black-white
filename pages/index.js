// pages/index.js
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [imageSrcs, setImageSrcs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      console.error("Nenhum arquivo selecionado");
      return;
    }

    const zip = new JSZip();
    const promises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

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
          setImageSrcs((prev) => [...prev, url]);
          zip.file(file.name, blob);
        } else {
          console.error("Erro ao fazer upload do arquivo");
        }
      } catch (error) {
        console.error("Erro ao conectar com a API:", error);
      }
    });

    await Promise.all(promises);

    if (selectedFiles.length > 1) {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "resultados.zip");
      });
    }
  };

  return (
    <div>
      <h1>Upload de Imagem</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadFiles}>Enviar Imagens</button>
      {imageSrcs.length > 0 && (
        <div>
          {imageSrcs.map((src, index) => (
            <div key={index}>
              <img src={src} alt={`Imagem Processada ${index + 1}`} />
              <a href={src} download={`resultado${index + 1}.jpg`}>
                Salvar Imagem
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
