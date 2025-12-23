import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Nilai', href: '/grades' }];

interface GradeItem {
    id: number;
    class_standing: number | string;
    periodical_exam: number | string;
    period_grade: number | string;
    enrollment: {
        student: { name: string; student_id: string } | null;
        subject: { name: string; code: string } | null;
        period: { name: string } | null;
    } | null;
    period: {
        id: number;
        name: string;
        academic_year: string;
    } | null;
}

interface GradesIndexProps {
    grades: { data: GradeItem[]; links: any; meta: any };
}

export default function GradesIndex({ grades }: GradesIndexProps) {
    const page = usePage();
    const auth = (page.props as any)?.auth;
    const isAdmin = auth?.user?.role === 'admin';
    const handleDelete = (id: number) => {
        if (confirm('Hapus nilai ini?')) {
            router.delete(`/grades/${id}`, { preserveScroll: true });
        }
    };

    const getGradeLetter = (score: number | string) => {
        const numScore = typeof score === 'string' ? parseFloat(score) : score;
        if (numScore >= 90) return 'A';
        if (numScore >= 85) return 'A-';
        if (numScore >= 80) return 'B+';
        if (numScore >= 70) return 'B';
        if (numScore >= 65) return 'B-';
        if (numScore >= 60) return 'C+';
        if (numScore >= 50) return 'C';
        return 'D';
    };

    const formatNumber = (value: number | string | null | undefined): string => {
        if (value === null || value === undefined) return '0.00';
        const num = typeof value === 'string' ? parseFloat(value) : Number(value);
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nilai" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isAdmin ? 'Daftar Nilai' : 'Nilai Saya'}</h1>
                    {isAdmin && (
                        <Link href="/grades/create"><Button><Plus className="size-4 mr-2" />Tambah Nilai</Button></Link>
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
                                    <th className="text-left p-4 font-semibold">CS</th>
                                    <th className="text-left p-4 font-semibold">PE</th>
                                    <th className="text-left p-4 font-semibold">Nilai</th>
                                    <th className="text-left p-4 font-semibold">Huruf</th>
                                    {isAdmin && <th className="text-right p-4 font-semibold">Aksi</th>}
                                    {!isAdmin && <th className="text-right p-4 font-semibold">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {grades.data.length > 0 ? (
                                    grades.data.map((grade) => (
                                        <tr key={grade.id} className="border-b hover:bg-accent/50">
                                            {isAdmin && <td className="p-4">{grade.enrollment?.student?.name || 'N/A'}</td>}
                                            <td className="p-4">{grade.enrollment?.subject?.name || 'N/A'}</td>
                                            <td className="p-4">
                                                {grade.period?.name || grade.enrollment?.period?.name || 'N/A'}
                                                {grade.period?.academic_year && ` (${grade.period.academic_year})`}
                                            </td>
                                            <td className="p-4">{formatNumber(grade.class_standing)}</td>
                                            <td className="p-4">{formatNumber(grade.periodical_exam)}</td>
                                            <td className="p-4 font-medium">{formatNumber(grade.period_grade)}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    (typeof grade.period_grade === 'string' ? parseFloat(grade.period_grade) : grade.period_grade) >= 50 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {getGradeLetter(grade.period_grade)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/grades/${grade.id}`}><Button variant="ghost" size="icon"><Eye className="size-4" /></Button></Link>
                                                    {isAdmin && (
                                                        <>
                                                            <Link href={`/grades/${grade.id}/edit`}><Button variant="ghost" size="icon"><Edit className="size-4" /></Button></Link>
                                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(grade.id)}><Trash2 className="size-4 text-destructive" /></Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={isAdmin ? 8 : 7} className="p-8 text-center text-muted-foreground">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

