"use client";
import { useState } from "react";
import Image from "next/image";

interface UploadImageProps {
  name: string;
  onUploaded?: (url: string) => void;
}

export default function UploadImage({ name, onUploaded }: UploadImageProps) {
  const [image, setImage] = useState<string | null>(null);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setImage(data.url);

        const hiddenInput = document.querySelector(
          `input[name='${name}']`
        ) as HTMLInputElement;

        if (hiddenInput) hiddenInput.value = data.url;

        if (onUploaded) {
          onUploaded(data.url);
        }
      } else {
        console.error("Không nhận được URL từ API.");
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border p-2 w-full"
      />
      {image && (
        <div className="relative w-32 h-32 mt-2 border rounded overflow-hidden">
          <Image
            src={image}
            alt="Hình ảnh đã upload"
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      )}
      {/* Input hidden để lưu URL nếu cần submit form */}
      <input type="hidden" name={name} />
    </div>
  );
}
