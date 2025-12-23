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
    {
        title: 'Mahasiswa',
        href: '/students',
    },
];

interface Student {
    id: number;
    student_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    created_at: string;
}

interface StudentsIndexProps {
    students: {
        data: Student[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function StudentsIndex({ students, filters }: StudentsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/students', { search, status }, { preserveState: true });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get('/students', { search, status: value }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) {
            router.delete(`/students/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Mahasiswa</h1>
                    <Link href="/students/create">
                        <Button>
                            <Plus className="size-4 mr-2" />
                            Tambah Mahasiswa
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari mahasiswa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={status || 'all'} onValueChange={(value) => handleStatusChange(value === 'all' ? '' : value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Semua Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                <SelectItem value="graduated">Lulus</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">Cari</Button>
                    </form>
                </Card>

                {/* Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-semibold">NIM</th>
                                    <th className="text-left p-4 font-semibold">Nama</th>
                                    <th className="text-left p-4 font-semibold">Email</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    <th className="text-right p-4 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.length > 0 ? (
                                    students.data.map((student) => (
                                        <tr key={student.id} className="border-b hover:bg-accent/50">
                                            <td className="p-4">{student.student_id}</td>
                                            <td className="p-4 font-medium">{student.name}</td>
                                            <td className="p-4 text-muted-foreground">
                                                {student.email || '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    student.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : student.status === 'graduated'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {student.status === 'active' ? 'Aktif' :
                                                     student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/students/${student.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/students/${student.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(student.id)}
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            Tidak ada data mahasiswa
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {students.links && students.links.length > 3 && (
                        <div className="flex items-center justify-center gap-2 p-4 border-t">
                            {students.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded-md ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-accent'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}

