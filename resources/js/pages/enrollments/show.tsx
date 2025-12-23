import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Enrollment', href: '/enrollments' }, 
    { title: 'Detail Enrollment', href: '#' }
];

interface Enrollment {
    id: number;
    status: string;
    student: { name: string; student_id: string };
    subject: { name: string; code: string };
    period: { name: string; academic_year: string };
    grade: {
        class_standing: number | string;
        periodical_exam: number | string;
        period_grade: number | string;
    } | null;
}

interface EnrollmentsShowProps {
    enrollment: Enrollment;
}

export default function EnrollmentsShow({ enrollment }: EnrollmentsShowProps) {
    const formatNumber = (value: number | string): string => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Enrollment" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/enrollments">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Detail Enrollment</h1>
                    </div>
                    <Link href={`/enrollments/${enrollment.id}/edit`}>
                        <Button>
                            <Edit className="size-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Informasi Enrollment</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Mahasiswa</p>
                                <p className="font-medium">
                                    {enrollment.student.name} ({enrollment.student.student_id})
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Mata Kuliah</p>
                                <p className="font-medium">
                                    {enrollment.subject.name} ({enrollment.subject.code})
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Periode</p>
                                <p className="font-medium">
                                    {enrollment.period.name} - {enrollment.period.academic_year}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                                    enrollment.status === 'completed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : enrollment.status === 'dropped'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {enrollment.status}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {enrollment.grade && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Nilai</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Class Standing (CS)</p>
                                    <p className="font-medium text-xl">{formatNumber(enrollment.grade.class_standing)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Periodical Exam (PE)</p>
                                    <p className="font-medium text-xl">{formatNumber(enrollment.grade.periodical_exam)}</p>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-sm text-muted-foreground">Nilai Periode</p>
                                    <p className="font-medium text-3xl">{formatNumber(enrollment.grade.period_grade)}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}


