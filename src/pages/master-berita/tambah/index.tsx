'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CKEditor, ClassicEditor } from '@/components/CKEditorWrapper';
import withAuth from '@/components/withAuth';
import Loading from '@/components/Spinner';
import { Input } from '@/components/common/Input';
import Swal from 'sweetalert2';
// import { MyClassicEditor } from '@/utils/ckeditorTypes';

function TambahBeritaPage() {
    const router = useRouter();
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate CKEditor content
        if (!deskripsi || deskripsi.replace(/<[^>]*>/g, '').trim() === '') {
            Swal.fire('Gagal', 'Konten tidak boleh kosong.', 'warning');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/master/berita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ judul, deskripsi }),
            });

            if (!response.ok) throw new Error('Gagal menambahkan berita');

            Swal.fire('Berhasil', 'Berita berhasil ditambahkan.', 'success');
            router.push('/master-berita');
        } catch (error) {
            console.error("Error adding berita:", error);
            Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan berita.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 p-6 bg-slate-50 min-h-screen">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">Tambah Berita</h1>
                {loading ? (
                    <Loading />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Judul"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konten
                            </label>
                            <div className="bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={deskripsi}
                                    config={{
                                        ckfinder: {
                                            uploadUrl: '/api/upload-image', // optional custom endpoint
                                        },
                                    }}
                                    onChange={(_, editor) => {
                                        const data = editor.getData();
                                        setDeskripsi(data);
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                        >
                            Simpan
                        </button>
                    </form>
                )}

                {/* Live Preview */}
                {deskripsi && (
                    <div className="mt-10 border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">Preview Konten</h2>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: deskripsi }}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}

export default withAuth(TambahBeritaPage);
