import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Periode', href: '/periods' }, { title: 'Detail Periode' }];

interface Period {
    id: number;
    name: string;
    academic_year: string;
    semester: string;
    start_date: string;
    end_date: string;
    status: string;
    enrollments: Array<{
        id: number;
        student: { name: string; student_id: string };
        subject: { name: string; code: string };
        grade: { period_grade: number | string } | null;
    }>;
}

interface PeriodsShowProps {
    period: Period;
}

export default function PeriodsShow({ period }: PeriodsShowProps) {
    const formatNumber = (value: number | string | null | undefined): string => {
        if (value === null || value === undefined) return '-';
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '-' : num.toFixed(2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Periode" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/periods">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Detail Periode</h1>
                    </div>
                    <Link href={`/periods/${period.id}/edit`}>
                        <Button>
                            <Edit className="size-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Informasi Periode</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Nama</p>
                                <p className="font-medium">{period.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Ajaran</p>
                                <p className="font-medium">{period.academic_year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Semester</p>
                                <p className="font-medium">{period.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                                <p className="font-medium">
                                    {new Date(period.start_date).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                                <p className="font-medium">
                                    {new Date(period.end_date).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                                    period.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : period.status === 'completed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {period.status}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Enrollments ({period.enrollments.length})</h2>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {period.enrollments.length > 0 ? (
                                period.enrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="border-b pb-2 last:border-0">
                                        <p className="font-medium text-sm">
                                            {enrollment.student.name} - {enrollment.subject.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {enrollment.student.student_id} | {enrollment.subject.code}
                                        </p>
                                        {enrollment.grade && (
                                            <p className="text-xs font-medium mt-1">
                                                Nilai: {formatNumber(enrollment.grade.period_grade)}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada enrollment</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}


