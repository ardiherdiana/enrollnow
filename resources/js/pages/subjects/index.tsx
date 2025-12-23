import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mata Kuliah', href: '/subjects' },
];

interface Subject {
    id: number;
    code: string;
    name: string;
    credits: number;
    type: string;
    status: string;
}

interface SubjectsIndexProps {
    subjects: {
        data: Subject[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
}

export default function SubjectsIndex({ subjects, filters }: SubjectsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [type, setType] = useState(filters.type || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams: any = { search };
        if (status && status !== 'all') searchParams.status = status;
        if (type && type !== 'all') searchParams.type = type;
        router.get('/subjects', searchParams, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
            router.delete(`/subjects/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mata Kuliah" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Mata Kuliah</h1>
                    <Link href="/subjects/create">
                        <Button><Plus className="size-4 mr-2" />Tambah Mata Kuliah</Button>
                    </Link>
                </div>

                <Card className="p-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Cari mata kuliah..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="board">Board</SelectItem>
                                <SelectItem value="non-board">Non-Board</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">Cari</Button>
                    </form>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-semibold">Kode</th>
                                    <th className="text-left p-4 font-semibold">Nama</th>
                                    <th className="text-left p-4 font-semibold">SKS</th>
                                    <th className="text-left p-4 font-semibold">Tipe</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-right p-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.data.length > 0 ? (
                                    subjects.data.map((subject) => (
                                        <tr key={subject.id} className="border-b hover:bg-accent/50">
                                            <td className="p-4 font-medium">{subject.code}</td>
                                            <td className="p-4">{subject.name}</td>
                                            <td className="p-4">{subject.credits}</td>
                                            <td className="p-4">{subject.type}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    subject.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {subject.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/subjects/${subject.id}`}>
                                                        <Button variant="ghost" size="icon"><Eye className="size-4" /></Button>
                                                    </Link>
                                                    <Link href={`/subjects/${subject.id}/edit`}>
                                                        <Button variant="ghost" size="icon"><Edit className="size-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)}>
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data mata kuliah
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

