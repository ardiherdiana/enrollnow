import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Enrollment {
    id: number;
    status: string;
    student: { name: string; student_id: string };
    subject: { name: string; code: string };
    period: { name: string };
    grade: { period_grade: number | string } | null;
}

interface EnrollmentsIndexProps {
    enrollments: { data: Enrollment[]; links: any; meta: any };
    isAdmin?: boolean;
}

export default function EnrollmentsIndex({ enrollments, isAdmin = true }: EnrollmentsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = isAdmin 
        ? [{ title: 'Enrollment', href: '/enrollments' }]
        : [{ title: 'Enrollment Saya', href: '/student/enrollments' }];

    const handleDelete = (id: number) => {
        if (confirm('Hapus enrollment ini?')) {
            router.delete(`/enrollments/${id}`, { preserveScroll: true });
        }
    };

    const formatNumber = (value: number | string | null | undefined): string => {
        if (value === null || value === undefined) return '-';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '-' : num.toFixed(2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enrollment" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isAdmin ? 'Daftar Enrollment' : 'Enrollment Saya'}</h1>
                    {isAdmin ? (
                        <Link href="/enrollments/create"><Button><Plus className="size-4 mr-2" />Tambah Enrollment</Button></Link>
                    ) : (
                        <Link href="/student/enrollments/create"><Button><Plus className="size-4 mr-2" />Pilih Mata Kuliah</Button></Link>
                    )}
                </div>
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    {isAdmin && <th className="text-left p-4 font-semibold">Mahasiswa</th>}
                                    <th className="text-left p-4 font-semibold">Mata Kuliah</th>
                                    <th className="text-left p-4 font-semibold">Periode</th>
                                    <th className="text-left p-4 font-semibold">Nilai</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                    {isAdmin && <th className="text-right p-4 font-semibold">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.data.length > 0 ? (
                                    enrollments.data.map((enrollment: Enrollment) => (
                                        <tr key={enrollment.id} className="border-b hover:bg-accent/50">
                                            {isAdmin && <td className="p-4">{enrollment.student.name} ({enrollment.student.student_id})</td>}
                                            <td className="p-4">{enrollment.subject.name} ({enrollment.subject.code})</td>
                                            <td className="p-4">{enrollment.period.name}</td>
                                            <td className="p-4">{formatNumber(enrollment.grade?.period_grade)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    enrollment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                    enrollment.status === 'dropped' ? 'bg-red-100 text-red-800' : 
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {enrollment.status === 'enrolled' ? 'Terdaftar' :
                                                     enrollment.status === 'completed' ? 'Selesai' : 'Dropped'}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/enrollments/${enrollment.id}`}><Button variant="ghost" size="icon"><Eye className="size-4" /></Button></Link>
                                                        <Link href={`/enrollments/${enrollment.id}/edit`}><Button variant="ghost" size="icon"><Edit className="size-4" /></Button></Link>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(enrollment.id)}><Trash2 className="size-4 text-destructive" /></Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={isAdmin ? 6 : 4} className="p-8 text-center text-muted-foreground">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

