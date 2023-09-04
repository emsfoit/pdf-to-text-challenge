"use client";
import styles from "./styles.module.css";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [inDropZone, setInDropZone] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] ?? null;
    if (file) {
      convertPdfToText(file);
    }
  };

  const reset = () => {
    setText("");
    setErr("");
  };

  const selectFile = () => {
    document?.getElementById("file__input")?.click();
  };

  const convertPdfToText = async (file: File) => {
    reset();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios
      .post("http://localhost:3001/pdf/convert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setText(res.data);
      })
      .catch((err) => {
        setErr("Error: Could not convert pdf to text");
        alert("Error: Could not convert pdf to text");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "text.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setInDropZone(true);
  };

  // onDragLeave sets inDropZone to false
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setInDropZone(false);
  };

  // onDragOver sets inDropZone to true
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
      setInDropZone(true);
    }
  };

  // onDrop sets inDropZone to false and adds files to fileList
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    if (!e?.dataTransfer?.files) return
    

    if (!e.dataTransfer.files[0]) return

    if (e.dataTransfer.files[0].name.split('.').pop() != 'pdf') return

    const file = e.dataTransfer.files[0];
      convertPdfToText(file);
      setInDropZone(false);
  };

  return (
    <main>
      <h1 className={styles.title}>PFF To Text </h1>
      <div>
        <div
          className={styles.uploadFileButton}
          onClick={selectFile}
          onDragEnter={(e) => handleDragEnter(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDragLeave={(e) => handleDragLeave(e)}
          onDrop={(e) => handleDrop(e)}
        >
          { !inDropZone && ( <div>
            {text ? "Choose another file" : "Choose a pdf file"} <br/>
            or drag &amp; drop a file here
          </div>)}
          {inDropZone && ( <div>
            Drop file here
          </div>)}
        </div>
        <input
          className="hidden"
          name="files"
          type="file"
          id="file__input"
          accept=".pdf"
          onChange={onChange}
        />
      </div>
      {loading && <div className="text-blue-500">Loading...</div>}
      {err && <div className="text-red-500">{err}</div>}
      {text && (
        <div>
          <h2 className={styles.resultTitle}>Text Result:</h2>
          <div className={`text-green-500 ${styles.resultTextContainer}`}>
            {text}
          </div>
          <ul className={styles.buttonsList}>
            <li onClick={copyText}>Copy Text</li>
            <li onClick={downloadAsText}>Download</li>
          </ul>
        </div>
      )}
    </main>
  );
}
