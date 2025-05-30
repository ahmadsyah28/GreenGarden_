"use client";

// ✅ PERUBAHAN 1: Tambahkan import 'use' dari React
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FaTags, FaImage } from "react-icons/fa";

export default function BlogPreviewPage({ params }) {
  // ✅ PERUBAHAN 2: Gunakan use() untuk unwrap params Promise
  const { id } = use(params);
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs?id=${id}`);
        if (!response.ok) {
          throw new Error(`Gagal mengambil data blog: ${response.statusText}`);
        }
        const data = await response.json();
        setBlog(data);

        // Update views
        await fetch(`/api/blogs?id=${id}`, {
          method: "PUT",
          body: JSON.stringify({ views: data.views + 1 }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setError(error.message);
      }
    };
    fetchBlog();
  }, [id]);

  if (error) {
    return <div className="p-1 text-red-600">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="p-1">Loading...</div>;
  }

  // Format content for display
  const formatContent = (content) => {
    return content
      .replace(/# (.*?)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>')
      .replace(/### (.*?)$/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="p-1 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800">{blog.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mt-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold mr-2">
              {blog.category}
            </span>
            <span>
              {blog.author} •{" "}
              {new Date(blog.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="ml-2">• {blog.views} views</span>
          </div>
        </div>

        {blog.featuredImage ? (
          <div className="mb-6">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                console.error(`Gagal memuat gambar: ${blog.featuredImage}`);
                e.target.src = "/placeholder.png"; // Gambar placeholder
              }}
            />
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-center bg-gray-200 rounded-lg h-48">
            <FaImage className="text-gray-500 text-4xl" />
          </div>
        )}

        <div className="article-content">
          <div dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }} />
        </div>

        {blog.gallery.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Galeri</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {blog.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                  onError={(e) => {
                    console.error(`Gagal memuat gambar galeri: ${image}`);
                    e.target.src = "/placeholder.png";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {blog.tags.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <FaTags className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}