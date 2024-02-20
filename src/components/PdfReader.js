import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";
import "../PdfReader.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfReader = () => {
  const [pdfItems, setPdfItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  //   const [flag, setFlag] = useState(false);
  let flag = false;

  useEffect(() => {
    console.log(pdfItems);
  }, [pdfItems]);
  useEffect(() => {
    console.log(`bandera ${flag}`);
  }, [flag]);

  const extractText = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo PDF.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      const buffer = e.target.result;

      try {
        const pdfData = new Uint8Array(buffer);
        const pdfDoc = await pdfjs.getDocument({ data: pdfData }).promise;

        const yTolerance = 2;
        let items = [];

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const pageText = await page.getTextContent();

          pageText.items.forEach((item, index) => {
            console.log(item.str.trim());
            console.log(item.transform[4]);
            console.log(item.transform[5]);

            if (item.str.startsWith("Actividades Económicas")) {
              flag = true;
            }
            console.log(flag);

            if (item.str.trim() !== "") {
              const existingItem = items.find((existing, i) => {
                if (flag === false) {
                  return (
                    existing.coordenada.y >= item.transform[5] - yTolerance &&
                    existing.coordenada.y <= item.transform[5] + yTolerance &&
                    existing.page === page &&
                    existing.content === "" &&
                    i === items.length - 1
                  );
                } else {
                  return (
                    existing.coordenada.y === item.transform[5] + 12.236 &&
                    existing.page === page &&
                    existing.content === ""
                  );
                }
              });

              console.log(existingItem);

              if (existingItem && !item.str.includes(":")) {
                existingItem.content = ` ${item.str}`;
              } else {
                items.push({
                  text: item.str,
                  content: "",
                  coordenada: { x: item.transform[4], y: item.transform[5] },
                  page: page,
                });
              }
            }
          });
        }

        setPdfItems(items);
      } catch (error) {
        console.error("Error al procesar el PDF:", error);
        alert(
          "Error al procesar el PDF. Asegúrate de que es un archivo PDF válido."
        );
      }
    };

    fileReader.readAsArrayBuffer(selectedFile);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="pdf-reader-container">
      <label className="file-label" htmlFor="fileInput">
        Seleccionar PDF
      </label>
      <input
        id="fileInput"
        className="file-input"
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
      />
      <button className="extract-button" onClick={extractText}>
        Extraer Texto
      </button>
      <h1>Datos de Identificación del Contribuyente</h1>
      <p>
        RFC: {pdfItems.find((item) => item.text.startsWith("RFC"))?.content}
      </p>
      <p>
        CURP: {pdfItems.find((item) => item.text.startsWith("CURP"))?.content}
      </p>
      <p>
        Nombre:
        {pdfItems.find((item) => item.text.startsWith("Nombre "))?.content}
        {
          pdfItems.find((item) => item.text.startsWith("Primer Apellido"))
            ?.content
        }
        {
          pdfItems.find((item) => item.text.startsWith("Segundo Apellido"))
            ?.content
        }
      </p>
      <p>
        Fecha de inicio de operaciones:{" "}
        {
          pdfItems.find((item) =>
            item.text.startsWith("Fecha inicio de operaciones")
          )?.content
        }
      </p>
      <p>
        Estatus en el padrón:{" "}
        {
          pdfItems.find((item) => item.text.startsWith("Estatus en el padrón"))
            ?.content
        }
      </p>
      <p>
        Fecha de último cambio de estado:{" "}
        {
          pdfItems.find((item) =>
            item.text.startsWith("Fecha de último cambio de estado:")
          )?.content
        }
      </p>
      <p>
        Nombre Comercial:{" "}
        {
          pdfItems.find((item) => item.text.startsWith("Nombre Comercial"))
            ?.content
        }
      </p>

      <h1>Datos del domicilio registrado</h1>
      <p>
        Codigo Postal:{" "}
        {
          pdfItems.find((item) => item.text.startsWith("Código Postal"))
            ?.content
        }
      </p>
      <p>
        Tipo de Vialidad:
        {
          pdfItems.find((item) => item.text.startsWith("Tipo de Vialidad"))
            ?.content
        }
      </p>
      <p>
        Nombre de vialidad:
        {
          pdfItems.find((item) => item.text.startsWith("Nombre de Vialidad"))
            ?.content
        }
      </p>

      <p>
        Numero Exterior:
        {
          pdfItems.find((item) => item.text.startsWith("Número Exterior:"))
            ?.content
        }
      </p>
      <p>
        Numero Interior:
        {
          pdfItems.find((item) => item.text.startsWith("Número Interior:"))
            ?.content
        }
      </p>
      <p>
        Nombre de la Colonia:
        {
          pdfItems.find((item) => item.text.startsWith("Nombre de la Colonia:"))
            ?.content
        }
      </p>
      <p>
        Nombre de la Localidad:
        {
          pdfItems.find((item) =>
            item.text.startsWith("Nombre de la Localidad:")
          )?.content
        }
      </p>
      <p>
        Nombre del Municipio o Demarcación Territorial:
        {
          pdfItems.find((item) =>
            item.text.startsWith(
              "Nombre del Municipio o Demarcación Territorial"
            )
          )?.content
        }
      </p>
      <p>
        Nombre de la Entidad Federativa:
        {
          pdfItems.find((item) =>
            item.text.startsWith("Nombre de la Entidad Federativa")
          )?.content
        }
      </p>
      <p>
        Entre Calle:
        {pdfItems.find((item) => item.text.startsWith("Entre Calle"))?.content}
      </p>
      <p>
        Y calle:
        {pdfItems.find((item) => item.text.startsWith("Y Calle"))?.content}
      </p>
      <h1>Actividades Economicas</h1>
      <p>
        Orden:
        {pdfItems.find((item) => item.text.startsWith("Orden"))?.content}
      </p>
      <p>
        Actividad Económica:
        {
          pdfItems.find((item) => item.text.startsWith("Actividad Económica"))
            ?.content
        }
      </p>
      <p>
        Porentaje:
        {pdfItems.find((item) => item.text.startsWith("Porcentaje"))?.content}
      </p>
      <p>
        Fecha Inicio:
        {pdfItems.find((item) => item.text.startsWith("Fecha Inicio"))?.content}
      </p>
      <p>
        Fecha Fin:
        {pdfItems.find((item) => item.text.startsWith("Fecha Fin"))?.content}
      </p>
    </div>
  );
};

export default PdfReader;
